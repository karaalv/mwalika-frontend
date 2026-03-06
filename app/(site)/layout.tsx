/**
 * @description: This file contains the layout for
 * the landing page, privacy policy, and 404 page
 * of the Mwalika application. It wraps the Navbar,
 * footer and any relevant components for these pages.
 */

// React
import React from 'react';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Context
import SiteLayoutProvider from '@/context/LayoutContext';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SiteLayoutProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </SiteLayoutProvider>
    );
}
