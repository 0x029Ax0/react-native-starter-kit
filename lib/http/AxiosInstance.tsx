import axios, { AxiosHeaders, AxiosInstance } from 'axios';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete http.defaults.headers.common.Authorization;
    }
}

export const setUnauthorizedHandler = (handler: () => void) => {
    onUnauthorized = handler;
};

export const http: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // Validated at app startup
    timeout: 15_000,
    // withCredentials: true, // enable if you use cookies
});

// Request interceptor (auth, tracing, etc.)
http.interceptors.request.use((config) => {
    if (authToken) {
        const headers = (config.headers = AxiosHeaders.from(config.headers));
        if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${authToken}`);
        }
    }
    return config;
});

// Response interceptor (normalize errors, refresh logic, etc.)
http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error.response?.status;
        let message = error.response?.data?.message ?? error.message ?? 'Network error';

        // Handle timeout errors with clear message
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            message = 'Request timed out after 15 seconds. Please check your connection and try again.';
        }

        // Handle 401 Unauthorized
        if (status === 401 && onUnauthorized) {
            onUnauthorized();
        }

        return Promise.reject({ status, message, raw: error });
    }
);
