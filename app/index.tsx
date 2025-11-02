import { ThemedText, ThemedView } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { Redirect } from "expo-router";
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "@/assets/images/sharingan.png";

const SplashScreen = () => {
    const { state } = useAuth();

    // Show splash while loading
    if (state === "loading") {
        return (
            <SafeAreaView style={styles.safeAreaContainer}>
                <ThemedView style={styles.wrapper}>
                    <Image style={styles.logo} source={Logo} contentFit="contain" transition={300} />
                    <ThemedText style={styles.title}>
                        App 0x00
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        Super Awesome Productions
                    </ThemedText>
                </ThemedView>
            </SafeAreaView>
        );
    }

    // Redirect based on auth state
    if (state === "authenticated") {
        return <Redirect href="/dashboard" />;
    }

    return <Redirect href="/auth" />;
};

export default SplashScreen;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        height: 150,
        width: 150,
        marginBottom: 30
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 5,
    },
    text: {
        textAlign: "center",
    }
});