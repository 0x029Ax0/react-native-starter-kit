import { Button, FeedbackMessage, FormTextField, ThemedText } from "@/components/ui";
import { ChangePasswordInput, changePasswordSchema, useAuth } from "@/lib/auth";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const ChangePasswordScreen = () => {
    const { changePassword } = useAuth();
    
    const [isDone, setIsDone] = useState<boolean>(false);
    
    const { control, setValue, handleSubmit, formState: { errors } } = useForm<ChangePasswordInput>({
        defaultValues: {
            password: '',
            new_password: '',
            new_password_confirmation: '',
        },
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (input: ChangePasswordInput) => {
        const result = await changePassword(input);
        if (result.status === 'success') {
            setIsDone(true);
            setValue("password", "");
            setValue("new_password", "");
            setValue("new_password_confirmation", "");
        }
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets>
                    
                    {/* Feedback */}
                    {isDone && (
                        <FeedbackMessage
                            message="Your password has been changed!"
                            type="success" />
                    )}

                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText type="title">Change your password</ThemedText>
                    </View>
                    {/* Register form */}
                    <View style={styles.form}>
                        {/* Password */}
                        <FormTextField
                            name="password"
                            label="Current password"
                            control={control}
                            secureTextEntry={true}
                            error={errors.password} />
                        {/* Confirm password */}
                        <FormTextField
                            name="new_password"
                            label="New password"
                            control={control}
                            secureTextEntry={true}
                            error={errors.new_password} />
                        {/* Confirm new password */}
                        <FormTextField
                            name="new_password_confirmation"
                            label="Confirm new password"
                            control={control}
                            secureTextEntry={true}
                            error={errors.new_password_confirmation} />
                        {/* Submit button */}
                        <Button
                            size="lg"
                            color="white"
                            label={"Change password"}
                            icon={<MaterialCommunityIcons name="content-save" size={24} />}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ChangePasswordScreen;

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
    // Is done
    isDone: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: "green",
        padding: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5,
        marginBottom: 0,
    },
    isDoneIcon: {
        marginRight: 12,
        color: "white",
    },
    isDoneText: {
        color: "white",
        paddingTop: 4,
    },
    // Form
    form: {
        width: '100%',
        gap: 12,
    },
});