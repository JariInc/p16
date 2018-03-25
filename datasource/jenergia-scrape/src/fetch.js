import dotenv from 'dotenv'
import cheerio from 'cheerio';
import request from 'superagent';
import logger from './logger';

dotenv.config();

const baseurl = 'https://asiakas.jenergia.fi';
const agent = request.agent();

async function fetchLoginPage() {
  logger.debug('Fetching login page');
  const response = await agent.get(baseurl);
  const body = response.text;
  logger.debug('Login page fetched with status', response.status);
  const dom = cheerio.load(body);
  const token = dom('#loginform input[name="__RequestVerificationToken"]').attr('value');
  const loginUrl = dom('#loginform').attr('action');

  return {
    url: loginUrl,
    token: token,
    fields: {
      username: 'UserName',
      password: 'Password',
      remember: 'RememberMe',
      token: '__RequestVerificationToken',
    }
  }
}

async function login(url, token) {
  logger.debug('Logging in');

  try {
    const response = await agent.post(baseurl + url)
      .field('UserName', process.env.JENERGIA_USERNAME)
      .field('Password', process.env.JENERGIA_PASSWORD)
      .field('RememberMe', 'true')
      .field('__RequestVerificationToken', token);
    
    logger.debug('Logged in with status', response.status);

    return response.text;
  } catch (error) {
    logger.error(error);    
    process.exit(1);
  }
}

async function fetchReport() {
  logger.debug('Fetching report');
  
  try {
    const response = await agent.post(baseurl + '/Reporting/CustomerConsumption/GetHourlyConsumption')
      .accept('application/json')
      .field('customerCode', process.env.JENERGIA_CUSTOMER_CODE)
      .field('networkCode', process.env.JENERGIA_NETWORK_CODE)
      .field('meteringPointCode', process.env.JENERGIA_METERING_POINT_CODE)
      .field('enableTemperature', 'false')
      .field('enablePriceSeries', 'true')
      .field('enableTemperatureCorrectedConsumption', 'false')
      .field('mpSourceCompanyCode', '')
      .field('activeTarificationId', '');

    logger.debug('Fetched report with status', response.status);
    
    return response.body;
  } catch (error) {
    logger.error(error);    
    process.exit(1);
  }
}

async function GetReport() {
  const loginPage = await fetchLoginPage();
  const loginResponse = await login(loginPage.url, loginPage.token);
  const report = await fetchReport();

  return report;
}

export default GetReport;
