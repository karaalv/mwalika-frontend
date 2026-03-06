'use client';
/**
 * @description: Layout context used to manage
 * the state of the sites layout, such as mobile
 * variations and navbar colour schemes.
 */
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
} from 'react';
import { useMediaQuery } from 'react-responsive';

enum NavbarTextColor {
    LIGHT = 'light',
    DARK = 'dark',
}

interface SiteLayoutContextType {
    isMobile: boolean;
    navbarTextColor: NavbarTextColor;
    setNavbarTextColor: React.Dispatch<
        React.SetStateAction<NavbarTextColor>
    >;
}

const SiteLayoutContext = createContext<
    SiteLayoutContextType | undefined
>(undefined);

export default function SiteLayoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [navbarTextColor, setNavbarTextColor] =
        useState<NavbarTextColor>(NavbarTextColor.DARK);

    const value = useMemo(
        () => ({
            isMobile,
            navbarTextColor,
            setNavbarTextColor,
        }),
        [isMobile, navbarTextColor],
    );

    return (
        <SiteLayoutContext.Provider value={value}>
            {children}
        </SiteLayoutContext.Provider>
    );
}

export function useSiteLayout() {
    const context = useContext(SiteLayoutContext);
    if (!context) {
        throw new Error(
            'useSiteLayout must be used within a SiteLayoutProvider',
        );
    }
    return context;
}
