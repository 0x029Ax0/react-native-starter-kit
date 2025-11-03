import { useThemeColor } from "@/lib/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
    const activeColor = useThemeColor({ light: '#0a7ea4', dark: '#fff' }, 'tint');
    const inactiveColor = useThemeColor({ light: '#687076', dark: '#9BA1A6' }, 'tabIconDefault');

    return (
        <View style={[styles.wrapper, { backgroundColor, paddingBottom: insets.bottom + 8 }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;
                const color = isFocused ? activeColor : inactiveColor;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Pressable
                        key={index}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                    >
                        {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color, size: 24 })}
                        <Text style={[styles.tabLabel, { color }]}>
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default CustomTabBar;


const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    tabItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    tabLabel: {
        fontSize: 12,
        fontFamily: "FiraCode",
    },
});