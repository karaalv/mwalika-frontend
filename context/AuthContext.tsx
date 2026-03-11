'use client';
/**
 * @description: Authentication context used to manage
 * the state of the user's authentication status and
 * manage tokens and session information across the
 * application.
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from 'react';

// Contexts
import { useNotification } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';

// Services
import {
    getAccessToken,
    ensureRefreshToken,
    claimUserCookie,
} from '@services/users/auth';
import {
    fetchAnonymousUser,
    updateUserLanguagePreference,
} from '@services/users/core';

// Lib
import {
    mapLanguageToUserPreference,
    mapUserPreferenceToLanguage,
} from '@/lib/users/mappers';

// Types
import {
    SentryEvent,
    SeverityLevel,
} from '@/types/lib/observability/sentry/core.types';
import { captureError } from '@/lib/observability/sentry/client';

// --- Internal types ---

type AuthState =
    | 'pending'
    | 'authenticated'
    | 'unauthenticated';

// --- Constants ---

const REFRESH_THRESHOLD_MS = 60 * 1000; // 1 minute before expiry

// --- Context interface ---

interface AuthContextType {
    accessToken: string | null;
    authState: AuthState;
    setAccessToken: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    getStateAccessToken: () => string | null;
    setAccessTokenExpiry: React.Dispatch<
        React.SetStateAction<number | null>
    >;
    claimUserCookieHandler: (
        userId: string,
        claimToken: string,
        accessToken: string,
    ) => Promise<void>;
}

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - Context -
    const { setUiError } = useNotification();
    const { language, setLanguage } = useLanguage();

    // - State -
    const [authState, setAuthState] =
        useState<AuthState>('pending');
    const [accessToken, setAccessToken] = useState<
        string | null
    >(null);
    const accessTokenRef = useRef<string | null>(null);
    const [accessTokenExpiry, setAccessTokenExpiry] =
        useState<number | null>(null); // Store expiry time in ms
    const refreshAccessTimeoutRef = useRef<ReturnType<
        typeof setTimeout
    > | null>(null);
    const refreshAccessPromiseRef =
        useRef<Promise<void> | null>(null);

    // - Callbacks -
    const getStateAccessToken = useCallback(():
        | string
        | null => {
        return accessTokenRef.current;
    }, []);

    const clearRefreshAccessTimeout = useCallback(() => {
        if (refreshAccessTimeoutRef.current) {
            clearTimeout(refreshAccessTimeoutRef.current);
            refreshAccessTimeoutRef.current = null;
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        if (refreshAccessPromiseRef.current) {
            return refreshAccessPromiseRef.current;
        }
        // IIFE PROMISE to refresh the access token
        const refreshPromise = (async () => {
            const tokenResponse = await getAccessToken();
            if (tokenResponse) {
                setAccessToken(tokenResponse.access_token);
                setAccessTokenExpiry(
                    tokenResponse.expires_at_ms,
                );
                setAuthState('authenticated');
                accessTokenRef.current =
                    tokenResponse.access_token;
            } else {
                setAccessToken(null);
                setAccessTokenExpiry(null);
                setAuthState('unauthenticated');
                accessTokenRef.current = null;
                setUiError({
                    level: 'error',
                    message:
                        'Failed to refresh access token.',
                });
            }
        })();
        refreshAccessPromiseRef.current = refreshPromise;
        try {
            await refreshPromise;
        } finally {
            refreshAccessPromiseRef.current = null;
        }
    }, []);

    const scheduleAccessTokenRefresh = useCallback(() => {
        clearRefreshAccessTimeout();
        if (accessTokenExpiry) {
            const now = Date.now();
            const refreshTime =
                accessTokenExpiry -
                now -
                REFRESH_THRESHOLD_MS;
            if (refreshTime > 0) {
                refreshAccessTimeoutRef.current =
                    setTimeout(
                        refreshAccessToken,
                        refreshTime,
                    );
            } else {
                refreshAccessToken();
            }
        }
    }, [
        accessTokenExpiry,
        clearRefreshAccessTimeout,
        refreshAccessToken,
    ]);

    // Handler for claiming user cookie for anonymous users
    const claimUserCookieHandler = useCallback(
        async (
            userId: string,
            claimToken: string,
            accessToken: string,
        ) => {
            const tokenResponse = await claimUserCookie(
                userId,
                claimToken,
                accessToken,
            );

            // Update access token and expiry
            // on successful claim
            if (tokenResponse) {
                setAccessToken(tokenResponse.access_token);
                setAccessTokenExpiry(
                    tokenResponse.expires_at_ms,
                );
                setAuthState('authenticated');
            } else {
                setUiError({
                    level: 'error',
                    message: 'Failed to claim user cookie.',
                });
            }

            // Update user language preference
            // in the backend based on the current state
            await updateUserLanguagePreference(
                mapLanguageToUserPreference(language),
                accessToken,
            );
        },
        [setUiError, language],
    );

    // - Effects -
    // On mount, ensure we have a refresh
    // token and get an access token
    useEffect(() => {
        (async () => {
            await ensureRefreshToken();
            await refreshAccessToken();
        })();
    }, [refreshAccessToken]);

    // Whenever the access token or its expiry changes,
    // schedule the next refresh
    useEffect(() => {
        scheduleAccessTokenRefresh();
        return () => {
            clearRefreshAccessTimeout();
        };
    }, [
        accessToken,
        accessTokenExpiry,
        scheduleAccessTokenRefresh,
        clearRefreshAccessTimeout,
    ]);

    useEffect(() => {
        // On initial load, fetch the user's language preference
        // and set the language accordingly
        const fetchUserLanguagePreference = async () => {
            try {
                const accessToken = getStateAccessToken();
                if (!accessToken) {
                    return;
                }
                const user =
                    await fetchAnonymousUser(accessToken);
                if (!user) {
                    // If user is not set, leave
                    // language as default (English)
                    return;
                }
                const userLanguage =
                    mapUserPreferenceToLanguage(
                        user.language_preference,
                    );
                setLanguage(userLanguage);
            } catch (error) {
                const sentryEvent: SentryEvent = {
                    error: error,
                    page: 'AuthContext',
                    message:
                        'Error fetching user language preference',
                    level: SeverityLevel.WARNING,
                };
                captureError(sentryEvent);
            }
        };

        fetchUserLanguagePreference();
    }, [getStateAccessToken]);

    // - Memoized context value -
    const value = useMemo<AuthContextType>(
        () => ({
            accessToken,
            getStateAccessToken,
            authState,
            setAccessToken,
            setAccessTokenExpiry,
            claimUserCookieHandler,
        }),
        [accessToken, authState, claimUserCookieHandler],
    );
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// --- Hooks ---

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            'useAuth must be used within an AuthProvider',
        );
    }
    return context;
}
