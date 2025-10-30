import { User } from "../User.type";

export type RefreshApiResponse = {
    user: User;
};

export type RefreshSuccessResponse = {
    status: 'success';
    data: RefreshApiResponse;
};

export type RefreshErrorResponse = {
    status: 'error';
    message?: string;
    errors?: Record<string, string[]>;
};

export type RefreshResponse = RefreshSuccessResponse | RefreshErrorResponse;