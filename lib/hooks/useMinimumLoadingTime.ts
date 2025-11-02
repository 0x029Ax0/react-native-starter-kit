import { useEffect, useState } from 'react';

/**
 * Hook that implements smart loading state management:
 * - Delays showing loading indicator to avoid flicker on fast loads
 * - Ensures minimum display time once shown for smooth UX
 *
 * @param isLoading - The actual loading state from your data source
 * @param options - Configuration options
 * @returns Whether to show the loading UI
 *
 * @example
 * const { state } = useAuth();
 * const shouldShowLoading = useMinimumLoadingTime(state === "loading");
 *
 * if (shouldShowLoading) {
 *   return <LoadingSpinner />;
 * }
 */
export function useMinimumLoadingTime(
    isLoading: boolean,
    options: {
        /** Delay before showing loading (default: 200ms) */
        showDelay?: number;
        /** Minimum time to show loading once displayed (default: 500ms) */
        minDuration?: number;
    } = {}
): boolean {
    const { showDelay = 200, minDuration = 500 } = options;

    const [shouldShow, setShouldShow] = useState(false);
    const [showStartTime, setShowStartTime] = useState<number | null>(null);

    useEffect(() => {
        let showTimer: ReturnType<typeof setTimeout> | null = null;
        let hideTimer: ReturnType<typeof setTimeout> | null = null;

        if (isLoading) {
            // Start delay timer - only show loading if it takes longer than showDelay
            showTimer = setTimeout(() => {
                setShouldShow(true);
                setShowStartTime(Date.now());
            }, showDelay);
        } else {
            // Loading finished - check if we need to keep showing it
            if (showTimer) {
                // Loading finished before delay - never show loading screen
                clearTimeout(showTimer);
            }

            setShouldShow((currentShouldShow) => {
                if (currentShouldShow) {
                    setShowStartTime((currentShowStartTime) => {
                        if (currentShowStartTime) {
                            // We were showing loading - ensure minimum duration
                            const elapsed = Date.now() - currentShowStartTime;
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
                        return currentShowStartTime;
                    });
                }
                return currentShouldShow;
            });
        }

        return () => {
            if (showTimer) clearTimeout(showTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [isLoading, showDelay, minDuration]);

    return shouldShow;
}
