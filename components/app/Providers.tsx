import { PropsWithChildren, useMemo } from "react";

import { AuthProvider } from '@/lib/auth';
import { AxiosProvider } from '@/lib/http';
import { useColorScheme } from '@/lib/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const Providers = ({ children }: PropsWithChildren) => {
    const colorScheme = useColorScheme();
    const queryClient = useMemo(() => new QueryClient(), []);

    return (
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
    );
};