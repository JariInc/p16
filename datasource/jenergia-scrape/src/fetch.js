import dotenv from 'dotenv'
import cheerio from 'cheerio';
import FormData from 'form-data';
import logger from './logger';

dotenv.config();
const fetch = require('fetch-cookie')(require('node-fetch'));

const baseurl = 'https://asiakas.jenergia.fi';

async function fetchLoginPage() {
  logger.debug('Fetching login page');
  const response = await fetch(baseurl);
  const body = await response.text();
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

function buildLoginForm(fields, data) {
  const form = new FormData();
  form.append(fields.username, process.env.JENERGIA_USERNAME);
  form.append(fields.password, process.env.JENERGIA_PASSWORD);
  form.append(fields.remember, "true");
  form.append(fields.token, data.token);

  return form;
}

async function login(url, form) {
  logger.debug('Logging in');

  const response = await fetch(baseurl + url, {
    method: 'POST',
    body: form,
  });
  
  logger.debug('Logged in with status', response.status);

  return response;
}

function buildReportForm() {
  const form = new FormData();
  form.append('customerCode', process.env.JENERGIA_CUSTOMER_CODE);
  form.append('networkCode', process.env.JENERGIA_NETWORK_CODE);
  form.append('meteringPointCode', process.env.JENERGIA_METERING_POINT_CODE);
  form.append('enableTemperature', 'false');
  form.append('enablePriceSeries', 'true');
  form.append('enableTemperatureCorrectedConsumption', 'false');
  form.append('mpSourceCompanyCode', '');
  form.append('activeTarificationId', '');

  return form;
}

async function fetchReport(form) {
  logger.debug('Fetching report');

  const response = await fetch(baseurl + '/Reporting/CustomerConsumption/GetHourlyConsumption', { 
    method: 'POST', 
    body: form,
  });

  logger.debug('Fetched report with status', response.status);
          
  return response.json();
}

async function GetReport() {
  const loginPage = await fetchLoginPage();
  const loginForm = buildLoginForm(loginPage.fields, { token: loginPage.token });
  const loginResponse = await login(loginPage.url, loginForm);
  const reportForm = buildReportForm();
  const report = await fetchReport(reportForm);

  return report;
}

export default GetReport;
