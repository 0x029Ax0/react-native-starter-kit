import { Button, FormLayout, FormTextField, ThemedText } from "@/components/ui";
import { DeleteAccountInput, deleteAccountSchema, handleFormErrors, useAuth } from "@/lib/auth";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from 'react-native';


const DeleteAccountScreen = () => {
    const router = useRouter();
    const { deleteAccount } = useAuth();

    // Form definition
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<DeleteAccountInput>({
        defaultValues: {
            password: "",
        },
        resolver: zodResolver(deleteAccountSchema),
    });

    // Submit form handler with confirmation
    const onSubmit = async (input: DeleteAccountInput) => {
        Alert.alert(
            'Delete Account?',
            'This action cannot be undone. All your data will be permanently deleted. Are you absolutely sure?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteAccount(input);
                        if (result.status === "success") {
                            Alert.alert(
                                'Account Deleted',
                                'Your account has been permanently deleted.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => router.replace("/auth"),
                                    },
                                ]
                            );
                        } else {
                            handleFormErrors(result, { setError, fallbackField: "password" });
                        }
                    },
                },
            ]
        );
    }

    return (
        <FormLayout>     
            {/* Header */}
            <View style={styles.header}>
                <ThemedText type="title">Delete your account</ThemedText>
                <ThemedText type="default">
                    Are you sure you want to delete your entire account? All data 
                    will be permanently deleted. If you are sure please enter your 
                    password and click on the submit button.
                </ThemedText>
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
                {/* Submit button */}
                <Button
                    size="lg"
                    color="red"
                    label={"Delete my account"}
                    loading={isSubmitting}
                    icon={<FontAwesome6 name="trash-can" size={24} />}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </FormLayout>
    );
};

export default DeleteAccountScreen;

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
        gap: 8,
        marginBottom: 32,
    },
    // Form
    form: {
        width: '100%',
        gap: 12,
    },
});