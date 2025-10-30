import { createContext } from "react";
import {
    ChangePasswordInput,
    ChangePasswordResponse,
    DeleteAccountInput,
    DeleteAccountResponse,
    LoginCredentials,
    LoginResponse,
    LogoutResponse,
    OAuthRedirectInput,
    OAuthRedirectResponse,
    RecoverAccountInput,
    RecoverAccountResponse,
    RefreshResponse,
    RegisterInput,
    RegisterResponse,
    ResetPasswordInput,
    ResetPasswordResponse,
    UpdateProfileInput,
    UpdateProfileResponse,
    User
} from "./types";

export type AuthState = "loading" | "guest" | "authenticated";

export type AuthContextValue = {
    state: AuthState;
    user: User | null;
    accessToken: string | null;

    register: (input: RegisterInput) => Promise<RegisterResponse>;
    recoverAccount: (input: RecoverAccountInput) => Promise<RecoverAccountResponse>;
    resetPassword: (input: ResetPasswordInput) => Promise<ResetPasswordResponse>;
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    changePassword: (input: ChangePasswordInput) => Promise<ChangePasswordResponse>;
    updateProfile: (input: UpdateProfileInput) => Promise<UpdateProfileResponse>;
    deleteAccount: (input: DeleteAccountInput) => Promise<DeleteAccountResponse>;
    logout: () => Promise<LogoutResponse>;
    refresh: () => Promise<RefreshResponse>;
    oauthRedirect: (input: OAuthRedirectInput) => Promise<OAuthRedirectResponse>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);