import { logger } from "../../utils/logger";

/**
 * Retry utility with exponential backoff
 * @param fn Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delayMs Initial delay in milliseconds
 */
export const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 2000
): Promise<T> => {
    let lastError: any;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on the last attempt
            if (attempt < maxAttempts - 1) {
                const waitTime = delayMs * Math.pow(2, attempt);
                logger.debug(`Retry attempt ${attempt + 1} failed, waiting ${waitTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    throw lastError;
};