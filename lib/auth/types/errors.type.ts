export type FormErrors = {
    errors: Record<string, string[]>;
    message: string;
};

export type RawApiErrorResponse = {
    code: string;
    config: any;
    message: string;
    request: any;
    response: {
        status: number;
        statusText: string;
        data: FormErrors;
        config: Record<string, any>;
        headers: Record<string, string>;
        request: Record<string, any>;
    };
    stack: string;
};

export type ApiErrorResponse = {
    status: number;
    message: string;
    raw: RawApiErrorResponse;
};