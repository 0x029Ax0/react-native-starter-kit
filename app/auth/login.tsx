import { Button, FormLayout, FormTextField, OutlineButton, ThemedText } from '@/components/ui';
import { handleFormErrors, LoginCredentials, loginSchema, OAuthRedirectResponse, useAuth } from '@/lib/auth';
import { triggerSuccessHaptic } from '@/lib/utils/haptics';
import { logger } from '@/lib/utils/logger';
import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    StyleSheet,
    View
} from 'react-native';

import logo from '@/assets/images/sharingan.png';

const LoginScreen = () => {
    const router = useRouter();
    const { login, oauthRedirect } = useAuth();
    const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

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
            triggerSuccessHaptic();
            router.replace("/dashboard");
        } else {
            handleFormErrors(result, { setError, fallbackField: "password" });
        }
    };

    // Recover account click handler
    const handleClickRecoverAccount = () => {
        router.push('/auth/recoverAccount');
    };

    // OAuth: google click handler
    const handleClickGoogle = async () => {
        try {
            setOauthLoading('google');
            const oauthResult: OAuthRedirectResponse = await oauthRedirect({ provider: "google" });
            logger.debug("clicked google, result:", oauthResult);
            if (oauthResult.status === "success") {
                const visitResult = await WebBrowser.openBrowserAsync(oauthResult.data.redirect_url);
                logger.debug("visiting result:", visitResult);
            }
        } catch (error) {
            logger.debug("google oauth redirect error:", error);
        } finally {
            setOauthLoading(null);
        }
    };

    // OAuth: github click handler
    const handleClickGithub = async () => {
        try {
            setOauthLoading('github');
            const result = await oauthRedirect({ provider: "github" });
            logger.debug("clicked github, result:", result);
        } catch (error) {
            logger.debug("github oauth redirect error:", error);
        } finally {
            setOauthLoading(null);
        }
    };
    
    return (
        <FormLayout>
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
                    error={errors.email}
                    textContentType="emailAddress"
                    autoComplete="email"
                    keyboardType="email-address"
                />
                {/* Password */}
                <FormTextField
                    name="password"
                    label="Password"
                    control={control}
                    error={errors.password}
                    secureTextEntry={true}
                    textContentType="password"
                    autoComplete="current-password"
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
                            loading={oauthLoading === 'google'}
                            disabled={oauthLoading !== null}
                            icon={<AntDesign name="google" size={24} />}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <OutlineButton
                            label="Github"
                            onPress={handleClickGithub}
                            loading={oauthLoading === 'github'}
                            disabled={oauthLoading !== null}
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
        </FormLayout>
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
