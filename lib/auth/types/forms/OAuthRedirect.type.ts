export type OAuthRedirectInput = {
    provider: "google" | "github";
};

export type OAuthRedirectApiResponse = {
    redirect_url: string;
};

export type OAuthRedirectSuccessResponse = {
    status: 'success';
    data: OAuthRedirectApiResponse;
};

export type OAuthRedirectErrorResponse = {
    status: 'error';
    message?: string;
    errors?: Record<string, string[]>;
};

export type OAuthRedirectResponse = OAuthRedirectSuccessResponse | OAuthRedirectErrorResponse;