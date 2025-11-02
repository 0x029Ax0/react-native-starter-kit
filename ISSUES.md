# ISSUES - Code Analysis Report

This document contains a comprehensive analysis of bugs, security vulnerabilities, UX/UI problems, architectural issues, and improvement opportunities identified in the codebase.

**Analysis Date**: 2025-11-02
**Total Issues Identified**: 34
**Critical**: 7 | **High**: 5 | **Medium**: 14 | **Low**: 8

---

## Table of Contents

- [🔴 Critical Issues](#-critical-issues-must-fix-before-production)
- [🟠 High Severity Issues](#-high-severity-issues)
- [🟡 Medium Severity Issues](#-medium-severity-issues)
- [🟢 Low Priority / Nice to Have](#-low-priority--nice-to-have)
- [Priority Roadmap](#priority-roadmap)

---

## 🔴 Critical Issues (Must Fix Before Production)

### 1. Cleartext HTTP Traffic in Production

**Severity**: CRITICAL
**Category**: Security
**Location**: `.env`, `android/app/src/main/AndroidManifest.xml`

**Issue**:
- API uses HTTP instead of HTTPS: `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.62/api/v1`
- Android manifest allows cleartext traffic without restrictions
- All API calls transmit data in plaintext

**Impact**:
- Man-in-the-middle (MITM) attacks possible
- User credentials and auth tokens transmitted unencrypted
- Session hijacking vulnerability
- **Critical security breach in production**

**Fix**:
```diff
# .env (production)
- EXPO_PUBLIC_API_BASE_URL=http://192.168.1.62/api/v1
+ EXPO_PUBLIC_API_BASE_URL=https://api.yourapp.com/v1
```

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<!-- Option 1: Disable cleartext for production -->
<application
-   android:usesCleartextTraffic="true"
+   android:usesCleartextTraffic="false"
    ...>

<!-- Option 2: Conditional based on build variant -->
<!-- Only in debug builds -->
```

**References**: [Android Network Security Config](https://developer.android.com/training/articles/security-config)

---

### 2. Incomplete OAuth Implementation

**Severity**: CRITICAL
**Category**: Functionality
**Location**: `app/auth/login.tsx:50-67`

**Issue**:
OAuth flow opens browser but never handles the callback/redirect, leaving users unable to complete login.

```tsx
const handleClickGoogle = async () => {
    const oauthResult = await oauthRedirect({ provider: "google" });
    if (oauthResult.status === "success") {
        await WebBrowser.openBrowserAsync(oauthResult.data.redirect_url);
        // ^^^ Opens browser but never handles callback!
        // No route to capture authorization code
        // No token exchange
    }
};
```

**Impact**:
- OAuth login completely non-functional
- Users stuck after browser opens
- Feature advertised but doesn't work

**Fix**:
1. Add OAuth callback route: `app/auth/oauth/callback.tsx`
2. Configure deep linking in `app.json`
3. Handle authorization code exchange:

```tsx
// app/auth/oauth/callback.tsx
import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function OAuthCallback() {
    const { code, state } = useLocalSearchParams();
    const router = useRouter();
    const { exchangeOAuthCode } = useAuth();

    useEffect(() => {
        if (code) {
            exchangeOAuthCode({ code, state })
                .then(() => router.replace('/dashboard'))
                .catch(() => router.replace('/auth/login'));
        }
    }, [code]);

    return <LoadingSpinner />;
}
```

**References**: [Expo Linking](https://docs.expo.dev/guides/linking/), [OAuth 2.0 Flow](https://oauth.net/2/)

---

### 6. Avatar Upload Without Validation

**Severity**: HIGH
**Category**: Security / Performance
**Location**: `components/ui/forms/AvatarUploadField.tsx:62`, `lib/auth/AuthProvider.tsx:184-188`

**Issue**:
Image file uploaded without size, type, or content validation.

```tsx
if (input.avatar) {
    const mimeType = getMimeType(input.avatar);  // Based on user-supplied URI
    formData.append('avatar', avatarFile as unknown as Blob);
    // No validation!
}
```

**Impact**:
- Users could upload 100MB+ files
- Could upload non-image files
- Potential DoS on server
- Expensive storage costs

**Fix**:
```tsx
// Before upload
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,  // Compress
});

if (result.assets?.[0]) {
    const asset = result.assets[0];

    // Validate size
    if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
        throw new Error('Image must be smaller than 5MB');
    }

    // Validate type
    if (asset.mimeType && !ALLOWED_TYPES.includes(asset.mimeType)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }
}
```

---

### 7. Token Persists in Storage on Logout

**Severity**: HIGH
**Category**: Security
**Location**: `lib/auth/AuthProvider.tsx:337-342`

**Issue**:
When refresh fails with auth error, token cleared from state but not from SecureStore/localStorage.

```tsx
if (isAuthError) {
    console.debug("Authentication error detected, logging out");
    setAccessToken(null);  // Only clears state
    // Should also delete from SecureStore!
}
```

**Impact**:
- Old token lingers in device storage
- App restart could use invalid token
- Security risk if device compromised

**Fix**:
```tsx
const clearAccessToken = useCallback(async () => {
    try {
        if (Platform.OS === "web") {
            localStorage.removeItem(accessTokenStoreKey);
        } else {
            await SecureStore.deleteItemAsync(accessTokenStoreKey);
        }
    } catch (error) {
        console.warn("Failed to clear token from storage:", error);
    }
    setAccessToken(null);
    setAuthToken(null);
}, [accessTokenStoreKey]);

// Use in logout and auth errors
if (isAuthError) {
    await clearAccessToken();
}
```

---

## 🟠 High Severity Issues

### 8. Console.debug Calls in Production

**Severity**: HIGH
**Category**: Code Quality / Security
**Locations**: 23 instances across multiple files

**Files with console.debug**:
- `lib/auth/AuthProvider.tsx`: 14 instances (lines 58, 123, 134, 162, 192, 207, 230, 245, 265, 269, 293, 334, 342, 347)
- `app/auth/login.tsx`: 4 instances (lines 53, 56, 59, 66)
- `app/dashboard/profile.tsx`: 2 instances (lines 67, 68)
- `components/app/Providers.tsx`: 3 instances (lines 18-20)

**Impact**:
- Information disclosure (error details, flow logic)
- Cluttered production console
- Performance overhead
- Professional code quality concern

**Fix**:
```tsx
// Create logging utility
// lib/utils/logger.ts
export const logger = {
    debug: (...args: any[]) => {
        if (__DEV__) {
            console.debug(...args);
        }
    },
    error: (...args: any[]) => {
        console.error(...args);
        // Send to error tracking service in production
    },
};

// Replace all console.debug
- console.debug("recover account mutated succesfully", response);
+ logger.debug("recover account mutated succesfully", response);
```

---

### 9. Hardcoded Test Error Button in Dashboard

**Severity**: HIGH
**Category**: Code Quality / UX
**Location**: `app/dashboard/index.tsx:10-13, 48-56`

**Issue**:
Debug component that intentionally crashes app left in production code.

```tsx
const ComponentWithErrors = () => {
    throw new Error("This component just crashed, oh noes!");
};

// Rendered in production:
<Button
    color="white"
    onPress={() => setTriggerError(true)}
    label="Throw an error"
/>
{triggerError && <ComponentWithErrors />}
```

**Impact**:
- Users can intentionally crash the app
- Unprofessional UX
- Bad first impression

**Fix**:
```tsx
// Remove entirely or guard with __DEV__
{__DEV__ && (
    <>
        <Button
            onPress={() => setTriggerError(true)}
            label="[DEV] Test Error Boundary"
        />
        {triggerError && <ComponentWithErrors />}
    </>
)}
```

---

### 10. Race Condition in Auth Initialization

**Severity**: HIGH
**Category**: Architecture
**Location**: `lib/auth/AuthProvider.tsx:280-354`

**Issue**:
Multiple useEffects updating auth state can race, causing auth state flashing or multiple refresh calls.

```tsx
// Effect 1: Get token from storage (runs once)
useEffect(() => {
    getAccessToken().then(token => {
        setAccessToken(token);  // Triggers Effect 2
    });
}, []);

// Effect 2: Refresh when token available (runs on token change)
useEffect(() => {
    if (!accessToken) return;
    // Could run multiple times if state updates rapidly
    retryWithBackoff(() => refresh(), 3, 2000)
}, [accessToken, user, refresh]);
```

**Impact**:
- Multiple unnecessary refresh API calls
- Flash of wrong auth state (guest → authenticated → guest)
- Confusing user experience

**Fix**:
```tsx
// Use single initialization effect with proper guards
useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
        try {
            const token = await getAccessToken();

            if (cancelled) return;

            if (token) {
                setAccessToken(token);
                // Refresh will be triggered by separate effect
            } else {
                setState("guest");
            }
        } catch (error) {
            if (!cancelled) {
                setState("guest");
            }
        }
    };

    initialize();

    return () => {
        cancelled = true;
    };
}, []); // Only run once on mount
```

---

### 11. No Network Error Feedback UI

**Severity**: HIGH
**Category**: UX
**Location**: Throughout app

**Issue**:
Network errors and timeouts fail silently with no user feedback.

**Impact**:
- Users don't know why actions failed
- No way to retry failed requests
- Poor UX on unstable connections

**Fix**:
```tsx
// Add toast notification system
// lib/utils/toast.ts
import { Alert } from 'react-native';

