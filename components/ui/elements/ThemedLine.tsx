import { useThemeColor } from "@/lib/theme";
import { View, type ViewProps } from "react-native";

export type ThemedLineProps = ViewProps & {
    size?: number;
};

export const ThemedLine = ({ size = 1 }: ThemedLineProps) => {
    const backgroundColor = useThemeColor({ light: "#000", dark: "#fff" }, "background");
    return <View style={{ flex: 1, height: size, backgroundColor: backgroundColor }} />;
};