/**
 * Production-safe logging utility for NerdX App
 * 
 * In development (__DEV__ = true): All logs are shown
 * In production (__DEV__ = false): Only errors are shown
 * 
 * Usage:
 * import { logger } from '@/utils/logger';
 * logger.debug('Debug message');
 * logger.info('Info message');
 * logger.warn('Warning message');
 * logger.error('Error message', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
    enabledInProduction: boolean;
    minLevel: LogLevel;
}

const config: LoggerConfig = {
    enabledInProduction: false,
    minLevel: __DEV__ ? 'debug' : 'error',
};

const logLevelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const shouldLog = (level: LogLevel): boolean => {
    if (!__DEV__ && !config.enabledInProduction && level !== 'error') {
        return false;
    }
    return logLevelPriority[level] >= logLevelPriority[config.minLevel];
};

const formatMessage = (level: LogLevel, message: string): string => {
    const timestamp = new Date().toISOString();
    const prefix = {
        debug: '🐛',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
    };
    return `${prefix[level]} [${timestamp}] ${message}`;
};

export const logger = {
    debug: (message: string, ...args: unknown[]): void => {
        if (shouldLog('debug')) {
            console.log(formatMessage('debug', message), ...args);
        }
    },

    info: (message: string, ...args: unknown[]): void => {
        if (shouldLog('info')) {
            console.log(formatMessage('info', message), ...args);
        }
    },

    warn: (message: string, ...args: unknown[]): void => {
        if (shouldLog('warn')) {
            console.warn(formatMessage('warn', message), ...args);
        }
    },

    error: (message: string, error?: unknown): void => {
        // Errors are always logged
        console.error(formatMessage('error', message), error);
    },

    // Group related logs
    group: (label: string, fn: () => void): void => {
        if (__DEV__) {
            console.group(label);
            fn();
            console.groupEnd();
        }
    },

    // Log API calls
    api: (method: string, url: string, status?: number): void => {
        if (shouldLog('debug')) {
            const statusEmoji = status && status >= 400 ? '❌' : '✅';
            console.log(`${statusEmoji} [API] ${method} ${url}${status ? ` → ${status}` : ''}`);
        }
    },
};

// Export for testing purposes
export const setLoggerConfig = (newConfig: Partial<LoggerConfig>): void => {
    Object.assign(config, newConfig);
};

export default logger;
