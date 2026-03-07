'use client';
/**
 * @description Chat layout component, wraps
 * the chat page with necessary providers and styles.
 */
import React, { useEffect } from 'react';

export default function ChatLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Update the document title
    useEffect(() => {
        document.title = 'Mwalika | Ask Mwalika';
    }, []);
    return <>{children}</>;
}
