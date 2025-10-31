import { AvatarUploadField, Button, FeedbackMessage, FormTextField, ThemedText } from "@/components/ui";
import { UpdateProfileInput, updateProfileSchema, useAuth } from "@/lib/auth";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateProfileScreen = () => {
    const { user, updateProfile } = useAuth();

    const [isDone, setIsDone] = useState<boolean>(false);

    const { control, handleSubmit, formState: { errors }, setError } = useForm<UpdateProfileInput>({
        defaultValues: {
            name: user?.name,
            email: user?.email,
        },
        resolver: zodResolver(updateProfileSchema),
    });

    console.debug("errors:", errors);

    const onSubmit = async (input: UpdateProfileInput) => {
        console.debug("submitting update profile");
        console.debug("- input:", input);
        const result = await updateProfile(input);
        console.debug("result:", result);
        if (result.status === "success") {
            setIsDone(true);
        } else {
            // Handle validation errors
            if (result.errors) {
                // Iterate over all error fields and set them
                Object.entries(result.errors).forEach(([field, messages]) => {
                    setError(field as keyof UpdateProfileInput, {
                        type: 'manual',
                        message: Array.isArray(messages) ? messages[0] : messages,
                    });
                });
            } else if (result.message) {
                // If there are no field-specific errors, but there's a general message
                // You could show a toast or set a general form error
                console.error('Registration error:', result.message);
                // Optional: set error on a specific field or show a toast
            }
        }
    };

    useEffect(() => {
        setIsDone(false);
    }, [setIsDone]);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets>

                {/* Feedback */}
                {isDone && (
                    <FeedbackMessage
                        message="Your profile has been updated!"
                        type="success" />
                )}

                {/* Header */}
                <View style={styles.header}>
                    <ThemedText type="title">
                        Update your profile
                    </ThemedText>
                </View>

                {/* Register form */}
                <View style={styles.form}>
                    {/* Avatar */}
                    <Controller
                        control={control}
                        name="avatar"
                        render={({ field: { onChange, value } }) => (
                            <AvatarUploadField
                                size={200}
                                editable={true}
                                currentAvatarUrl={user?.avatar_url}
                                onImageSelected={onChange}
                            />
                        )}
                    />
                    {/* Name */}
                    <FormTextField
                        name="name"
                        label="Name"
                        control={control}
                        error={errors.name} />
                    {/* Email address */}
                    <FormTextField
                        name="email"
                        label="Email"
                        control={control}
                        error={errors.email} />
                    {/* Submit button */}
                    <Button
                        size="lg"
                        color="white"
                        label={"Save changes"}
                        icon={<MaterialCommunityIcons name="content-save" size={24} />}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
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
        width: '100%',
        gap: 12,
    },
});