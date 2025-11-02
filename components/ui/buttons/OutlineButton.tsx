import { triggerLightHaptic } from "@/lib/utils/haptics";
import { useThemeColor } from "@/lib/theme";
import { ActivityIndicator, GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type OutlineButtonProps = {
    onPress: (e: GestureResponderEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    label?: string;
    testID?: string;
    icon?: any;
};

export const OutlineButton = ({
    onPress,
    disabled = false,
    loading = false,
    label = "Submit form",
    testID,
    icon,
}: OutlineButtonProps) => {
    const outlineColor = useThemeColor({ light: "#000", dark: "#fff" }, "background");
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    const isDisabled = disabled || loading;

    const handlePress = (e: GestureResponderEvent) => {
        // Trigger haptic feedback on button press
        triggerLightHaptic();
        onPress(e);
    };

    return (
        <Pressable
            onPress={handlePress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            android_ripple={{
                color: "rgba(0,0,0,0.1)",
                borderless: false
            }}
            hitSlop={8}
            style={({ pressed }) => [
                {
                    borderWidth: 1,
                    borderColor: outlineColor,
                },
                styles.base,
                pressed && styles.pressed,
                isDisabled && styles.disabled,
            ]}
            testID={testID}
        >
            <View style={styles.row}>
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={textColor}
                        style={styles.spinner}
                    />
                ) : icon ? (
                    <Text style={{ color: textColor }}>
                        {icon}
                    </Text>
                ) : null}
                <Text style={[{ color: textColor }, styles.text]}>
                    {loading ? "Loading..." : label}
                </Text>
            </View>
        </Pressable>
    );
}

export default OutlineButton;

const styles = StyleSheet.create({
    base: {
        borderRadius: 5,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        // shadow for iOS, elevation for Android
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        ...Platform.select({ android: { elevation: 2 } }),
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    spinner: {
        marginRight: 10,
    },
    text: {
        fontFamily: "FiraCode",
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "600", // must be a string in RN
        marginLeft: 10,
    },
});
