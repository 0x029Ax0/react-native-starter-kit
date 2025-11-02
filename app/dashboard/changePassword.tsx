import { Button, FeedbackMessage, FormLayout, FormTextField, ThemedText } from "@/components/ui";
import { ChangePasswordInput, changePasswordSchema, handleFormErrors, useAuth } from "@/lib/auth";
import { triggerSuccessHaptic } from "@/lib/utils/haptics";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from 'react-native';


const ChangePasswordScreen = () => {
    const { changePassword } = useAuth();
    
    // Display feedback flag
    const [isDone, setIsDone] = useState<boolean>(false);
    
    // Form definition
    const { control, setValue, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ChangePasswordInput>({
        defaultValues: {
            password: '',
            new_password: '',
            new_password_confirmation: '',
        },
        resolver: zodResolver(changePasswordSchema),
    });

    // Submit form handler
    const onSubmit = async (input: ChangePasswordInput) => {
        const result = await changePassword(input);
        if (result.status === 'success') {
            // Trigger success haptic feedback
            triggerSuccessHaptic();

            // Display feedback for 3 seconds
            setIsDone(true);
            setTimeout(() => {
                setIsDone(false);
            }, 3000);

            // Reset the form
            setValue("password", "");
            setValue("new_password", "");
            setValue("new_password_confirmation", "");
        } else {
            handleFormErrors(result, { setError, fallbackField: "password" });
        }
    }

    return (
        <FormLayout>
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
                    error={errors.password}
                    textContentType="password"
                    autoComplete="current-password"
                />
                {/* Confirm password */}
                <FormTextField
                    name="new_password"
                    label="New password"
                    control={control}
                    secureTextEntry={true}
                    error={errors.new_password}
                    textContentType="newPassword"
                    autoComplete="new-password"
                />
                {/* Confirm new password */}
                <FormTextField
                    name="new_password_confirmation"
                    label="Confirm new password"
                    control={control}
                    secureTextEntry={true}
                    error={errors.new_password_confirmation}
                    textContentType="newPassword"
                    autoComplete="new-password"
                />
                {/* Submit button */}
                <Button
                    size="lg"
                    color="white"
                    label={"Change password"}
                    loading={isSubmitting}
                    icon={<MaterialCommunityIcons name="content-save" size={24} />}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </FormLayout>
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