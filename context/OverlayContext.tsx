'use client';
/**
 * @description: Overlay context used to manage the state of
 * various overlays across the application, such as modals,
 * side panels, and other UI elements that appear on top of
 * the main content.
 */

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
} from 'react';

export enum OverlayType {
    BUG_REPORT = 'BUG_REPORT',
}

interface OverlayContextType {
    // Current open overlay
    currentOverlay: OverlayType | null;
    // Function to open an overlay
    openOverlay: (overlay: OverlayType) => void;
    // Function to close the current overlay
    closeOverlay: () => void;
}

const OverlayContext = createContext<
    OverlayContextType | undefined
>(undefined);

export default function OverlayProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentOverlay, setCurrentOverlay] =
        useState<OverlayType | null>(null);

    const openOverlay = (overlay: OverlayType) => {
        setCurrentOverlay(overlay);
    };

    const closeOverlay = () => {
        setCurrentOverlay(null);
    };

    const value = useMemo(
        () => ({
            currentOverlay,
            openOverlay,
            closeOverlay,
        }),
        [currentOverlay],
    );

    return (
        <OverlayContext.Provider value={value}>
            {children}
        </OverlayContext.Provider>
    );
}

export function useOverlay() {
    const context = useContext(OverlayContext);
    if (context === undefined) {
        throw new Error(
            'useOverlay must be used within an OverlayProvider',
        );
    }
    return context;
}
