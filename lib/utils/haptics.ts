import * as Haptics from 'expo-haptics';

/**
 * Trigger haptic feedback for successful actions
 * Uses notification success pattern (3 quick taps)
 */
export const triggerSuccessHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger haptic feedback for errors or failures
 * Uses notification error pattern (2 quick heavy taps)
 */
export const triggerErrorHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger haptic feedback for warnings or important notices
 * Uses notification warning pattern (single heavy tap)
 */
export const triggerWarningHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger light haptic feedback for button presses
 * Uses light impact feedback
 */
export const triggerLightHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger medium haptic feedback for selections
 * Uses medium impact feedback
 */
export const triggerMediumHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger heavy haptic feedback for important actions
 * Uses heavy impact feedback
 */
export const triggerHeavyHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};

/**
 * Trigger selection haptic feedback for picker/slider changes
 * Uses selection changed feedback
 */
export const triggerSelectionHaptic = () => {
    Haptics.selectionAsync().catch((error) => {
        console.warn('Haptic feedback error:', error);
    });
};
