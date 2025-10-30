import { ApiErrorResponse } from "../types";

export const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'raw' in error &&
        typeof (error as any).raw === 'object' &&
        'response' in (error as any).raw
    );
};

