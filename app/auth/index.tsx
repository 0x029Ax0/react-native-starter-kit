import { Button, ThemedText } from '@/components/ui';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import logo from '@/assets/images/sharingan.png';

const WelcomeScreen = () => {
    const router = useRouter();

    const handleClickLogin = () => {
        router.push("/auth/login");
    };

    const handleClickRegister = () => {
        router.push("/auth/register");
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoWrapper}>
                            <Image style={styles.logo} source={logo} contentFit="contain" transition={300} />
                        </View>
                        <ThemedText style={styles.title}>
                            App 0x00
                        </ThemedText>
                        <ThemedText style={styles.text}>
                            Super Awesome Productions
                        </ThemedText>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <View style={{ marginBottom: 24 }}>
                            <Button
                                label="Login"
                                color="white"
                                size="lg"
                                onPress={handleClickLogin}
                            />
                        </View>
                        <View>
                            <Button 
                                label="Create an account"
                                color="white"
                                size="lg"
                                onPress={handleClickRegister}
                            />
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    // Wrappers
    container: {
        flex: 1,
    },
    safeAreaContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        gap: 24,
    },
    // Header 
    header: {
        flex: 1,
        justifyContent: "center",
    },
    logoWrapper: {
        gap: 8,
        height: 150,
        marginBottom: 24,
    },
    logo: {
        height: '100%'
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 5,
    },
    text: {
        textAlign: "center",
    },
    // Actions
    actions: {
        padding: 16
    }
});
