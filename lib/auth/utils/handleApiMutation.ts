import { UseMutationResult } from "@tanstack/react-query";
import { isApiErrorResponse } from "./isApiErrorResponse";

export type ApiResponse<T> =
    | { status: 'success'; data: T; }
    | { status: 'error', message?: string; errors?: Record<string, string[]>; };

export const handleApiMutation = async <TInput, TResponse>(
    mutation: UseMutationResult<TResponse, unknown, TInput>,
    input: TInput,
    onSuccess?: (response: TResponse) => void | Promise<void>
): Promise<ApiResponse<TResponse>> => {
    try {
        const response = await mutation.mutateAsync(input);
        if (onSuccess) {
            await onSuccess(response);
        }
        return {
            status: 'success',
            data: response
        };
    } catch (error) {
        if (isApiErrorResponse(error)) {
            return {
                status: 'error',
                ...error.raw.response.data
            };
        }
        return {
            status: 'error',
            message: 'An unexpected error occurred'
        };
    }
};