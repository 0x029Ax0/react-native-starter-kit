import { Button, FormTextField, ThemedText } from '@/components/ui';
import { RecoverAccountInput, recoverAccountSchema, useAuth } from '@/lib/auth';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RecoverAccountScreen = () => {
    const router = useRouter();
    const { recoverAccount } = useAuth();

    // Display feedback flags
    const [isDone, setIsDone] = useState<boolean>(false);

    // Form definition
    const { control, handleSubmit, formState: { errors } } = useForm<RecoverAccountInput>({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(recoverAccountSchema),
    });

    // Submit form handler
    const onSubmit = async (input: RecoverAccountInput) => {
        console.debug('value submitted:', input);
        const result = await recoverAccount(input);
        console.debug('recover account response:', result);
        if (result.status === "success") {
            console.debug('api request was a success');
            setIsDone(true);
            router.back();
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
                    {!isDone && (
                        <>
                            {/* Header */}
                            <View style={styles.header}>
                                <ThemedText type="title">Recover your account</ThemedText>
                                <ThemedText type="default">
                                    Fill in your email address below and you will be sent
                                    instructions on how you can recover your account.
                                </ThemedText>
                            </View>
                            {/* Register form */}
                            <View style={styles.form}>
                                {/* Email address */}
                                <FormTextField
                                    name="email"
                                    label="Email address"
                                    control={control}
                                    error={errors.email} />
                                {/* Submit button */}
                                <Button
                                    size="lg"
                                    color="white"
                                    label={"Recover my account"}
                                    icon={<MaterialIcons name="quick-contacts-mail" size={16} color="black" />}
                                    onPress={handleSubmit(onSubmit)}
                                />
                            </View>
                        </>
                    )}
                    {isDone && (
                        <View style={styles.isDone}>
                            <ThemedText type="title" style={styles.isDoneTitle}>
                                Email has been sent!
                            </ThemedText>
                            <ThemedText style={{ marginTop: 60, marginBottom: 20 }}>
                                <Fontisto name="email" size={128} />
                            </ThemedText>
                            <ThemedText type="default" style={styles.isDoneText}>
                                Please follow the instructions in the email we just sent you to recover your account.
                            </ThemedText>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default RecoverAccountScreen;

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
        flex: 1,
        gap: 8,
    },
    form: {
        width: '100%',
        gap: 12,
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 14,
    },
    // Is done
    isDone: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    isDoneTitle: {
        marginBottom: 10,
    },
    isDoneText: {
        textAlign: 'center',
    }
});
