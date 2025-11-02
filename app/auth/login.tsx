import { Button, FormTextField, OutlineButton, ThemedText } from '@/components/ui';
import { LoginCredentials, loginSchema, OAuthRedirectResponse, useAuth } from '@/lib/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import logo from '@/assets/images/sharingan.png';

const LoginScreen = () => {
    const router = useRouter();
    const { login, oauthRedirect } = useAuth();

    // Form definition
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginCredentials>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    // Form submit handler
    const onSubmit = async (credentials: LoginCredentials) => {
        const result = await login(credentials);
        if (result.status === "success") {
            router.replace("/dashboard");
        } else if (result.message) {
            console.debug("error result:", result);
            const error = result.message;
            setError("password", { message: error });
        }
    };

    // Recover account click handler
    const handleClickRecoverAccount = () => {
        router.push('/auth/recoverAccount');
    };

    // OAuth: google click handler
    const handleClickGoogle = async () => {
        try {
            const oauthResult: OAuthRedirectResponse = await oauthRedirect({ provider: "google" });
            console.debug("clicked google, result:", oauthResult);
            if (oauthResult.status === "success") {
                const visitResult = await WebBrowser.openBrowserAsync(oauthResult.data.redirect_url);
                console.debug("visiting result:", visitResult);
            }
        } catch (error) {
            console.debug("google oauth redirect error:", error);
        }
    };

    // OAuth: github click handler
    const handleClickGithub = async () => {
        const result = await oauthRedirect({ provider: "github" });
        console.debug("clicked github, result:", result);
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
                        <View style={styles.intro}>
                            <ThemedText type="title" style={{ textAlign: 'center', fontFamily: 'FiraCode' }}>
                                Welcome back
                            </ThemedText>
                            <ThemedText type="default" style={{ textAlign: 'center', fontFamily: 'FiraCode' }}>
                                Sign in to access your Floppie AI dashboard.
                            </ThemedText>
                        </View>
                    </View>
                    
                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email address */}
                        <FormTextField
                            name="email"
                            label="Email address"
                            control={control}
                            error={errors.email} />
                        {/* Password */}
                        <FormTextField
                            name="password"
                            label="Password"
                            control={control}
                            error={errors.password}
                            secureTextEntry={true}
                        />
                        {/* Submit button */}
                        <Button
                            size="lg"
                            color="white"
                            label="Sign in"
                            loading={isSubmitting}
                            testID="login-submit-button"
                            onPress={handleSubmit(onSubmit)}
                        />
                        {/* OAuth options */}
                        <View style={styles.oauthWrapper}>
                            <View style={{ flex: 1 }}>
                                <OutlineButton 
                                    label="Google" 
                                    onPress={handleClickGoogle} 
                                    icon={<AntDesign name="google" size={24} />} 
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <OutlineButton 
                                    label="Github"
                                    onPress={handleClickGithub} 
                                    icon={<AntDesign name="github" size={24} />} 
                                />
                            </View>
                        </View>
                        {/* Recover account link */}
                        <View style={styles.recoverAccountWrapper}>
                            <ThemedText onPress={handleClickRecoverAccount}>
                                Forgot your password?
                            </ThemedText>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

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
        paddingBottom: 24,
        gap: 24,
    },
    // Header 
    header: {
        flex: 1,
        alignItems: "center",
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
    intro: { 
        gap: 8,
    },
    // Form
    form: { 
        gap: 12,
        width: '100%', 
    },
    recoverAccountWrapper: {
        fontSize: 10,
        marginBottom: 10,
        marginTop: -4,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Oauth
    oauthWrapper: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 24,
        marginTop: 12,
        marginBottom: 18
    },
    // Footer
    footer: {
        marginTop: 'auto',
    },
});
