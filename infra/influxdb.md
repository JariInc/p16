# InfluxDB

## Initilization ##

InfluxDB is created with root-user. The users password is generated on first run and outputted to stdout, which can be found on CloudWatch logs.

To create users and databases, install influxdb client and connect to your database

`influx -host influxdb.yourdomain.com -port 8086 -ssl -username root -password yourpassword` 

Run following IQL commands

```
CREATE USER grafana WITH PASSWORD '[grafana password]'
CREATE DATABASE telegraf
CREATE USER telegraf WITH PASSWORD '[telegraf password from cfn template]'
GRANT WRITE ON telegraf TO telegraf
GRANT READ ON telegraf TO grafana
```