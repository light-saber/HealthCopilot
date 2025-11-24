/**
 * Simple structured logger with timestamp and level support
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private level: LogLevel;

    constructor(level: LogLevel = 'info') {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.level);
    }

    private formatMessage(level: LogLevel, context: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${dataStr}`;
    }

    debug(context: string, message: string, data?: any): void {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', context, message, data));
        }
    }

    info(context: string, message: string, data?: any): void {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', context, message, data));
        }
    }

    warn(context: string, message: string, data?: any): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', context, message, data));
        }
    }

    error(context: string, message: string, data?: any): void {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', context, message, data));
        }
    }
}

export const logger = new Logger(
    (process.env.LOG_LEVEL as LogLevel) || 'info'
);
