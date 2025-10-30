import { FormTextField, SubmitButton, ThemedText } from "@/components/ui";
import { DeleteAccountInput, deleteAccountSchema, useAuth } from "@/lib/auth";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const DeleteAccountScreen = () => {
    const router = useRouter();
    const { deleteAccount } = useAuth();

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<DeleteAccountInput>({
        defaultValues: {
            password: "",
        },
        resolver: zodResolver(deleteAccountSchema),
    });

    const onSubmit = async (input: DeleteAccountInput) => {
        const result = await deleteAccount(input);
        if (result.status === "success") {
            router.replace("/auth/login");
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets>
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
                    <SubmitButton
                        label={"Recover my account"}
                        icon={<FontAwesome6 name="trash-can" size={16} />}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingVertical: 32,
        gap: 24,
    },
    // Header
    header: {
        gap: 8,
        marginBottom: 32,
    },
    // Form
    form: {
        width: '100%',
        gap: 12,
    },
});