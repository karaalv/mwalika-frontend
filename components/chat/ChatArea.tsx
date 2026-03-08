'use client';
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
import ChatPlaceholder from '@/components/chat/ChatPlaceholder';
import ChatInput from '@components/chat/ChatInput';
import ErrorModal from '@components/chat/ErrorModal';
import AgentThinking from '@components/chat/AgentThinking';

// Context
import { useChat } from '@/context/ChatContext';
import ChatMessages from './ChatMessages';

// Component props
interface ChatAreaProps {
    setIsSidebarOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function ChatArea({
    setIsSidebarOpen,
}: ChatAreaProps) {
    // - Context -
    const { uiError, memories } = useChat();

    // - Render -
    const renderErrorModal = () => {
        return (
            <div className={styles.errorModal}>
                <ErrorModal />
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.chatHeader}>
                <PanelLeft
                    className={styles.panelIcon}
                    onClick={() => setIsSidebarOpen(true)}
                />
                <span
                    className={`
                        text-body-standout
                        ${styles.chatTitle}
                    `}
                >
                    Chat Area
                </span>
            </div>
            {/* Render error if present */}
            {uiError && renderErrorModal()}
            <div className={styles.chatContent}>
                {/* Chat messages will go here */}
                {memories.length === 0 ? (
                    <ChatPlaceholder />
                ) : (
                    <ChatMessages messages={memories} />
                )}
                <AgentThinking />
            </div>
            <div className={styles.chatInput}>
                <ChatInput />
            </div>
        </div>
    );
}
