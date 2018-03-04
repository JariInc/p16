# VPC stack

## Create VPC stack

`aws cloudformation create-stack --stack-name p16-vpc --template-body file://vpc.yaml --parameters file://vpc-parameters.json`

## Update stack

`aws cloudformation update-stack --stack-name p16-vpc --template-body file://vpc.yaml --parameters file://vpc-parameters.json`

# ECS stack

## Create VPC stack

`aws cloudformation create-stack --stack-name p16-ecs --capabilities CAPABILITY_IAM --template-body file://ecs.yaml --parameters file://ecs-parameters.json`
