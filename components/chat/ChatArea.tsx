/**
 * @description: Chat area component, responsible
 * for rendering the main chat interface where users can
 * interact with the Mwalika chatbot.
 */

// React
import React from 'react';

// Icons
import { PanelLeft } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/chat-area.module.css';

// Components
import ChatInput from '@components/chat/ChatInput';

// Component props
interface ChatAreaProps {
    setIsSidebarOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function ChatArea({
    setIsSidebarOpen,
}: ChatAreaProps) {
    return (
        <div className={styles.container}>
            <div className={styles.chatHeader}>
                <PanelLeft
                    className={styles.panelIcon}
                    onClick={() => setIsSidebarOpen(true)}
                />
                <span className="text-body-standout">
                    Chat Area
                </span>
            </div>
            <div className={styles.chatContent}>
                {/* Chat messages will go here */}
                messages
            </div>
            <div className={styles.chatInput}>
                <ChatInput />
            </div>
        </div>
    );
}
