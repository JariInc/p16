const ruuvi = require('node-ruuvitag');
const Influx = require('influx');
require('dotenv').config()

const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASSWORD,
  database: process.env.INFLUX_DATABASE,
  port: process.env.INFLUX_PORT,
  protocol: process.env.INFLUX_PROTOCOL,
  schema: [
    {
      measurement: 'measurement',
      fields: {
        temperature: Influx.FieldType.FLOAT,
        pressure: Influx.FieldType.FLOAT,
        humidity: Influx.FieldType.FLOAT,
        battery: Influx.FieldType.FLOAT,
        rssi: Influx.FieldType.INTEGER,
      },
      tags: [
        'sensor',
        'location'
      ]
    }
  ]
})

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(process.env.INFLUX_DATABASE)) {
      return influx.createDatabase(process.env.INFLUX_DATABASE);
    }
  })
  .then(() => {
    ruuvi.on('found', tag => {
      console.log('Found RuuviTag, id: ' + tag.id);
      tag.on('updated', data => {
        influx.writePoints([
          {
            measurement: 'measurement',
            tags: { sensor: tag.id },
            fields: {
                temperature: data.temperature,
                pressure: data.pressure,
                humidity: data.humidity,
                battery: data.battery,
                rssi: data.rssi,
            },
          }
        ]).catch(err => {
          console.error(`Error saving data to InfluxDB! ${err.stack}`)
        });

      });
    });
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  });