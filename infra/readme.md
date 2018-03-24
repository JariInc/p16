# Master stack

## Create 

### Create S3 bucket

`aws s3 mb s3://p16-cfn`

### Upload templates

`aws s3 cp . s3://p16-cfn  --exclude '*' --include '*.yaml' --exclude 'master.yaml' --recursive`

### Create stack

`aws cloudformation create-stack --stack-name p16-master --template-body file://master.yaml --parameters file://master-parameters.json --capabilities CAPABILITY_IAM`

## Update

### Create change set

`aws cloudformation create-change-set --stack-name p16-master --template-body file://master.yaml --parameters file://master-parameters.json --capabilities CAPABILITY_IAM --change-set-name Edit`

### View change set

`aws cloudformation describe-change-set --stack-name p16-master --change-set-name Edit`

### Apply change set

`aws cloudformation execute-change-set --stack-name p16-master --change-set-name Edit`