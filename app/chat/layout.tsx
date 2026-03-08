/**
 * @description Chat layout component, wraps
 * the chat page with necessary providers and styles.
 */

// React/Next
import React from 'react';
import { Metadata } from 'next';

// Context
import ChatProvider from '@/context/ChatContext';

// Change title for chat page
export const metadata: Metadata = {
    title: 'Mwalika | Ask Mwalika',
    description: `Discover the right eCitizen service through
        simple conversation. Mwalika helps you identify
        which government service you need without navigating 
        complex menus.`,
};

export default function ChatLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ChatProvider>{children}</ChatProvider>;
}
