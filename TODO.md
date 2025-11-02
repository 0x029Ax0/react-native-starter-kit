# TODO: Code Improvements

This document lists potential improvements for the codebase, organized by priority.

---

## 🔴 Critical Issues (Should Fix Before Production)

### 3. Incomplete OAuth Implementation
- **Location**: `app/auth/login.tsx:50-67`
- **Issue**: Opens OAuth URL but no callback route to handle tokens
- **Impact**: OAuth flow doesn't complete - users can't log in via OAuth
- **Fix**: Add OAuth callback route (e.g., `/auth/oauth/callback`) and handle token exchange

### 4. Missing Environment Variable Validation
- **Location**: Throughout codebase
- **Issue**: No runtime validation that required env vars are set
- **Impact**: Silent failures, unclear errors
- **Fix**: Validate on app start, throw meaningful errors if missing

### 5. Insecure Production Configuration
- **Location**: `android/app/src/main/AndroidManifest.xml`
- **Issue**: `usesCleartextTraffic="true"` allows HTTP in production
- **Impact**: Security risk in production builds
- **Fix**: Make conditional based on `__DEV__` or remove for production builds

---

## 🟡 High Priority (Quality & Reliability)

### 9. No Loading States in Forms
- **Issue**: Forms don't show loading state during submission
- **Impact**: Poor UX, multiple submissions possible
- **Fix**: Add `isSubmitting` checks, disable buttons, show spinners

### 10. Inconsistent Error Handling
- **Location**: Compare `app/auth/login.tsx` vs `app/auth/register.tsx`
- **Issue**: Different patterns for displaying errors
- **Impact**: Inconsistent UX, some errors only logged
- **Fix**: Standardize error display pattern across all forms

---

## 🟢 Medium Priority (UX & Code Quality)

### 11. Wrong Label on Password Confirmation
- **Location**: `app/auth/register.tsx:89`
- **Issue**: Password confirmation field labeled "Password" instead of "Confirm Password"
- **Impact**: Confusing for users
- **Fix**: Change label to "Confirm Password"

### 12. Production Logging
- **Location**: Throughout codebase
- **Issue**: `console.debug()` calls everywhere
- **Impact**: Leaks implementation details, clutters logs
- **Fix**: Replace with proper logging service, remove in production

### 13. Starter Kit Naming
- **Location**: `lib/auth/AuthProvider.tsx:50`, `.env:3`
- **Issue**: Default token key is `"starter-kit-access-token"`
- **Impact**: Unprofessional, suggests unfinished template
- **Fix**: Rename to app-specific key (e.g., `"app-access-token"`)

### 14. No Offline Support
- **Issue**: No persistence for TanStack Query, no offline detection
- **Impact**: Poor experience on flaky networks
- **Fix**: Add AsyncStorage persister for queries, handle offline states

### 15. Missing Loading States in Screens
- **Location**: `app/dashboard/profile.tsx`, `app/dashboard/index.tsx`
- **Issue**: No loading indicators for data fetching
- **Impact**: Blank screens while loading
- **Fix**: Add skeleton screens or loading indicators

### 16. No Form Reset After Success
- **Issue**: Forms don't reset after successful submission
- **Impact**: Can accidentally resubmit same data
- **Fix**: Call `reset()` after successful operations

### 17. Hardcoded Brand Name
- **Location**: `app/auth/login.tsx:88`
- **Issue**: "Floppie AI" hardcoded in login screen
- **Impact**: Hard to rebrand, not configurable
- **Fix**: Move to config/constants file

---

## 🔵 Low Priority (Nice to Have)

### 18. No Pull-to-Refresh
- **Issue**: Can't manually refresh data in profile/dashboard
- **Impact**: Stale data if user wants to check updates
- **Fix**: Add RefreshControl to scrollable screens