export const toast = {
    error: (message: string) => {
        Alert.alert('Error', message, [{ text: 'OK' }]);
    },
    success: (message: string) => {
        Alert.alert('Success', message, [{ text: 'OK' }]);
    },
};

// In AxiosInstance.tsx response interceptor
if (error.code === 'ECONNABORTED') {
    toast.error('Request timed out. Please check your connection and try again.');
} else if (!error.response) {
    toast.error('Network error. Please check your internet connection.');
}
```

---

### 12. Insecure Token Storage on Web

**Severity**: HIGH
**Category**: Security
**Location**: `lib/auth/AuthProvider.tsx:84-94`

**Issue**:
Auth tokens stored in localStorage which is vulnerable to XSS attacks.

```tsx
if (Platform.OS === "web") {
    localStorage.setItem(accessTokenStoreKey, token);  // Vulnerable to XSS
}
```

**Impact**:
- If any XSS vulnerability exists, tokens easily stolen
- No HttpOnly protection
- No Secure flag protection

**Fix**:
```tsx
// Option 1: Use httpOnly cookies (requires backend change)
// Backend should set auth token in httpOnly cookie
// Frontend doesn't store token at all

// Option 2: Use sessionStorage (better than localStorage)
if (Platform.OS === "web") {
    sessionStorage.setItem(accessTokenStoreKey, token);  // At least cleared on tab close
}

