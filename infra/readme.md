# TODO

* Grafana container
* Backup to EFS
* Split ECS stack
* Telegraf on node

# VPC stack

## Create stack

`aws cloudformation create-stack --stack-name p16-vpc --template-body file://vpc.yaml --parameters file://vpc-parameters.json`

## Create change set

`aws cloudformation create-change-set --stack-name p16-vpc --template-body file://vpc.yaml --parameters file://vpc-parameters.json --change-set-name Foo`

# EFS stack

`aws cloudformation create-stack --stack-name p16-efs --template-body file://efs.yaml`

## Create change set

`aws cloudformation create-change-set --stack-name p16-efs --template-body file://efs.yaml --change-set-name Foo`

# ECS stack

## Create stack

`aws cloudformation create-stack --stack-name p16-ecs --capabilities CAPABILITY_IAM --template-body file://ecs.yaml --parameters file://ecs-parameters.json`

## Create change set

`aws cloudformation create-change-set --stack-name p16-ecs --capabilities CAPABILITY_IAM --template-body file://ecs.yaml --parameters file://ecs-parameters.json --change-set-name Foo`

# Route53 stack

`aws cloudformation create-stack --stack-name p16-route53 --template-body file://route53.yaml --parameters file://route53-parameters.json`

## Create change set

`aws cloudformation create-change-set --stack-name p16-route53 --template-body file://route53.yaml --parameters file://route53-parameters.json --change-set-name Foo`
