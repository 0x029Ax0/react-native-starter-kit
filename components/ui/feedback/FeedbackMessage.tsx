import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type FeedbackMessageType = "success" | "info" | "warning" | "error";

type FeedbackMessageProps = {
    message: string;
    type: FeedbackMessageType;
};

type FeedbackMessageTypeStylingProperties = {
    backgroundColor: string;
    textColor: string;
    icon: ReactNode;
};

type FeedbackMessageTypeStyling = Record<string, FeedbackMessageTypeStylingProperties>;

const typeStyling: FeedbackMessageTypeStyling = {
    success: {
        backgroundColor: "#0a800aff",
        textColor: "#ffffff",
        icon: <FontAwesome name="check-circle" size={36} color="white" />,
    },
    info: {
        backgroundColor: "#0059ff",
        textColor: "#ffffff",
        icon: <Feather name="info" size={24} color="white" />,
    },
    warning: {
        backgroundColor: "#ff5e00",
        textColor: "#ffffff",
        icon: <AntDesign name="warning" size={24} color="white" />,
    },
    error: {
        backgroundColor: "#f31b1b",
        textColor: "#ffffff",
        icon: <MaterialIcons name="error" size={24} color="white" />,
    }
};

export const FeedbackMessage = ({ message, type }: FeedbackMessageProps) => {
    const styling = typeStyling[type];

    return (
        <View style={[styles.feedback_message_wrapper, { backgroundColor: styling.backgroundColor }]}>
            <Text style={styles.feedback_message_icon}>
                {styling.icon}
            </Text>
            <Text style={[styles.feedback_message_text, { color: styling.textColor }]}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    feedback_message_wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
    },
    feedback_message_icon: {
        marginRight: 16,
        marginLeft: 4,
    },
    feedback_message_text: {
        fontSize: 16,
    }
});