export type LogoutSuccessResponse = {
    status: "success";
}

export type LogoutErrorResponse = {
    status: "error";
    error?: string;
    message?: string;
};

export type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;