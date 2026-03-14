/**
 * @description: Root layout for
 * the Mwalika application.
 */

// React/Next
import React from 'react';
import type { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import type { Viewport } from 'next';

// Styles
import '@styles/base/reset.css';
import '@styles/base/variables.css';
import '@styles/base/typography.css';
import '@styles/base/global.css';

// Context
import LanguageProvider from '@/context/LanguageContext';
import SiteLayoutProvider from '@/context/LayoutContext';

export const metadata: Metadata = {
    title: 'Mwalika | Government Services, Explained Simply',
    description: `Discover the right eCitizen service through
        simple conversation. Mwalika helps you identify
        which government service you need without navigating complex menus.`,
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // - Config -
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
    return (
        <html lang="en">
            <body>
                <GoogleTagManager gtmId={gtmId} />
                <LanguageProvider>
                    <SiteLayoutProvider>
                        {children}
                    </SiteLayoutProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
