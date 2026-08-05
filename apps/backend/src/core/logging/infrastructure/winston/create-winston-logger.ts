import { createLogger, format, transports } from 'winston';

export function createWinstonLogger() {
  return createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.colorize(),
      format.printf((info) => {
        const timestamp = String(info.timestamp);
        const level = String(info.level);
        const message = String(info.message);
        const context =
          typeof info.context === 'string' ? `[${info.context}] ` : '';

        return `${timestamp} ${level}: ${context}${message}`;
      }),
    ),
    transports: [new transports.Console()],
  });
}
