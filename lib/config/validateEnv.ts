import Constants from 'expo-constants';

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variables are missing
 */
export function validateEnv(): void {
    const env = Constants.expoConfig?.extra || {};

    const required = [
        'EXPO_PUBLIC_API_BASE_URL',
        'EXPO_PUBLIC_API_TOKEN_STORAGE_KEY',
    ];

    const missing = required.filter(key => !env[key]);
    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables:\n\n` +
            missing.map(key => `  - ${key}`).join('\n') +
            `\n\n` +
            `Please check your .env file and ensure all required variables are set.\n` +
            `See .env.example for reference.`
        );
    }

    // Validate that API base URL is a valid URL
    const baseUrl = env.EXPO_PUBLIC_API_BASE_URL;
    if (baseUrl) {
        try {
            new URL(baseUrl);
        } catch (error) {
            throw new Error(
                `❌ Invalid EXPO_PUBLIC_API_BASE_URL: "${baseUrl}"\n\n` +
                `Please provide a valid URL (e.g., http://localhost:3000/api or https://api.example.com)`
            );
        }
    }
}
