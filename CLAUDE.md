# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application with file-based routing (expo-router), featuring a complete authentication system and REST API integration. The app uses TypeScript, React Hook Form with Zod validation, TanStack Query for server state, and supports Android/iOS/Web platforms.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start
# or
npm start

# Run on specific platform
npm run android  # Run on Android device/emulator
npm run ios      # Run on iOS device/simulator
npm run web      # Run in web browser

# Linting
npm run lint

# Clear Expo cache (useful when things break)
npx expo start -c
```

## Architecture

### Directory Structure

- **`app/`** - File-based routing using expo-router
  - `app/auth/` - Authentication screens (login, register, recover account)
  - `app/dashboard/` - Protected dashboard screens (profile, change password, delete account)
  - `app/_layout.tsx` - Root layout with font loading and providers wrapper

- **`lib/`** - Core business logic and infrastructure
  - `lib/auth/` - Authentication context, provider, and all auth-related mutations
  - `lib/http/` - Axios instance, custom hooks (useApiMutation, useApiQuery), and HTTP utilities
  - `lib/theme/` - Theme configuration and hooks

- **`components/`** - Reusable UI components
  - `components/app/` - App-level components (Providers wrapper)
  - `components/ui/` - Generic UI components (buttons, forms, themed elements)

### Key Architectural Patterns

#### Provider Hierarchy
The app uses a specific provider nesting order (see `components/app/Providers.tsx`):
1. GestureHandlerRootView (outermost)
2. ThemeProvider (React Navigation theming)
3. AxiosProvider (HTTP client context)
4. QueryClientProvider (TanStack Query)
5. AuthProvider (auth state and methods)
6. SafeAreaProvider (innermost, wraps app content)

#### Authentication System
- **Context-based**: `AuthContext` provides auth state and methods throughout the app
- **Token storage**: Uses `expo-secure-store` on native platforms, `localStorage` on web
- **Auto-refresh**: On app launch, stored token is retrieved and validated via `/auth/refresh` endpoint
- **Interceptors**: Axios request interceptor attaches Bearer token; response interceptor handles 401s
- **State machine**: Three states: `"loading"`, `"guest"`, `"authenticated"`

#### HTTP Layer Architecture
- **Base instance**: `lib/http/AxiosInstance.tsx` exports configured `http` client
- **Custom hooks**:
  - `useApiMutation<TInput, TOutput>` - Wraps TanStack Query's useMutation for API calls
  - `useApiQuery<TParams, TOutput>` - Wraps TanStack Query's useQuery for data fetching
- **Error handling**: Standardized `ApiErrorResponse` type; errors normalized in interceptor
- **401 handling**: Unauthorized responses trigger `onUnauthorized` callback (logs user out)

#### Form Validation
- Forms use `react-hook-form` with `@hookform/resolvers` for Zod schema validation
- Form types defined in `lib/auth/types/forms/`
- Zod schemas are typically defined inline or in type files
- Custom `FormTextField` component integrates with react-hook-form Controller

#### File Uploads
- Profile avatar upload uses `FormData` with `multipart/form-data`
- `lib/auth/utils/getMimeType.ts` determines MIME type from file URI
- On React Native, file objects need `{ uri, type, name }` structure

### Environment Variables

Required variables (see `.env.example`):
- `EXPO_PUBLIC_API_BASE_URL` - Backend API base URL
- `EXPO_PUBLIC_API_TOKEN_STORAGE_KEY` - Key for storing auth token in SecureStore/localStorage

### Path Aliases

The project uses `@/*` alias (configured in `tsconfig.json`):
```typescript
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/buttons';
```

## Android-Specific Notes

### HTTP Traffic on Android
By default, Android blocks cleartext (HTTP) traffic. If the backend uses HTTP (not HTTPS), you must add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

### Font Configuration
Custom FiraCode fonts are configured in `app.json` with platform-specific definitions. Android uses weight-based font families; iOS loads individual font files.

## Common Patterns

### Adding a New Auth Mutation
1. Define input/response types in `lib/auth/types/forms/`
2. Add mutation to `AuthContext` type definition
3. Create mutation hook in `AuthProvider` using `useApiMutation`
4. Wrap with `handleApiMutation` utility for consistent error handling
5. Add to context value and dependency array

### Adding a New Protected Screen
1. Create screen file in `app/dashboard/`
2. Use `useAuth()` hook to access auth state/methods
3. Auth guards are handled by routing logic (redirect to `/auth` if not authenticated)

### Creating API Request Hooks
```typescript
// For mutations (POST, PUT, DELETE)
const mutation = useApiMutation<InputType, ResponseType>(
  ['mutation', 'key'],
  { url: 'endpoint/path', method: 'POST' }
);

// For queries (GET)
const query = useApiQuery<ParamsType, ResponseType>(
  (params) => ['query', 'key', params],
  { url: 'endpoint/path', method: 'GET' },
  params,
  { enabled: someCondition }
);
```

## Technology Stack

- **Framework**: Expo SDK ~54.0 with React 19.1 and React Native 0.81
- **Routing**: expo-router (file-based routing)
- **State Management**: TanStack Query v5 for server state
- **Forms**: react-hook-form with Zod validation
- **HTTP Client**: Axios with custom hooks wrapping TanStack Query
- **Storage**: expo-secure-store (native), localStorage (web)
- **UI**: Custom themed components, React Navigation theming
- **Gestures**: react-native-gesture-handler + react-native-reanimated
