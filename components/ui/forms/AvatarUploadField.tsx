import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from 'react-native';

// Avatar upload validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type AvatarUploadProps = {
    currentAvatarUrl?: string | null;
    onImageSelected?: (imageUri: string) => void;
    size?: number;
    editable?: boolean;
};

export const AvatarUploadField = ({
    currentAvatarUrl,
    onImageSelected,
    size = 120,
    editable = true,
}: AvatarUploadProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const displayImage = selectedImage || currentAvatarUrl;

    /**
     * Validates an image asset before accepting it
     * @param asset The image asset from ImagePicker
     * @returns True if valid, shows alert and returns false if invalid
     */
    const validateImage = (asset: ImagePicker.ImagePickerAsset): boolean => {
        // Validate file size
        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
            const sizeMB = (asset.fileSize / (1024 * 1024)).toFixed(1);
            Alert.alert(
                'File Too Large',
                `Image must be smaller than 5MB. Selected image is ${sizeMB}MB.`,
                [{ text: 'OK' }]
            );
            return false;
        }

        // Validate MIME type
        if (asset.mimeType && !ALLOWED_MIME_TYPES.includes(asset.mimeType.toLowerCase())) {
            Alert.alert(
                'Invalid File Type',
                'Only JPEG, PNG, and WebP images are allowed.',
                [{ text: 'OK' }]
            );
            return false;
        }

        return true;
    };

    const requestPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission needed',
                    'Sorry, we need camera roll permissions to upload an avatar.'
                );
                return false;
            }
        }
        return true;
    };

    const pickImage = async () => {
        if (!editable) return;

        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];

            // Validate the image before accepting it
            if (!validateImage(asset)) {
                return;
            }

            setSelectedImage(asset.uri);
            onImageSelected?.(asset.uri);
        }
    };

    const takePhoto = async () => {
        if (!editable) return;

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                'Sorry, we need camera permissions to take a photo.'
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];

            // Validate the image before accepting it
            if (!validateImage(asset)) {
                return;
            }

            setSelectedImage(asset.uri);
            onImageSelected?.(asset.uri);
        }
    };

    const showOptions = () => {
        if (!editable) return;

        Alert.alert(
            'Upload Avatar',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: takePhoto,
                },
                {
                    text: 'Choose from Library',
                    onPress: pickImage,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={showOptions}
                disabled={!editable}
                style={[
                    styles.avatarContainer,
                    { width: size, height: size },
                    !displayImage && {
                        backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
                    },
                ]}>
                {displayImage ? (
                    <Image
                        source={{ uri: displayImage }}
                        style={[styles.avatar, { width: size, height: size }]}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <Ionicons
                        name="person"
                        size={size * 0.5}
                        color={isDark ? '#6b7280' : '#9ca3af'}
                    />
                )}
                {editable && (
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </View>
                )}
            </Pressable>
            {editable && (
                <Text
                    style={[
                        styles.hint,
                        { color: isDark ? '#9ca3af' : '#6b7280' },
                    ]}>
                    Tap to change avatar
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8,
    },
    avatarContainer: {
        borderRadius: 9999,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatar: {
        borderRadius: 9999,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3b82f6',
        borderRadius: 9999,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    hint: {
        fontSize: 12,
    },
});