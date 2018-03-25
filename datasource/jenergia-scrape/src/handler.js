import remove from 'lodash/remove'; 
import logger from './logger';
import fetchData from './fetch';
import parseData from './parse';
import { getLatestTimestamp, saveDataPoints } from './database';

export async function handler(event, context, callback) {
  logger.info('jenergia-scrape started');

  const data = fetchData();

  data.then(async (data) => {
  	const consumption = parseData(data);
    const latest = await getLatestTimestamp();
    
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

      save.catch((error) => {
        logger.error('Save failed:', error);
        callback(error, null);
      });
    } else {
      callback(null, { saved: 0 });
    }
  });

  data.catch((error) => {
    logger.error('Data fetching failed:', error);
    callback(error, null);
  });
}