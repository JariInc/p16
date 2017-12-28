import remove from 'lodash/remove'; 
import logger from './logger';
import fetchData from './fetch';
import parseData from './parse';
import { getLatestTimestamp, saveDataPoints } from './database';

exports.handler = async function(event, context, callback) {
  logger.info('jenergia-scrape started');

  const latest = await getLatestTimestamp();
  const data = fetchData().then((data) => {
  	const consumption = parseData(data);

    logger.info(consumption.length, 'data points fetched');
    logger.debug('last saved data point is', latest.toISOString());

    remove(consumption, (dataPoint) => (dataPoint.timestamp <= latest));

    logger.debug(consumption.length, 'data points left');

    if(consumption.length > 0) {
      const save = saveDataPoints(consumption);

      save.then(() => {
        logger.info(consumption.length, 'data points saved');
        callback(null, { saved: consumption.length });
      });
    } else {
      callback(null, { saved: 0 });
    }
  });
}
