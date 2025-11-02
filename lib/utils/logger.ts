/**
 * Conditional logging utility that only logs in development mode.
 * In production, all logs are suppressed to prevent information disclosure.
 */
export const logger = {
    /**
     * Debug logs - only shown in development
     */
    debug: (...args: any[]) => {
        if (__DEV__) {
            console.debug(...args);
        }
    },

    /**
     * Info logs - only shown in development
     */
    info: (...args: any[]) => {
        if (__DEV__) {
            console.info(...args);
        }
    },

    /**
     * Warning logs - shown in both dev and production
     * Use sparingly for critical warnings
     */
    warn: (...args: any[]) => {
        console.warn(...args);
    },

    /**
     * Error logs - shown in both dev and production
     * Use for errors that should be reported
     */
    error: (...args: any[]) => {
        console.error(...args);
        // In production, you could send to error tracking service here
        // e.g., Sentry, Bugsnag, etc.
    },
};
