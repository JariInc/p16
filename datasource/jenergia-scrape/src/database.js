import dotenv from 'dotenv'
import { InfluxDB, FieldType, escape } from 'influx';
import map from 'lodash/map'; 
import logger from './logger';
import moment from 'moment-timezone';

dotenv.config();

const influx = new InfluxDB({
  host: process.env.INFLUX_HOST,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASSWORD,
  database: process.env.INFLUX_DATABASE,
  port: process.env.INFLUX_PORT,
  protocol: process.env.INFLUX_PROTOCOL,
  schema: [
    {
      measurement: 'jenergia',
      fields: {
        consumption: FieldType.FLOAT,
      },
      tags: [
        'meteringPointCode',
      ]
    }
  ]
})

async function getDatabase() {
  return new Promise((resolve, reject) => {
    influx.getDatabaseNames()
      .then(names => {
        if (!names.includes(process.env.INFLUX_DATABASE)) {
          influx.createDatabase(process.env.INFLUX_DATABASE)
            .then(resolve);
        } else {
          resolve();
        }
      })
      .catch(err => {
        logger.error(err);
        reject('Error creating Influx database!');
      });
  });
}

export function saveDataPoints(data) {
  const write = getDatabase().then(() => {
    logger.info('Writing data points');
    influx.writePoints(map(data, (dataPoint) => {
      return {
        measurement: 'jenergia',
        tags: {
          meteringPointCode: process.env.JENERGIA_METERING_POINT_CODE 
        },
        fields: { consumption: dataPoint.energy },
        timestamp: dataPoint.timestamp.toDate(),
      };
    }))
  });

  write.catch(err => {
    logger.error(err);
  });

  return write;
}

export async function getLatestTimestamp() {
  logger.debug('Getting database instance');

  const query = getDatabase().then(() => {
    logger.debug('Getting latest timestamp');
    
    return influx.query(`
      SELECT * 
        FROM jenergia
       WHERE meteringPointCode = ${escape.stringLit(process.env.JENERGIA_METERING_POINT_CODE)}
    ORDER BY time DESC
       LIMIT 1
    `).then(result => {
      const item = result.pop();

      if(item) {
        return moment(item.time.getNanoTime() / 1000000);
      } else {
        return moment('1970-01-01');
      }
    });
  });

  query.catch(err => {
    logger.error(err);
  });

  return query; 
}
