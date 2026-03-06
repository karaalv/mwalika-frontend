import React from 'react';
import type { Metadata } from 'next';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <LanguageProvider>
                <SiteLayoutProvider>
                    <body>{children}</body>
                </SiteLayoutProvider>
            </LanguageProvider>
        </html>
    );
}
