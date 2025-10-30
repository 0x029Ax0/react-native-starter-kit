import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { setUnauthorizedHandler, useApiMutation, useAxios } from "../http";
import { AuthContext, AuthState } from "./AuthContext";
import {
    ChangePasswordInput,
    ChangePasswordResponse,
    DeleteAccountInput,
    DeleteAccountResponse,
    LoginApiResponse,
    LoginCredentials,
    LoginResponse,
    LogoutResponse,
    OAuthRedirectApiResponse,
    OAuthRedirectInput,
    OAuthRedirectResponse,
    RecoverAccountInput,
    RecoverAccountResponse,
    RefreshApiResponse,
    RefreshResponse,
    RegisterApiResponse,
    RegisterInput,
    RegisterResponse,
    ResetPasswordInput,
    ResetPasswordResponse,
    UpdateProfileApiResponse,
    UpdateProfileInput,
    UpdateProfileResponse,
    User
} from "./types";
import { handleApiMutation } from "./utils";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const axios = useAxios();
    const router = useRouter();

    // State
    const [state, setState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Reference to the token
    const tokenRef = useRef<string | null>(null);
    useEffect(() => { tokenRef.current = accessToken; }, [accessToken]);

    // Secure storage for the accessToken
    const accessTokenStoreKey = process.env.EXPO_PUBLIC_API_TOKEN_STORAGE_KEY ?? "starter-kit-access-token";
    const saveAccessToken = useCallback(async (token: string) => {
        if (Platform.OS === "web") {
            localStorage.setItem(accessTokenStoreKey, token);
        } else {
            await SecureStore.setItemAsync(accessTokenStoreKey, token);
        }
    }, [accessTokenStoreKey]);
    const getAccessToken = async (): Promise<string | null> => {
        if (Platform.OS === "web") {
            const result = localStorage.getItem(accessTokenStoreKey);
            if (result) return result;
            return null;
        } else {
            const result = await SecureStore.getItemAsync(accessTokenStoreKey);
            if (result) return result;
            return null;
        }
    };

    // Register a new user
    const registerMutation = useApiMutation<RegisterInput, RegisterApiResponse>(
        ['auth', 'register'],
        { url: 'auth/register', method: 'POST' },
    );
    const register = useCallback(async (input: RegisterInput): Promise<RegisterResponse> => {
        return handleApiMutation(registerMutation, input, async (response) => {
            await saveAccessToken(response.token);
            setAccessToken(response.token);
            setUser(response.user);
            setState("authenticated");
        });
    }, [registerMutation, saveAccessToken, setAccessToken, setUser, setState]);

    // Recover account
    const recoverAccountMutation = useApiMutation<RecoverAccountInput, RecoverAccountResponse>(
        ['auth', 'recover-account'],
        { url: 'auth/recover-account', method: 'POST' },
    );
    const recoverAccount = useCallback(async (input: RecoverAccountInput): Promise<RecoverAccountResponse> => {
        return handleApiMutation(recoverAccountMutation, input, async (response) => {
            console.debug("recover account mutated succesfully", response);
        });
    }, [recoverAccountMutation]);

    // Reset password
    const resetPasswordMutation = useApiMutation<ResetPasswordInput, ResetPasswordResponse>(
        ['auth', 'reset-password'],
        { url: 'auth/reset-password', method: 'POST' },
    );
    const resetPassword = useCallback(async (input: ResetPasswordInput): Promise<ResetPasswordResponse> => {
        return handleApiMutation(resetPasswordMutation, input, async (response) => {
            console.debug("reset password mutated succesfully", response);
        });
    }, [resetPasswordMutation]);
    
    // Login the user
    const loginMutation = useApiMutation<LoginCredentials, LoginApiResponse>(
        ['auth', 'login'],
        { url: 'auth/login', method: 'POST' },
    );
    const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
        return handleApiMutation(loginMutation, credentials, async (response) => {
            await saveAccessToken(response.token);
            setAccessToken(response.token);
            setUser(response.user);
            setState("authenticated");
        });
    }, [loginMutation, saveAccessToken, setAccessToken, setUser, setState]);
    
    // Change password
    const changePasswordMutation = useApiMutation<ChangePasswordInput, UpdateProfileResponse>(
        ['auth', 'change-password'],
        {
            url: 'auth/change-password',
            method: 'POST',
        },
    );
    const changePassword = useCallback(async (input: ChangePasswordInput): Promise<ChangePasswordResponse> => {
        return handleApiMutation(changePasswordMutation, input, async (response) => {
            console.debug("change password mutated succesfully", response);
        });
    }, [changePasswordMutation]);
    
    // Update profile
    const updateProfileMutation = useApiMutation<UpdateProfileInput, UpdateProfileApiResponse>(
        ['auth', 'update-profile'],
        {
            url: 'auth/update-profile',
            method: 'POST',
        },
    );
    const updateProfile = useCallback(async (input: UpdateProfileInput): Promise<UpdateProfileResponse> => {
        return handleApiMutation(updateProfileMutation, input, async (response) => {
            console.debug("update profile mutated succesfully", response);
            setUser(response.user);
        });
    }, [updateProfileMutation, setUser]);

    // Delete the account of the user
    const deleteAccountMutation = useApiMutation<DeleteAccountInput, DeleteAccountResponse>(
        ['auth', 'delete-account'],
        {
            url: 'auth/delete-account',
            method: 'POST',
        },
    );
    const deleteAccount = useCallback(async (input: DeleteAccountInput): Promise<DeleteAccountResponse> => {
        return handleApiMutation(deleteAccountMutation, input, async (response) => {
            console.debug("delete account mutated succesfully", response);
            setAccessToken(null);
            setUser(null);
            setState('guest');
        });
    }, [deleteAccountMutation, setAccessToken, setUser, setState]);

    // Logout the user
    const logoutLocally = useCallback(() => {
        setAccessToken(null);
        setUser(null);
        setState('guest');
        router.replace('/auth/login');
    }, [router]);
    const logoutMutation = useApiMutation<null, LogoutResponse>(
        ['auth', 'logout'],
        {
            url: 'auth/logout',
            method: 'POST',
        },
    );
    const logout = useCallback(async (): Promise<LogoutResponse> => {
        return handleApiMutation(logoutMutation, null, async (response) => {
            console.debug("logout mutated succesfully", response);
            logoutLocally();
        });
    }, [logoutMutation]);

    // Refresh
    const refreshMutation = useApiMutation<null, RefreshApiResponse>(
        ['auth', 'refresh'],
        {
            url: 'auth/refresh',
            method: 'POST',
        },
    );
    const refresh = useCallback(async (): Promise<RefreshResponse> => {
        return handleApiMutation(refreshMutation, null, async (response) => {
            console.debug("refresh mutated succesfully", response);
            setState("authenticated");
            setUser(response.user);
        });
    }, [refreshMutation]);

    // OAuth Redirect
    const oauthRedirectGoogleMutation = useApiMutation<OAuthRedirectInput, OAuthRedirectApiResponse>(
        ['auth', 'oauth', 'redirect', 'google'],
        { url: 'oauth/redirect/google', method: 'GET' }
    );
    const oauthRedirectGithubMutation = useApiMutation<OAuthRedirectInput, OAuthRedirectApiResponse>(
        ['auth', 'oauth', 'redirect', 'github'],
        { url: 'oauth/redirect/github', method: 'GET' }
    )
    const oauthRedirect = useCallback(async (input: OAuthRedirectInput): Promise<OAuthRedirectResponse> => {
        switch (input.provider) {
        default:
        case "google":
            return handleApiMutation(oauthRedirectGoogleMutation, input, async (response) => {
                console.debug("oauth redirecting google mutated succesfully", response);
            });
        case "github":
            return handleApiMutation(oauthRedirectGithubMutation, input, async (response) => {
                console.debug("oauth redirecting github mutated succesfully", response);
            });
        }
    }, [oauthRedirectGoogleMutation, oauthRedirectGithubMutation]);

    // Axios Interceptors
    useEffect(() => {
        console.debug("access token changed, setting axios interceptors", accessToken);
        
        // Attach token to requests
        const requestInterceptor = axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const token = tokenRef.current;
            if (token) {
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Redirect on 401
        // TODO: send the user a notification
        const responseInterceptor = axios.interceptors.response.use(
            (res: AxiosResponse) => res,
            async (err: AxiosError) => {
                console.debug("response interceptor");
                console.debug("- error:", err);
                return Promise.reject(err);
            }
        );

        // Cleanup the interceptors
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [axios, accessToken]);

    // Bootstrap (on mount)
    useEffect(() => {
        // Retrieve stored access token
        getAccessToken()
            .then((token) => {
                if (token) {
                    setAccessToken(token);
                } else {
                    router.replace("/auth");
                }
            })
            .catch((error) => {
                console.debug("get access token error:", error);
            });
        // Setup unauthorized handler for axios
        setUnauthorizedHandler(logoutLocally);
        // Cleanup on unmount
        return () => {
            setUnauthorizedHandler(() => {});
        }
    }, [router, logoutLocally]);

    // Refresh once when access token becomes available
    useEffect(() => {
        if (!accessToken) return;
        refresh()
            .then((result) => {
                if (result.status === "success") {
                    router.replace('/dashboard')
                }
            })
            .catch(() => {
                setAccessToken(null);
                router.replace('/auth/login');
            })
    }, [accessToken]);

    // Compose the object we're making available through the provider
    const value = useMemo(() => ({
        state,
        user,
        accessToken,
        register,
        recoverAccount,
        resetPassword,
        login,
        changePassword,
        updateProfile,
        deleteAccount,
        logout,
        refresh,
        oauthRedirect,
    }), [
        state, 
        user, 
        accessToken, 
        register,
        recoverAccount,
        resetPassword,
        login,
        changePassword,
        updateProfile,
        deleteAccount,
        logout,
        refresh,
        oauthRedirect,
    ]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

