import moment from 'moment-timezone';
import map from 'lodash/map'; 
import flatten from 'lodash/flatten'; 
import remove from 'lodash/remove'; 

export default function(data) {
  // merge different consumption types
  const consumptionData = flatten(map(data.Consumptions, (item) => (item.Series.Data)));

  // remove zeros
  remove(consumptionData, (dataPoint) => (dataPoint[1] <= 0));
  
  return map(consumptionData, (dataPoint) => {
    const time = moment(dataPoint[0]);
    time.tz("Europe/Helsinki");
    time.subtract(time.utcOffset(), 'minutes');

    return {
      timestamp: time,
      energy: dataPoint[1],
    }
  });
}