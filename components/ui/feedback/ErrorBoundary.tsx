import { type ErrorBoundaryProps } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "../buttons";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <Text>{error.message}</Text>
            <Button 
                color="white" 
                onPress={retry} 
                label="Try again?"
            />
        </View>
    );
};