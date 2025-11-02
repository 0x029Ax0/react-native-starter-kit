import { triggerLightHaptic } from '@/lib/utils/haptics';
import { ReactNode } from "react";
import { ActivityIndicator, GestureResponderEvent, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type ButtonProps = {
    onPress: (e: GestureResponderEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    label?: string;
    testID?: string;
    color: "black" | "white" | "blue" | "green" | "red";
    size?: "sm" | "md" | "lg" | "xl";
    icon?: ReactNode;
};

const buttonColors = {
    "black": {
        "backgroundColor": "#000",
        "textColor": "#fff",
    },
    "white": {
        "backgroundColor": "#fff",
        "textColor": "#000",
    },
    "blue": {
        "backgroundColor": "#063be7",
        "textColor": "#fff",
    },
    "red": {
        "backgroundColor": "#af0808",
        "textColor": "#fff",
    },
    "green": {
        "backgroundColor": "#000",
        "textColor": "#14b838",
    }
};

const buttonSizes = {
    "sm": {
        buttonStyles: {
            padding: 5,
        },
        textStyles: {
            fontSize: 12,
        }
    },
    "md": {
        buttonStyles: {
            padding: 10,
        },
        textStyles: {
            fontSize: 14,
        }
    },
    "lg": {
        buttonStyles: {
            padding: 15,
        },
        textStyles: {
            fontSize: 16,
        }
    },
    "xl": {
        buttonStyles: {
            padding: 20,
        },
        textStyles: {
            fontSize: 18,
        }
    },
};

export const Button = ({ onPress, disabled = false, loading = false, label = "Submit form", testID, color = "black", size = "md", icon }: ButtonProps) => {
    const colors = buttonColors[color];
    const buttonSizeStyles = buttonSizes[size].buttonStyles;
    const textSizeStyles = buttonSizes[size].textStyles;
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
                    backgroundColor: colors.backgroundColor,
                },
                buttonSizeStyles,
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
                        color={colors.textColor}
                        style={styles.spinner}
                    />
                ) : icon ? (
                    <Text style={[styles.icon, { color: colors.textColor }]}>
                        {icon}
                    </Text>
                ) : null}
                <Text style={[{ color: colors.textColor }, styles.text, textSizeStyles]}>
                    {loading ? "Loading..." : label}
                </Text>
            </View>
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    base: {
        borderRadius: 5,
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
    icon: {
        marginRight: 10,
    },
    spinner: {
        marginRight: 10,
    },
    text: {
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "600", // must be a string in RN
    },
});
