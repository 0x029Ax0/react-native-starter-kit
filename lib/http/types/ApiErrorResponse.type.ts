export type ApiErrorResponse = {
    message?: string;
    statusCode?: number;
    errors?: Record<string, string[] | string>;
    [key: string]: unknown;
};