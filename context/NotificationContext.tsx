'use client';
/**
 * @description: Notification context used to
 * manage the state of notifications across the
 * application, providing a way to add and clear
 * notifications that can be displayed to the user.
 */

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
} from 'react';

// Types
import { UiError } from '@/types/lib/errors/ui.types';

interface NotificationContextType {
    // Error state
    uiError: UiError | null;
    setUiError: React.Dispatch<
        React.SetStateAction<UiError | null>
    >;
}

const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

export default function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [uiError, setUiError] = useState<UiError | null>(
        null,
    );

    const value = useMemo(
        () => ({ uiError, setUiError }),
        [uiError],
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            'useNotification must be used within a NotificationProvider',
        );
    }
    return context;
}