// Option 3: Implement proper CSP headers to prevent XSS
// Add to web index.html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">
```

**Best Practice**: Use httpOnly cookies for web, SecureStore for native.

---

## 🟡 Medium Severity Issues

### 13. No Timeout Error Message Clarity

**Severity**: MEDIUM
**Category**: UX
**Location**: `lib/http/AxiosInstance.tsx:21`

**Issue**:
15-second timeout returns generic error without explaining it's a timeout.

```tsx
timeout: 15_000,  // Silent timeout
```

**Impact**:
- Users don't know if it's network issue or backend issue
- No guidance on what to do

**Fix**:
```tsx
// In axios interceptor
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            error.message = 'Request timed out after 15 seconds. Please try again.';
        }
        throw error;
    }
);
```

---

### 15. Missing Loading State Visibility

**Severity**: MEDIUM
**Category**: UX
**Location**: OAuth buttons in `app/auth/login.tsx`

**Issue**:
OAuth buttons don't show loading state when clicked.

**Fix**:
```tsx
const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

<Button
    onPress={handleClickGoogle}
    loading={oauthLoading === 'google'}
    disabled={oauthLoading !== null}
/>
```

---

### 16. No Success Feedback on Destructive Operations

**Severity**: MEDIUM
**Category**: UX
**Location**: `app/dashboard/deleteAccount.tsx:27`

**Issue**:
Account deletion succeeds silently with just a redirect.

**Impact**:
- User doesn't get confirmation
- Very destructive action needs clear feedback

**Fix**:
```tsx
const onSubmit = async (formData: DeleteAccountInput) => {
    Alert.alert(
        'Delete Account?',
        'This action cannot be undone. Are you sure?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const result = await deleteAccount(formData);
                    if (result.status === 'success') {
                        Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
                    }
                }
            }
        ]
    );
};
```

---

### 17. useMinimumLoadingTime Memory Leak Potential

**Severity**: MEDIUM
**Category**: Performance / Bug
**Location**: `lib/hooks/useMinimumLoadingTime.ts:34-72`

**Issue**:
Dependency array includes state that causes effect to run too frequently.

```tsx
useEffect(() => {
    // ... timer setup
    return () => {
        if (showTimer) clearTimeout(showTimer);
        if (hideTimer) clearTimeout(hideTimer);
    };
}, [isLoading, shouldShow, showStartTime, showDelay, minDuration]);  // Too many deps
```

**Fix**:
```tsx
useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
        showTimer = setTimeout(() => {
            setShouldShow(true);
            setShowStartTime(Date.now());
        }, showDelay);
    } else if (shouldShow && showStartTime) {
        const elapsed = Date.now() - showStartTime;
        const remaining = minDuration - elapsed;

        if (remaining > 0) {
            hideTimer = setTimeout(() => {
                setShouldShow(false);
                setShowStartTime(null);
            }, remaining);
        } else {
            setShouldShow(false);
            setShowStartTime(null);
        }
    }

    return () => {
        if (showTimer) clearTimeout(showTimer);
        if (hideTimer) clearTimeout(hideTimer);
    };
}, [isLoading, showDelay, minDuration]);  // Remove shouldShow and showStartTime
```

---

### 18. No Null Check on User Avatar URL

**Severity**: MEDIUM
**Category**: UX
**Location**: `app/dashboard/profile.tsx:64`, `components/ui/layouts/CustomDrawerContent.tsx:34`

**Issue**:
Avatar image displayed without handling null/undefined.

```tsx
<Image
    source={{ uri: user?.avatar_url }}  // Could be undefined
