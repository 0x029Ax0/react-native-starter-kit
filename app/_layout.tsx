import { Providers } from '@/components/app';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, fontsError] = useFonts({
        'FiraCode-Bold': require('../assets/fonts/FiraCode/ttf/FiraCode-Bold.ttf'),
        'FiraCode-SemiBold': require('../assets/fonts/FiraCode/ttf/FiraCode-SemiBold.ttf'),
        'FiraCode-Medium': require('../assets/fonts/FiraCode/ttf/FiraCode-Medium.ttf'),
        'FiraCode-Regular': require('../assets/fonts/FiraCode/ttf/FiraCode-Regular.ttf'),
        'FiraCode-Light': require('../assets/fonts/FiraCode/ttf/FiraCode-Light.ttf'),
        'FiraCode-Retina': require('../assets/fonts/FiraCode/ttf/FiraCode-Retina.ttf')
    });

    // Wait for preloading to complete
    useEffect(() => {
        if (fontsLoaded || fontsError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsError]);

    // Don't return anything before we are done loading
    if (!fontsLoaded && !fontsError) {
        return null;
    }

    // Wrap all children views with the app's <Provider />
    return (
        <Providers>
            <Slot />
        </Providers>
    );
};

export default RootLayout;