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

// Services
import {
    getAccessToken,
    ensureRefreshToken,
} from '@services/users/auth';

// Types

// --- Constants ---

const REFRESH_THRESHOLD_MS = 60 * 1000; // 1 minute before expiry

// --- Context ---

interface AuthContextType {
    accessToken: string | null;
}

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - State -
    const [accessToken, setAccessToken] = useState<
        string | null
    >(null);
    const [accessTokenExpiry, setAccessTokenExpiry] =
        useState<number | null>(null); // Store expiry time in ms
    const refreshAccessTimeoutRef = useRef<ReturnType<
        typeof setTimeout
    > | null>(null);
    const refreshAccessPromiseRef =
        useRef<Promise<void> | null>(null);

    // - Callbacks -
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
            const res = await getAccessToken();
            if (res.meta.success && res.data) {
                setAccessToken(res.data.access_token);
                setAccessTokenExpiry(
                    res.data.expires_at_ms,
                );
            } else {
                setAccessToken(null);
                setAccessTokenExpiry(null);
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

    const value = useMemo<AuthContextType>(
        () => ({ accessToken }),
        [accessToken],
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
