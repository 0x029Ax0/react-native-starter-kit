import { useThemeColor } from "@/lib/theme";
import { GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type SubmitButtonProps = {
    onPress: (e: GestureResponderEvent) => void;
    disabled?: boolean;
    label?: string;
    testID?: string;
    icon?: any;
};

export const SubmitButton = ({ onPress, disabled = false, label = "Submit form", testID, icon }: SubmitButtonProps) => {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
    
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            android_ripple={{ 
                color: "rgba(0,0,0,0.1)",
                borderless: false
            }}
            hitSlop={8}
            style={({ pressed }) => [
                styles.base, 
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
            testID={testID}
        >
            <View style={styles.row}>
                {icon && (
                    <Text style={{ color: textColor }}>
                        {icon}
                    </Text>
                )}
                <Text style={styles.text}>{label}</Text>
            </View>
        </Pressable>
    );
}

export default SubmitButton;

const styles = StyleSheet.create({
    base: {
        backgroundColor: "#fff",
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
    text: {
        color: "#000",
        textAlign: "center",
        textTransform: "uppercase",
        fontFamily: "FiraCode",
        fontWeight: "600", // must be a string in RN
        marginLeft: 10,
    },
});