/>
```

**Fix**:
```tsx
<Image
    source={
        user?.avatar_url
            ? { uri: user.avatar_url }
            : require('@/assets/images/default-avatar.png')
    }
/>
```

---

### 19. Missing Accessibility Labels

**Severity**: MEDIUM
**Category**: Accessibility
**Location**: `components/ui/forms/FormTextField.tsx`

**Issue**:
Form inputs don't have proper accessibility labels.

**Fix**:
```tsx
<TextInput
    style={[styles.input, error && styles.inputError]}
    value={String(value ?? '')}
    onChangeText={onChange}
    onBlur={onBlur}
    accessibilityLabel={label}  // Add this
    accessibilityHint={error?.message}  // Add error as hint
    {...inputProps}
/>
```

---

### 20. No Confirmation Dialog for Destructive Actions

**Severity**: MEDIUM
**Category**: UX
**Location**: `app/dashboard/deleteAccount.tsx`

**Issue**:
Account deletion proceeds immediately without confirmation.

**Fix**: See Issue #16 above.

---

### 21. FormData Content-Type Header Conflict

**Severity**: MEDIUM
**Category**: Code Quality
**Location**: `lib/http/hooks/useApiMutation.ts:22-23`

**Issue**:
Manually setting Content-Type for FormData when Axios should handle it.

```tsx
headers: {
    'Content-Type': 'multipart/form-data',  // Axios will override this
    ...config.headers
},
```

**Impact**:
- Axios will override with proper boundary parameter
- Could cause upload failures

**Fix**:
```tsx
// Don't set Content-Type for FormData, let Axios handle it
const requestConfig = {
    ...config,
    data: payload,
    // Remove Content-Type header for FormData
};

if (!(payload instanceof FormData)) {
    requestConfig.headers = {
        'Content-Type': 'application/json',
        ...config.headers
    };
}
```

---

### 22. Poor User-Facing Error Messages

**Severity**: MEDIUM
**Category**: UX
**Location**: All form validation

**Issue**:
Error messages are technical, not user-friendly.

**Current**:
```tsx
password: z.string().min(8, "Min 8 characters")
```

**Better**:
```tsx
password: z.string().min(8, "Password must be at least 8 characters long")
```

**Fix across all forms**:
- "Email is required" → "Please enter your email address"
- "Invalid email" → "Please enter a valid email address"
- "Min 8 characters" → "Password must be at least 8 characters"

---

### 23. Token Stored in Two Places (Architecture)

**Severity**: MEDIUM
**Category**: Architecture
**Location**: `lib/http/AxiosInstance.tsx` + `lib/auth/AuthProvider.tsx`

**Issue**:
Token stored in both module-level variable and React state.

```tsx
// AxiosInstance.tsx
let authToken: string | null = null;

