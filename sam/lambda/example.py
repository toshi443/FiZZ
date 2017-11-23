import os
import json
import boto3

from pytz import timezone
from datetime import datetime
import uuid

# TODO: Check Parameters
# TODO: Validates
# TODO: Error and Exception Handling
# TODO: Manage Return Value

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

    def create(self):
        utc = datetime.now(timezone('UTC'))
        item = {
            'uuid': uuid.uuid4(),
            'updatedAt': utc,
            'createdAt': utc
        }

        success, attr = self.validates(item)

        if success:
            self.db_client.Table(DB.main_table).put_item(Item=item);
            return (item, None)

        return (None, attr)

    def update(self, uuid):
        utc = datetime.now(timezone('UTC'))
        item = {
            'updatedAt': utc
        }

        success, attr = self.validates(item):

        if success:
            updates = {}
            for k, v in item:
                if v is not None:
                    updates[k] = { 'Action': 'PUT', 'Value': v}

            resp = self.db_client.Table(DB.main_table).update_item(
                Key={'uuid': uuid },
                AttributeUpdates=updates,
                ReturnValues="ALL_NEW"
            )
            return (resp, None)
        return (None, attr)



    def query(self, table_name, key, value):
        table = self.db_client.Table(table_name)
        try:
            res = table.query(
                KeyConditionExpression = Key(key).eq(value)
            )
            return res
        except Exception as e:
            print(e.__doc__)
            return e

    def get(self, uuid):
        self.query(DB.main_table, 'uuid', uuid)

    def scan(self):
        # self.scan()
        return

    def validates(item):
        error = {}
        return (True, error)

####################### API #########################

def example(event, context):
    # Error Handling
    # Parameters Check
    # Return Response
    return {'statusCode': 400, 'body': 'Request Failed'}

def handler(event, context):
    try:
        if event['httpMethod'] == 'GET':
            break
        elif event['httpMethod'] == 'POST':
            break
        elif event['httpMethod'] == 'PUT':
            break
        return {'statusCode': 400, 'body': 'Request Failed'}
    except BaseException as e:
        print(e)
        return {'statusCode': 500, 'body': 'Request Failed'}
