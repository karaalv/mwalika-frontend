'use client';
/**
 * @description: Chat page component,
 * renders the chat interface where users can interact
 * with the Mwalika chatbot to find government services.
 */
// React
import { useState, useEffect } from 'react';

// Styles
import styles from '@styles/chat/chat-page.module.css';

// Context
import { useSiteLayout } from '@/context/LayoutContext';

// Components
import Sidebar from '@components/chat/Sidebar';
import ChatArea from '@components/chat/ChatArea';

export default function ChatPage() {
    // - Context -
    const { isMobile } = useSiteLayout();

    // - State -
    // Open default on desktop, closed on mobile
    const [isSidebarOpen, setIsSidebarOpen] =
        useState<boolean>(!isMobile);

    // - Effects -
    // Update the document title
    useEffect(() => {
        document.title = 'Mwalika | Ask Mwalika';
    }, []);
    return (
        <div className={styles.container}>
            <div
                className={`
                    ${styles.sidebar} 
                    ${styles.state}
                    ${isSidebarOpen ? styles.open : styles.closed}
                `}
            >
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>

            <div className={styles.chatArea}>
                <ChatArea
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>
        </div>
    );
}
