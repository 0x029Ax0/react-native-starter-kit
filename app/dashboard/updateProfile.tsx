import { AvatarUploadField, Button, FeedbackMessage, FormLayout, FormTextField, ThemedText } from "@/components/ui";
import { handleFormErrors, UpdateProfileInput, updateProfileSchema, useAuth } from "@/lib/auth";
import { triggerSuccessHaptic } from "@/lib/utils/haptics";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from 'react-native';

const UpdateProfileScreen = () => {
    const { user, updateProfile } = useAuth();

    // Display feedback flag
    const [isDone, setIsDone] = useState<boolean>(false);

    // Form definition
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<UpdateProfileInput>({
        defaultValues: {
            name: user?.name,
            email: user?.email,
        },
        resolver: zodResolver(updateProfileSchema),
    });

    // Submit form handler
    const onSubmit = async (input: UpdateProfileInput) => {
        const result = await updateProfile(input);
        // Succefully updated profile
        if (result.status === "success") {
            // Trigger success haptic feedback
            triggerSuccessHaptic();

            // Display feedback for 3 seconds
            setIsDone(true);
            setTimeout(() => {
                setIsDone(false);
            }, 3000);
        // Failed to update profile
        } else {
            handleFormErrors(result, { setError });
        }
    };

    return (
        <FormLayout>
            {/* Feedback */}
            {isDone && (
                <FeedbackMessage
                    message="Your profile has been updated!"
                    type="success" />
            )}
            {/* Register form */}
            <View style={styles.form}>
                {/* Avatar */}
                <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <ThemedText style={styles.avatar_label}>Avatar</ThemedText>
                            <AvatarUploadField
                                size={200}
                                editable={true}
                                currentAvatarUrl={user?.avatar_url}
                                onImageSelected={onChange}
                            />
                        </>
                    )}
                />
                {/* Name */}
                <FormTextField
                    name="name"
                    label="Name"
                    control={control}
                    error={errors.name}
                    textContentType="name"
                    autoComplete="name"
                />
                {/* Email address */}
                <FormTextField
                    name="email"
                    label="Email"
                    control={control}
                    error={errors.email}
                    textContentType="emailAddress"
                    autoComplete="email"
                    keyboardType="email-address"
                />
            </View>
            {/* Submit button */}
            <Button
                size="lg"
                color="white"
                label={"Save changes"}
                loading={isSubmitting}
                icon={<MaterialCommunityIcons name="content-save" size={24} />}
                onPress={handleSubmit(onSubmit)}
            />
        </FormLayout>
    );
};

export default UpdateProfileScreen;

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
        gap: 8,
        flex: 1,
        marginBottom: 32,
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
        flex: 1,
        width: '100%',
        gap: 12,
    },
    avatar_label: {
        textAlign: 'center',
        fontWeight: '600',
    }
});