// AuthProvider.tsx
const [accessToken, setAccessToken] = useState<string | null>(null);
```

**Impact**:
- Risk of desynchronization
- Manual sync required via useEffect
- Harder to reason about state

**Fix**:
Consider using Context API for token or move entirely to AuthProvider state.

---

### 24. Repeating Form Layout Pattern

**Severity**: MEDIUM
**Category**: Code Quality
**Location**: All auth screens

**Issue**:
Same KeyboardAvoidingView + ScrollView pattern repeated across all forms.

**Fix**:
```tsx
// components/ui/layouts/FormLayout.tsx
export function FormLayout({ children }: PropsWithChildren) {
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets>
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
```

---

### 25. Error Boundary Not Resettable

**Severity**: MEDIUM
**Category**: UX
**Location**: `components/ui/feedback/ErrorFallback.tsx`

**Issue**:
Error boundary button doesn't actually reset the error, just navigates.

**Fix**:
```tsx
<Button
    label="Try again"
    onPress={() => {
        resetError();  // Reset error boundary state
        router.replace('/dashboard');
    }}
/>
```

---

### 26. Axios Instance Not Memoized

**Severity**: MEDIUM
**Category**: Performance
**Location**: `lib/http/AxiosContext.tsx`

**Issue**:
New axios instance created on every render.

**Fix**:
```tsx
export const AxiosProvider = ({ children }: PropsWithChildren) => {
    const instance = useMemo(() => http, []);  // Memoize instance

    return (
        <AxiosContext.Provider value={instance}>
            {children}
        </AxiosContext.Provider>
    );
};
```

---

## 🟢 Low Priority / Nice to Have

### 27. No Pull-to-Refresh

**Severity**: LOW
**Category**: UX
**Location**: `app/dashboard/profile.tsx`, `app/dashboard/index.tsx`

**Issue**:
Users can't manually refresh data.

**Fix**:
```tsx
const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchUser();
    setRefreshing(false);
}, []);

<ScrollView
    refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
```

---

### 28. Inconsistent Font Usage

**Severity**: LOW
**Category**: Design
**Location**: `app/auth/login.tsx:84`

**Issue**:
FiraCode font loaded globally but only used once.

**Fix**:
Either use consistently throughout app or remove from `app.json`.

---

### 29. Missing Input Autofill Support

**Severity**: LOW
**Category**: UX
**Location**: `components/ui/forms/FormTextField.tsx`

**Issue**:
No `textContentType` for iOS autofill.

**Fix**:
```tsx
<FormTextField
    name="email"
    textContentType="emailAddress"
    autoComplete="email"
/>

<FormTextField
    name="password"
    textContentType="password"
    autoComplete="current-password"
/>
```

---

### 30. No Image Compression on Upload

**Severity**: LOW
**Category**: Performance
**Location**: `components/ui/forms/AvatarUploadField.tsx`

**Issue**:
Images uploaded at full quality.

**Fix**:
```tsx
import * as ImageManipulator from 'expo-image-manipulator';

const compressedImage = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 500 } }],  // Resize to 500px width
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
);
```

---

### 31. Missing TypeScript Exact Optional Properties

**Severity**: LOW
**Category**: Code Quality
**Location**: `tsconfig.json`

**Issue**:
`exactOptionalPropertyTypes` disabled due to library incompatibilities.

**Impact**:
Less type safety on optional properties.

**Fix**:
Re-enable when libraries support it or use more careful typing.

---

### 32. Magic Numbers Throughout Code

**Severity**: LOW
**Category**: Code Quality
**Locations**: Multiple files

**Issue**:
Hard-coded values without explanation:
- Timeouts: 200, 500, 2000, 3000
- Sizes: 150, 200, 100, 120

**Fix**:
```tsx
// constants/ui.ts
export const SPLASH_MIN_DURATION = 3000;
export const FADE_OUT_DURATION = 500;
export const LOADING_DELAY = 200;
export const LOADING_MIN_DURATION = 500;
```

---

### 33. No Skeleton Loading States

**Severity**: LOW
**Category**: UX
**Location**: Profile screen

**Issue**:
Shows ActivityIndicator instead of content skeleton.

**Fix**:
Create skeleton placeholders that match actual content layout.

---

### 34. Inconsistent Haptic Feedback

**Severity**: LOW
**Category**: UX
**Location**: Various

**Issue**:
Haptics defined but not used everywhere (drawer navigation, tab switches).

**Fix**:
Add haptics to all interactive elements consistently.

---
