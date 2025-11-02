// CustomDrawer.tsx
import { useAuth } from '@/lib/auth';
import { triggerSelectionHaptic } from '@/lib/utils/haptics';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { MaterialIcons } from '@expo/vector-icons';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { state } = props;
    const currentRoute = state.routes[state.index].name;

    const handleNavigation = (routeName: string) => {
        triggerSelectionHaptic();
        router.push(`/dashboard/${routeName}`);
    };

    const handleLogout = async () => {
        triggerSelectionHaptic();
        await logout();
        router.replace("/auth/login");
    };

    return (
        <SafeAreaView style={styles.container}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
                {/* Custom Header Section */}
                <View style={styles.drawerHeader}>
                    <Image
                        source={{ uri: user?.avatar_url }}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={300}
                    />
                    <Text style={styles.userName}>{user?.name ?? "John Doe"}</Text>
                    <Text style={styles.userEmail}>{user?.email ?? "-"}</Text>
                </View>
                {/* Drawer Items */}
                <View style={styles.drawerItems}>
                    <DrawerItem
                        label="My dashboard"
                        focused={currentRoute === 'index'}
                        onPress={() => handleNavigation('')}
                        icon={({ color }) => (
                            <View style={{ width: 20 }}>
                                <FontAwesome name="dashboard" size={16} color={color} />
                            </View>
                        )}
                        labelStyle={{ fontFamily: "FiraCode" }}
                        style={{ borderRadius: 5 }}
                    />
                    <DrawerItem
                        label="My profile"
                        focused={currentRoute === 'profile'}
                        onPress={() => handleNavigation('profile')}
                        icon={({ color }) => (
                            <View style={{ width: 20 }}>
                                <FontAwesome6 name="user-ninja" size={16} color={color} />
                            </View>
                        )}
                        labelStyle={{ fontFamily: "FiraCode" }}
                        style={{ borderRadius: 5 }}
                    />
                    <DrawerItem
                        label="Update profile"
                        focused={currentRoute === 'updateProfile'}
                        onPress={() => handleNavigation('updateProfile')}
                        icon={({ color }) => (
                            <View style={{ width: 20 }}>
                                <FontAwesome5 name="user-edit" size={16} color={color} />
                            </View>
                        )}
                        labelStyle={{ fontFamily: "FiraCode" }}
                        style={{ borderRadius: 5 }}
                    />
                    <DrawerItem
                        label="Change password"
                        focused={currentRoute === 'changePassword'}
                        onPress={() => handleNavigation('changePassword')}
                        icon={({ color }) => (
                            <View style={{ width: 20 }}>
                                <FontAwesome5 name="key" size={16} color={color} />
                            </View>
                        )}
                        labelStyle={{ fontFamily: "FiraCode" }}
                        style={{ borderRadius: 5 }}
                    />
                    <DrawerItem
                        label="Delete account"
                        focused={currentRoute === 'deleteAccount'}
                        onPress={() => handleNavigation('deleteAccount')}
                        icon={({ color }) => (
                            <View style={{ width: 20 }}>
                                <AntDesign name="user-delete" size={16} color={color} />
                            </View>
                        )}
                        labelStyle={{ fontFamily: "FiraCode" }}
                        style={{ borderRadius: 5 }}
                    />
                </View>
            </DrawerContentScrollView>
            {/* Logout Button at Bottom */}
            <View style={{ padding: 12 }}>
                <DrawerItem
                    label="Logout"
                    labelStyle={{ color: "#ff4444", fontFamily: "FiraCode", }}
                    icon={() => <MaterialIcons name="exit-to-app" size={16} color="#ff4444" />}
                    style={{ borderRadius: 5 }}
                    onPress={handleLogout} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    drawerHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        fontFamily: "FiraCode",
    },
    userEmail: {
        color: '#e0e0e0',
        fontSize: 14,
        marginTop: 3,
        fontFamily: "FiraCode",
    },
    drawerItems: {
        flex: 1,
        paddingTop: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    logoutText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#ff4444',
        fontWeight: '600',
        fontFamily: "FiraCode",
    },
});

export default CustomDrawerContent;