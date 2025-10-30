import { CustomDrawerContent } from '@/components/ui';
import { useThemeColor } from '@/lib/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import 'react-native-reanimated';

const RootLayout = () => {

    const drawerBackgroundColor         = useThemeColor({ light: '#ccc', dark: '#111' }, "background");
    const drawerActiveBackgroundColor   = useThemeColor({ light: '#fff', dark: '#000' }, "background");
    const drawerActiveTextColor         = useThemeColor({ light: '#000', dark: '#fff' }, "text");
    const drawerInactiveBackgroundColor = useThemeColor({ light: '#ccc', dark: '#111' }, "background");
    const drawerInactiveTextColor       = useThemeColor({ light: '#000', dark: '#fff' }, "text");

    return (
        <Drawer 
            drawerContent={CustomDrawerContent} 
            screenOptions={{
                drawerContentStyle: {
                },
                drawerStyle: {
                    backgroundColor: drawerBackgroundColor,
                },
                // active item
                drawerActiveTintColor: drawerActiveTextColor,
                drawerActiveBackgroundColor: drawerActiveBackgroundColor,
                // inactive item
                drawerInactiveTintColor: drawerInactiveTextColor,
                drawerInactiveBackgroundColor: drawerInactiveBackgroundColor,
                // general item 
                drawerItemStyle: {
                    borderRadius: 5,
                },
            }}>
            <Drawer.Screen name="index" options={{ 
                title: "Dashboard", 
                drawerLabel: 'My dashboard',
                drawerIcon: ({ color }) => (
                    <View style={{ width: 20 }}>
                        <FontAwesome name="dashboard" size={16} color={color} />
                    </View>
                ),
            }} />
            <Drawer.Screen name="profile" options={{ 
                title: "My profile", 
                drawerLabel: 'My profile',
                drawerIcon: ({ color }) => (
                    <View style={{ width: 20 }}>
                        <FontAwesome6 name="user-ninja" size={16} color={color} />
                    </View>
                ),
            }} />
            <Drawer.Screen name="updateProfile" options={{ 
                title: "Update profile", 
                drawerLabel: 'Update profile',
                drawerIcon: ({ color }) => (
                    <View style={{ width: 20 }}>
                        <FontAwesome5 name="user-edit" size={16} color={color} />
                    </View>
                ),
            }} />
            <Drawer.Screen name="changePassword" options={{ 
                title: "Change password", 
                drawerLabel: 'Change password',
                drawerIcon: ({ color }) => (
                    <View style={{ width: 20 }}>
                        <FontAwesome5 name="key" size={16} color={color} />
                    </View>
                ),
            }} />
            <Drawer.Screen name="deleteAccount" options={{ 
                title: "Delete account", 
                drawerLabel: 'Delete account',
                drawerIcon: ({ color }) => (
                    <View style={{ width: 20 }}>
                        <AntDesign name="user-delete" size={16} color={color} />
                    </View>
                ),
            }} />
            
        </Drawer>  
    );
}

export default RootLayout