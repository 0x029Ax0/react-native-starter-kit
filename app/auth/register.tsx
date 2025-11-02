import { Button, FormTextField, ThemedText } from '@/components/ui';
import { handleFormErrors, RegisterInput, registerSchema, useAuth } from '@/lib/auth';
import { triggerSuccessHaptic } from '@/lib/utils/haptics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
    const router = useRouter();
    const { register } = useAuth();

    // Form definition
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterInput>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
        resolver: zodResolver(registerSchema),
    });

    // Submit form handler
    const onSubmit = async (input: RegisterInput) => {
        const result = await register(input);
        if (result.status === "success") {
            triggerSuccessHaptic();
            router.replace('/dashboard');
        } else {
            handleFormErrors(result, { setError });
        }
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
                        <ThemedText type="title">
                            Create an account
                        </ThemedText>
                        <ThemedText type="default">
                            Should take you less than a minute.
                        </ThemedText>
                    </View>

                    {/* Register form */}
                    <View style={styles.form}>
                        {/* Name */}
                        <FormTextField
                            name="name"
                            label="Name"
                            control={control}
                            error={errors.name} />
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
                        {/* Password confirmation */}
                        <FormTextField
                            name="password_confirmation"
                            label="Confirm Password"
                            control={control}
                            error={errors.password_confirmation}
                            secureTextEntry={true}
                        />
                        {/* Submit button */}
                        <Button
                            size="lg"
                            color="white"
                            label="Create your account"
                            loading={isSubmitting}
                            testID="register-submit-button"
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default RegisterScreen;

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
    header: {
        gap: 8,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        gap: 12,
        width: '100%',
    },
});
