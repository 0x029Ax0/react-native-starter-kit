/**
 * Type definitions for FormData file objects in React Native
 *
 * React Native's FormData requires file objects to have a specific structure
 * that differs from web's File/Blob API.
 */

/**
 * Represents a file to be uploaded via FormData in React Native
 */
export interface FormDataFile {
    /** The local URI of the file (e.g., file://, content://, or asset://) */
    uri: string;
    /** MIME type of the file (e.g., 'image/jpeg', 'image/png') */
    type: string;
    /** Filename with extension (e.g., 'avatar.jpg') */
    name: string;
}

/**
 * Type guard to check if a value is a valid FormDataFile
 */
export function isFormDataFile(value: unknown): value is FormDataFile {
    return (
        typeof value === 'object' &&
        value !== null &&
        'uri' in value &&
        'type' in value &&
        'name' in value &&
        typeof (value as FormDataFile).uri === 'string' &&
        typeof (value as FormDataFile).type === 'string' &&
        typeof (value as FormDataFile).name === 'string'
    );
}
