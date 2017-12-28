import winston from 'winston';
import dotenv from 'dotenv'

dotenv.config();

const consoleOptions = {
  level: 'debug',
  colorize: (process.env.LOG_COLORS == 'true'),
  timestamp: true,
  json: false,
  prettyPrint: true,
  depth: 10,
  humanReadableUnhandledException: true,
  showLevel: true,
  stderrLevels: ['error'],
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(consoleOptions),
  ]
});

export default logger;