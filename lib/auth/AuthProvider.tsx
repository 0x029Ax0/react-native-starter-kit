import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import { setAuthToken, setUnauthorizedHandler, useApiMutation } from "../http";
import { logger } from "../utils/logger";
import { AuthContext, AuthState } from "./AuthContext";
import {
    ChangePasswordInput,
    ChangePasswordResponse,
    DeleteAccountInput,
    DeleteAccountResponse,
    FormDataFile,
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

import { getExtension, getMimeType, handleApiMutation, retryWithBackoff } from "./utils";


export const AuthProvider = ({ children }: PropsWithChildren) => {
    const router = useRouter();

    // State
    const [state, setState] = useState<AuthState>("loading");
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Ref to track if refresh is in progress
    const isRefreshing = useRef(false);

    // Ref to track if component is mounted (prevent state updates after unmount)
    const isMounted = useRef(true);

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
    const clearAccessToken = useCallback(async () => {
        try {
            if (Platform.OS === "web") {
                localStorage.removeItem(accessTokenStoreKey);
            } else {
                await SecureStore.deleteItemAsync(accessTokenStoreKey);
            }
        } catch (error) {
            console.warn("Failed to clear token from storage:", error);
        }
    }, [accessTokenStoreKey]);

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
            logger.debug("recover account mutated succesfully", response);
        });
    }, [recoverAccountMutation]);

    // Reset password
    const resetPasswordMutation = useApiMutation<ResetPasswordInput, ResetPasswordResponse>(
        ['auth', 'reset-password'],
        { url: 'auth/reset-password', method: 'POST' },
    );
    const resetPassword = useCallback(async (input: ResetPasswordInput): Promise<ResetPasswordResponse> => {
        return handleApiMutation(resetPasswordMutation, input, async (response) => {
            logger.debug("reset password mutated succesfully", response);
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
            logger.debug("change password mutated succesfully", response);
        });
    }, [changePasswordMutation]);
    
    // Update profile
    const updateProfileMutation = useApiMutation<FormData, UpdateProfileApiResponse>(
        ['auth', 'update-profile'],
        {
            url: 'auth/update-profile',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        },
    );
    const updateProfile = useCallback(async (input: UpdateProfileInput): Promise<UpdateProfileResponse> => {
        const formData = new FormData();
        formData.append('name', input.name);
        formData.append('email', input.email);
        if (input.avatar) {
            const mimeType = getMimeType(input.avatar);
            const extension = getExtension(input.avatar);
            const avatarFile: FormDataFile = {
                uri: input.avatar,
                type: mimeType,
                name: 'avatar.' + extension,
            };
            formData.append('avatar', avatarFile as unknown as Blob);
        }
        return handleApiMutation(updateProfileMutation, formData, async (response) => {
            logger.debug("update profile mutated succesfully", response);
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
            logger.debug("delete account mutated succesfully", response);
            setAccessToken(null);
            setUser(null);
            setState('guest');
        });
    }, [deleteAccountMutation, setAccessToken, setUser, setState]);

    // Logout the user
    const logoutLocally = useCallback(async () => {
        await clearAccessToken(); // Clear from storage
        setAuthToken(null);       // Clear Axios header
        setAccessToken(null);     // Clear state
        setUser(null);
        setState('guest');
        router.replace('/auth/login');
    }, [router, clearAccessToken]);
    const logoutMutation = useApiMutation<null, LogoutResponse>(
        ['auth', 'logout'],
        {
            url: 'auth/logout',
            method: 'POST',
        },
    );
    const logout = useCallback(async (): Promise<LogoutResponse> => {
        return handleApiMutation(logoutMutation, null, async (response) => {
            logger.debug("logout mutated succesfully", response);
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
            logger.debug("refresh mutated succesfully", response);
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
                logger.debug("oauth redirecting google mutated succesfully", response);
            });
        case "github":
            return handleApiMutation(oauthRedirectGithubMutation, input, async (response) => {
                logger.debug("oauth redirecting github mutated succesfully", response);
            });
        }
    }, [oauthRedirectGoogleMutation, oauthRedirectGithubMutation]);

    // Sync token with AxiosInstance
    useEffect(() => {
        setAuthToken(accessToken);
    }, [accessToken]);

    // Bootstrap (on mount)
    useEffect(() => {
        // Retrieve stored access token
        getAccessToken()
            .then((token) => {
                if (token) {
                    setAccessToken(token);
                } else {
                    // No token - user is a guest
                    // app/index.tsx will handle redirect to /auth
                    setState("guest");
                }
            })
            .catch((error) => {
                logger.debug("get access token error:", error);
                // On error, assume guest state
                setState("guest");
            });
        // Setup unauthorized handler for axios
        setUnauthorizedHandler(logoutLocally);
        // Cleanup on unmount
        return () => {
            setUnauthorizedHandler(() => {});
        }
    }, [logoutLocally]);

    // Track component mount/unmount
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Refresh once when access token becomes available (bootstrap only)
    useEffect(() => {
        if (!accessToken) return;

        // Skip refresh if we already have user data (happens after login/register)
        if (user) return;

        // Prevent multiple simultaneous refresh attempts
        if (isRefreshing.current) return;
        isRefreshing.current = true;

        // Retry refresh with exponential backoff
        retryWithBackoff(() => refresh(), 3, 2000)
            .then((result) => {
                if (!isMounted.current) return;
                // Auth state is updated by refresh() - no redirect needed
                // app/index.tsx will handle routing based on state
            })
            .catch((error) => {
                if (!isMounted.current) return;

                logger.debug("Token refresh failed after retries:", error);

                // Only logout on authentication errors (401/403), not network errors
                // Check if error has a response with 401 or 403 status
                const statusCode = error?.response?.status || error?.status;
                const isAuthError = statusCode === 401 || statusCode === 403;

                if (isAuthError) {
                    logger.debug("Authentication error detected, logging out");
                    clearAccessToken();    // Clear from storage (don't await in effect)
                    setAuthToken(null);    // Clear Axios header
                    setAccessToken(null);  // Clear state
                    setUser(null);
                    setState('guest');
                    // app/index.tsx will handle redirect to /auth
                } else {
                    // For network errors, keep user logged in but set state appropriately
                    logger.debug("Network/server error - keeping user logged in");
                    setState("authenticated");
                }
            })
            .finally(() => {
                isRefreshing.current = false;
            });
    }, [accessToken, user, refresh, clearAccessToken]);

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

