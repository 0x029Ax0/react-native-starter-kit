import { Button, ThemedText } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "@/assets/images/sharingan.png";
import { useState } from "react";

const ComponentWithErrors = () => {
    throw new Error("This component just crashed, oh noes!");
};

const DashboardScreen = () => {
    const { user } = useAuth();

    const [triggerError, setTriggerError] = useState<boolean>(false);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}>
                <Image 
                    style={styles.logo} 
                    source={Logo} 
                    contentFit="contain" 
                    transition={300} />
                <ThemedText style={styles.title}>
                    Hello, {user?.name ?? "you"}!
                </ThemedText>
                <ThemedText style={styles.text}>
                    You are looking gewd.
                </ThemedText>
                <View style={{ marginTop: 24 }}>
                    <Button 
                        color="white" 
                        onPress={() => setTriggerError(true)} 
                        label="Throw an error"
                    />
                </View>
                {triggerError && (
                    <ComponentWithErrors />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
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
    logo: {
        height: 150,
        width: 150,
        marginBottom: 30
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 5,
    },
    text: {
        textAlign: "center",
    }
});