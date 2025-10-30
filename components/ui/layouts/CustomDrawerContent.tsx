// CustomDrawer.tsx
import { useAuth } from '@/lib/auth';
import { MaterialIcons } from '@expo/vector-icons';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
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

    const handleLogout = async () => {
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
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            {/* Logout Button at Bottom */}
            <View style={{ padding: 12 }}>
                <DrawerItem 
                    label="Logout" 
                    labelStyle={{ color: "#ff4444" }}
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
    },
    userEmail: {
        color: '#e0e0e0',
        fontSize: 14,
        marginTop: 3,
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
    },
});

export default CustomDrawerContent;