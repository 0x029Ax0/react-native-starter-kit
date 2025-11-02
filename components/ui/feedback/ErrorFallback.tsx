import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../buttons";

type ErrorFallbackProps = {
    error: Error;
    resetError: () => void;
};

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets>
                <View style={styles.content}>
                    <View style={styles.body}>
                        <Text style={styles.title}>
                            Whoops!
                        </Text>
                        <Text style={styles.intro}>
                            The app just crashed, we&apos;ve been notified this 
                            error occurred and will fix it asap. Sorry for 
                            the inconvenience.
                        </Text>
                        <Text style={styles.label}>
                            Error
                        </Text>
                        <Text style={styles.error}>
                            {error.message}
                        </Text>
                    </View>
                    <View style={styles.footer}>
                        <Button 
                            size="lg"
                            color="white" 
                            onPress={resetError} 
                            label="Back to dashboard"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: "#000"
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
    content: {
        flex: 1,
    },
    body: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 24,
    },
    title: {
        color: "#fff",
        fontSize: 36,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 12,
    },
    intro: {
        color: "#fff",
        marginBottom: 20,
        lineHeight: 22,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 5
    },
    error: {
        color: "#fff",
        lineHeight: 22,
    }
});