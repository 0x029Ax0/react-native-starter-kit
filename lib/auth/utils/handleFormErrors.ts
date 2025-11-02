import { triggerErrorHaptic } from '@/lib/utils/haptics';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

/**
 * Standardized error response type from API
 */
type ErrorResponse = {
    status: 'error';
    message?: string;
    errors?: Record<string, string[] | string>;
};

/**
 * Options for handling form errors
 */
type HandleFormErrorsOptions<TFieldValues extends FieldValues> = {
    /** The setError function from react-hook-form */
    setError: UseFormSetError<TFieldValues>;
    /** Field to set general error messages on (default: first field or 'root') */
    fallbackField?: Path<TFieldValues>;
    /** Whether to log errors to console (default: true in development) */
    logErrors?: boolean;
};

/**
 * Standardized error handling for form submissions
 *
 * Handles both field-specific validation errors and general error messages
 * from API responses in a consistent way across all forms.
 *
 * @example
 * ```typescript
 * const onSubmit = async (input: LoginCredentials) => {
 *     const result = await login(input);
 *     if (result.status === "success") {
 *         router.replace("/dashboard");
 *     } else {
 *         handleFormErrors(result, { setError, fallbackField: "password" });
 *     }
 * };
 * ```
 */
export const handleFormErrors = <TFieldValues extends FieldValues>(
    errorResponse: ErrorResponse,
    options: HandleFormErrorsOptions<TFieldValues>
): void => {
    const { setError, fallbackField, logErrors = __DEV__ } = options;

    // Trigger error haptic feedback
    triggerErrorHaptic();

    // Log errors in development for debugging
    if (logErrors) {
        console.error('Form submission error:', errorResponse);
    }

    // Handle field-specific validation errors
    if (errorResponse.errors) {
        Object.entries(errorResponse.errors).forEach(([field, messages]) => {
            const errorMessage = Array.isArray(messages) ? messages[0] : messages;
            if (errorMessage) {
                setError(field as Path<TFieldValues>, {
                    type: 'manual',
                    message: errorMessage,
                });
            }
        });
    }

    // Handle general error message (not tied to a specific field)
    if (errorResponse.message && !errorResponse.errors) {
        const message = errorResponse.message; // Type narrowing
        if (fallbackField) {
            // Set the error on the specified fallback field
            setError(fallbackField, {
                type: 'manual',
                message,
            });
        } else {
            // Set as a root-level error
            setError('root' as Path<TFieldValues>, {
                type: 'manual',
                message,
            });
        }
    }
};
