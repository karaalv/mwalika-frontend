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
import { useNotification } from '@/context/NotificationContext';
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
    const { activeMemory, activeSession } = useChat();
    const { uiError } = useNotification();

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
                    {activeSession
                        ? activeSession.chat_name
                        : 'Mwalika'}
                </span>
            </div>
            {/* Render error if present */}
            {uiError && renderErrorModal()}
            <div className={styles.chatContent}>
                {/* Chat messages will go here */}
                {activeMemory.length === 0 ? (
                    <ChatPlaceholder />
                ) : (
                    <ChatMessages messages={activeMemory} />
                )}
                <AgentThinking />
            </div>
            <div className={styles.chatInput}>
                <ChatInput />
            </div>
        </div>
    );
}
