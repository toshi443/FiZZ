SHELL := /bin/bash
PY_VERSION := 3.6

# include ../../.env.dev
# export $(shell sed 's/=.*//' ../../.env.dev)

export PYTHONUNBUFFERED := 1

export AWS_PROFILE := sandbox
STACK_NAME := fizz-backend-dev

BASE := $(shell /bin/pwd)
VENV_DIR := $(BASE)/.venv
export PATH := var:$(PATH):$(VENV_DIR)/bin

PYTHON := $(shell /usr/bin/which python$(PY_VERSION))
VIRTUALENV := $(PYTHON) -m venv
ZIP_FILE := $(BASE)/bundle.zip

.DEFAULT_GOAL := build
.PHONY: build clean release describe deploy package bundle bundle.local


build:
	$(VIRTUALENV) "$(VENV_DIR)"
	"$(VENV_DIR)/bin/pip$(PY_VERSION)" \
		--isolated \
		--disable-pip-version-check \
		install -Ur requirements.txt

bundle.local:
	zip -r -9 "$(ZIP_FILE)" functions
	cd "$(VENV_DIR)/lib/python$(PY_VERSION)/site-packages" \
		&& zip -r9 "$(ZIP_FILE)" *
	cd "$(VENV_DIR)/lib64/python$(PY_VERSION)/site-packages" \
		&& zip -r9 "$(ZIP_FILE)" *

bundle:
	docker run --rm -v $$PWD:/var/task -it lambci/lambda:build-python3.6 /bin/bash -c 'make clean build bundle.local'

NOW=20171205

TEMPLATE=template.yml

package:
	docker-compose run --rm sam package \
		--template-file lambda/${TEMPLATE} \
		--s3-bucket fizz-backend-dev \
		--s3-prefix deploy/${NOW} \
		--output-template-file lambda/packaged.yml \
		--region us-east-1

# include ../../.env.dev
# export

# include ../../.env.dev
# export $(shell sed 's/=.*//' ../../.env.dev)
#
# deploy:
# 	docker-compose run --rm sam deploy \
# 		--template-file lambda/packaged.yml \
# 		--stack-name $(STACK_NAME) \
# 		--capabilities CAPABILITY_IAM \
# 		--parameter-overrides AwsClientId=${AWS_CLIENT_ID} AwsUserPoolId=${AWS_USER_POOL_ID} AwsIdentityPoolId=${AWS_IDENTITY_POOL_ID} \
# 		--region us-east-1

# call this in case of errors
describe:
	aws cloudformation describe-stack-events --stack-name $(STACK_NAME)

release:
	@make bundle
	@make package
	@make deploy

clean:
	rm -rf "$(VENV_DIR)" "$(BASE)/var" "$(BASE)/__pycache__" "$(ZIP_FILE)"
