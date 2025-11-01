import { useAuth } from "@/lib/auth";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

type DetailValue = {
    key: string;
    value: string;
};

const ProfileScreen = () => {
    const { user } = useAuth();

    // Details to render
    const details: DetailValue[] = [
        {
            key: "ID",
            value: user?.id ?? "-",
        },
        {
            key: "Name",
            value: user?.name ?? "-",
        },
        {
            key: "Email address",
            value: user?.email ?? "-",
        },
        {
            key: "Email verified",
            value: user?.email_verified ? "Yes" : "No",
        },
        {
            key: "Registered on",
            value: user?.created_at ?? "-",
        }
    ];

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets>
            
                {/* Avatar */}
                <View style={[styles.avatar_wrapper, {}]}>
                    <Image 
                        style={styles.avatar}
                        source={{ uri: user?.avatar_url }}
                        contentFit="cover"
                        transition={300}
                        onError={(error) => console.debug("image load error:", error)}
                        onLoad={() => console.debug("image loaded succesfully")}
                    />
                </View>

                {/* Details */}
                <View style={styles.details}>
                    {details.map((item, index) => (
                        <View 
                            key={index}
                            style={[
                                styles.detail,
                                index === details.length -1 && styles.lastDetail,
                            ]}>
                            <Text style={styles.detail_key}>{item.key}</Text>
                            <Text style={styles.detail_value}>{item.value}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
    avatar_wrapper: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        marginTop: 24
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    details: {
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 5,
    },
    detail: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
    },
    lastDetail: {
        borderBottomWidth: 0,
    },
    detail_key: {
        flex: 1,
        color: "#fff",
    },
    detail_value: {
        flex: 1,
        color: "#fff",
    },
});