import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const transports = [
    new winston.transports.Console({ format: combine(colorize(), timestamp(), logFormat) }),
    new DailyRotateFile({
        filename: 'application-%DATE%.log',
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD-HH', // Rotate hourly
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d'
    })
];


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), logFormat),
    transports: transports,
});

export default logger;