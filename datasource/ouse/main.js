var osmosis = require('osmosis');
require('dotenv').config()

var login = function() {
  return osmosis
    .get('https://ouse.pset.fi/')
    .login(process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD)
    .then(function (result) {
      osmosis.config('cookies', result.cookies);
    });
}

var loadReportingPage = function() {
  return osmosis.get('https://ouse.pset.fi/ConsumptionReporting/HourlyBasedReporting.aspx')
    .find('#ContentPlaceHolder1_lblMeasurementTable')
    //.click('input.HourlyValuesForLastMonthButton[value="Kuluvan kuukauden arvot tuntitasolla"]')
    .find('table#ContentPlaceHolder1_gvMeasurements_gvMeasurements tr.Row')
    .set({
      timestamp: 'td[1]',
      energy: 'td[2]'
    })
    .data(function(item) {
      console.log(item);
    })
    .log(console.log)
    .error(console.error)
    .debug(console.debug);
};

login()
  .then(loadReportingPage);
