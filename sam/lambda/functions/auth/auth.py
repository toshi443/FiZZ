import sys, os

moduledir = os.getcwd() + '/.venv/lib/python3.6/site-packages'
sys.path.append(moduledir)

import simplejson as json
import boto3
import traceback
import botocore
import hmac
import hashlib
import base64
import warrant
import uuid

from datetime import datetime
from pytz import timezone

class DB:
    main_table = "Accounts"

    def __init__(self):
        if os.getenv("AWS_SAM_LOCAL"):
            self.db_client = boto3.resource(
                'dynamodb',
                endpoint_url="http://localhost:8000"
            )
        else:
            self.db_client = boto3.resource('dynamodb')

    def create(self, userId, username, email):
        utc = str(datetime.now())
        item = {
            'userId': userId,
            'username': username,
            'email': email,
            'provider': 'cognito',
            'isAdmin': False,
            'updatedAt': utc,
            'createdAt': utc
        }

        success, attr = self.validates(item)

        if success:
            self.db_client.Table(DB.main_table).put_item(Item=item);
            return (item, None)

        return (None, attr)

    def update(self, id):
        utc = datetime.now(timezone('UTC'))
        item = {
            'updatedAt': utc
        }

        success, attr = self.validates(item)

        if success:
            updates = {}
            for k, v in item:
                if v is not None:
                    updates[k] = { 'Action': 'PUT', 'Value': v}

            resp = self.db_client.Table("").update_item(
                Key={'id': id },
                AttributeUpdates=updates,
                ReturnValues="ALL_NEW"
            )
            return (resp, None)
        return (None, attr)


    def get(self, id):
        self.query("", 'id', id)

    def validates(self,item):
        error = {}
        return (True, error)


class Cognito:

    def __init__(self):
        self.identity_pool_id = os.getenv("AWS_IDENTITY_POOL_ID")
        self.user_pool_id = os.getenv("AWS_USER_POOL_ID")
        self.client_id = os.getenv("AWS_CLIENT_ID")
        self.region = os.getenv("AWS_REGION")

        print(repr(f"Info: Env >> User Pool :****{self.user_pool_id[10:15]}****, Client: {self.client_id[:5]}****"))

        if self.identity_pool_id is None or self.user_pool_id is None or self.client_id is None or self.region is None:
            raise TypeError(f"'NoneType' object is not acceptable. you must set variables idp: {self.identity_pool_id}, up:{self.user_pool_id}, cl:{self.client_id}, rg:{self.region}")

        self.identity_client = boto3.client('cognito-identity')
        return

    def client(self, username=None, id_token=None, refresh_token=None, access_token=None):
        u = warrant.Cognito(
            self.user_pool_id,
            self.client_id,
            user_pool_region=self.region,
            username=username,
            id_token=id_token,
            refresh_token=refresh_token,
            access_token=access_token
        )
        return u

    def return_auth(self, auth):
        ret = {
            'tokens': {
                'tokenType': auth.token_type,
                'idToken': auth.id_token,
                'accessToken': auth.access_token,
                'refreshToken': auth.refresh_token
            },
            'username': auth.username
        }
        print(auth)
        return ret


    def sign_up(self, userId, email, password):
        u = self.client()
        u.add_base_attributes(email=email)
        return u.register(userId, password)

    def login(self, email, password):
        u = self.client(username=email)
        u.authenticate(password=password)
        return self.return_auth(u)

    def get_session(self, id_token):
        return self.identity_client.get_id(
            IdentityPoolId=self.identity_pool_id,
            Logins={
                f"cognito-idp.{self.user_pool_region}.amazonaws.com/{self.user_pool_id}": id_token
            }
        )

    def get_credentials_for_identity(self, identity_id, id_token=None):
        params = {
            'IdentityId': identity_id,
        }
        if id_token is not None:
            params['Logins'] = {
                f"cognito-idp.{self.user_pool_region}.amazonaws.com/{self.user_pool_id}": id_token
            }
        return self.identity_client.get_credentials_for_identity(**params)

    def refresh(self, refresh_token):
        u = self.client(refresh_token=refresh_token)
        u.renew_access_token()
        user = u.client.get_user(AccessToken=u.access_token)
        u.username = user.get("Username")
        return self.return_auth(u)

    def logout(self, id_token, access_token, refresh_token):
        u = self.client(id_token=id_token, access_token=access_token, refresh_token=refresh_token)
        u.logout()
        return self.return_auth(u)

####################### API #########################

def login(event, context):
    # Error Handling
    try:
        body = json.loads(event['body'])
        email = body['email']
        password = body['password']
        print(f'Info: User Login Request {email}')
        cognito = Cognito()
        ret = cognito.login(email, password)
        return {
            "headers":  {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Method": "POST"
            },
            "statusCode": 200,
            "body": json.dumps(ret, use_decimal=True)
        }
    except:
        traceback.print_exc()

    return {'statusCode': 400, 'body': 'Request Failed'}


def refresh(event, context):
    try:
        body = json.loads(event['body'])
        # header?
        refresh_token = body['refreshToken']
        cognito = Cognito()
        resp = cognito.refresh(refresh_token)
        return {
            "headers":  {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Method": "POST"
            },
            "statusCode": 200,
            "body": json.dumps(resp)
        }
    except:
        traceback.print_exc()
    return {'statusCode': 400, 'body': 'Request Failed'}


def sign_up(event, context):
    try:
        db = DB()
        body = json.loads(event['body'])
        userId = str(uuid.uuid4())
        username = body['username']
        email = body['email']
        password = body['password']
        print(f'Info: User SignUp Request {username}:{email}')
        cognito = Cognito()
        resp = cognito.sign_up(userId, email, password)
        response, error = db.create(userId, username, email)
        print(response)
        return {
            "headers":  { "Access-Control-Allow-Origin" : "*" },
            'statusCode': 201,
            "body": json.dumps(resp['UserConfirmed'])
        }
    except:
        traceback.print_exc()

    return {'statusCode': 400, 'body': 'Request Failed'}

def logout(event, context):
    try:
        body = json.loads(event['body'])
        #paramete check
        id_token = body['idToken']
        access_token = body['accessToken']
        refresh_token = body['refreshToken']
        cognito = Cognito()
        resp = cognito.logout(id_token, access_token, refresh_token)
        return {
            "headers":  {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Method": "POST"
            },
            "statusCode": 200,
            "body": json.dumps(resp)
        }
    except:
        traceback.print_exc()
    return {'statusCode': 400, 'body': 'Request Failed'}



def handler(event, context):
    print(event)
    proxy = event['pathParameters']['proxy']
    try:
        if event['httpMethod'] == 'GET':
            pass
        elif event['httpMethod'] == 'POST':
            if proxy == 'signup':
                return sign_up(event, context)
            elif proxy == 'login':
                return login(event, context)
            elif proxy == 'refresh':
                return refresh(event, context)
            elif proxy == 'logout':
                return logout(event, context)
        elif event['httpMethod'] == 'PUT':
            pass
        return {'statusCode': 400, 'body': 'Request Failed'}
    except BaseException as e:
        traceback.print_exc()
        return {'statusCode': 500, 'body': 'Request Failed'}
