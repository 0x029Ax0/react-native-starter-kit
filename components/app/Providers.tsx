import { PropsWithChildren, useMemo } from "react";

import { AuthProvider } from '@/lib/auth';
import { AxiosProvider } from '@/lib/http';
import { useColorScheme } from '@/lib/theme';
import { logger } from '@/lib/utils/logger';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorFallback } from "../ui";

export const Providers = ({ children }: PropsWithChildren) => {
    const colorScheme = useColorScheme();
    const queryClient = useMemo(() => new QueryClient(), []);

    const logError = (error: Error, stacktrace: string) => {
        logger.debug("error boundary", error, stacktrace);
        logger.error("Application error:", error.message);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <AxiosProvider>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider>
                                <SafeAreaProvider>
                                    {children}
                                </SafeAreaProvider>
                            </AuthProvider>
                        </QueryClientProvider>
                    </AxiosProvider>
                </ThemeProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
};