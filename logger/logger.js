import winston, { format } from 'winston';

export const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.colorize(),
        format.printf(({ level, message, label, timestamp }) => `[${timestamp}] ${label || '-'} ${level}: ${message}`),
    ),
    transports: [
        new winston.transports.Stream({
            stream: process.stderr,
            level: 'debug',
        })
    ],
});
