import type { AxiosError } from "axios";
import { ApiErrorResponse } from "./types";

export const getApiErrorMessage = (
    error: AxiosError<ApiErrorResponse>
): string => {
    if (!error) return 'Unknown error';
    const fallback = error.message || 'Request failed';
    const data = error.response?.data;
    if (!data) return fallback;

    if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
    }
    if (data.errors && typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        const first = firstKey ? (data.errors as any)[firstKey] : undefined;
        if (Array.isArray(first) && first.length > 0) return String(first[0]);
        if (typeof first === 'string') return first;
    }
    return fallback;
};