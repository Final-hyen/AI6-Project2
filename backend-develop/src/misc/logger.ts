import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          const meta = stack ? { stack: stack } : null;
          const trace = meta === null ? '' : JSON.stringify(meta);
          return `(${timestamp}) [${level}] ${message} ${trace}\n`;
        }),
      ),
    }),
  ],
});
