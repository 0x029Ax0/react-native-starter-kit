import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const SmokingScreen = () => {
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}>
                <Text>Smoking</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SmokingScreen;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    },
});