### 19. No Analytics Integration
- **Issue**: No tracking for user actions, errors
- **Impact**: Can't measure engagement, hard to debug production issues
- **Fix**: Add analytics service (Amplitude, Mixpanel, Firebase Analytics, etc.)

### 20. No Biometric Authentication
- **Issue**: Only password login, no biometric option
- **Impact**: Less convenient for returning users
- **Fix**: Add expo-local-authentication for Face ID/Touch ID

### 21. Missing Haptic Feedback
- **Issue**: expo-haptics installed but not used
- **Impact**: Less tactile experience
- **Fix**: Add haptics on button presses, success/error states

### 22. No Image Compression
- **Issue**: Avatar uploads send full-size images
- **Impact**: Slow uploads, server storage waste
- **Fix**: Compress images before upload (expo-image-manipulator)

### 23. No Deep Linking Configuration
- **Issue**: No deep link handling configured
- **Impact**: Can't open app from links (password reset, OAuth callback)
- **Fix**: Configure expo-linking with proper URL schemes

### 24. Inconsistent Font Usage
- **Location**: `app/auth/login.tsx:84`
- **Issue**: FiraCode loaded but used inconsistently (only in login header)
- **Impact**: Inconsistent branding
- **Fix**: Either use consistently or remove custom font

### 25. No Form Autofill Support
- **Issue**: No `textContentType` props on inputs
- **Impact**: iOS autofill doesn't work
- **Fix**: Add appropriate `textContentType` values (username, password, etc.)

### 26. Missing Accessibility Labels
- **Issue**: No `accessibilityLabel` on many touchable elements
- **Impact**: Poor screen reader experience
- **Fix**: Add accessibility props throughout

### 27. No Rate Limiting Protection
- **Issue**: No client-side rate limiting on API calls
- **Impact**: Can spam requests (login attempts, etc.)
- **Fix**: Add debouncing/throttling on sensitive operations

---

## 📋 Architectural Improvements

### 28. Token Management Architecture
- **Location**: `lib/auth/AuthProvider.tsx` and `lib/http/AxiosInstance.tsx`
- **Issue**: Token stored in two places (module variable + state), manual sync required
- **Fix**: Centralize token management, use single source of truth

### 29. Form Component Reusability
- **Issue**: Could extract common form wrapper pattern
- **Fix**: Create FormContainer component for KeyboardAvoidingView + ScrollView pattern

### 30. API Hook Abstraction
- **Location**: `lib/auth/AuthProvider.tsx`
- **Issue**: All auth methods manually call `handleApiMutation`
- **Fix**: Could create higher-order function to reduce boilerplate

---

## 🔧 Development Experience

### 31. Missing TypeScript Strict Checks
- **Location**: `tsconfig.json`
- **Issue**: Could enable stricter TypeScript settings
- **Fix**: Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

### 32. No Pre-commit Hooks
- **Issue**: No linting/formatting enforcement
- **Fix**: Add husky + lint-staged

### 33. No Test Suite
- **Issue**: No tests for critical auth flows
- **Fix**: Add Jest + React Native Testing Library

### 34. No API Mock Setup
- **Issue**: Requires live backend for development
- **Fix**: Add MSW (Mock Service Worker) for API mocking

---

## Summary by Severity

- **🔴 Critical (1-5)**: Must fix before production
- **🟡 High (6-10)**: Should fix for quality release
- **🟢 Medium (11-17)**: UX and polish improvements
- **🔵 Low (18-27)**: Nice-to-have features
- **📋 Architectural (28-30)**: Long-term code health
- **🔧 Dev Experience (31-34)**: Development workflow

---

## Quick Wins (Easy fixes with high impact)

1. Fix QueryClient memory leak (#1) - 1 line change
2. Fix password confirmation label (#11) - 1 line change
3. Rename starter-kit token key (#13) - 2 line change
4. Add loading states to buttons (#9) - Use `isSubmitting` from react-hook-form

---

*Generated from codebase review on 2025-11-01*
