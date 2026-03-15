'use client';
/**
 * @description: Chat area component, responsible
 * for rendering the main chat interface where users can
 * interact with the Mwalika chatbot.
 */

// React
import React, {
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';

// Icons
import { PanelLeft, ArrowDown } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/chat-area.module.css';

// Components
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

    // - State -
    const chatContentRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef<boolean>(true);
    const [showScrollToBottom, setShowScrollToBottom] =
        useState<boolean>(false);
    // Resolve current message length for auto scroll
    const lastMemory =
        activeMemory[activeMemory.length - 1];
    const lastMemoryContentItem =
        lastMemory?.content?.[
            lastMemory.content.length - 1
        ];
    const currentMessageLength =
        lastMemoryContentItem?.payload.length || 0;

    // - Helpers -
    const scrollToBottom = (smooth: boolean) => {
        messagesEndRef.current?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
        });
    };

    const isNearBottom = (el: HTMLElement | null) => {
        if (!el) return false;
        return (
            el.scrollHeight -
                el.scrollTop -
                el.clientHeight <
            150
        );
    };

    const handleScroll = () => {
        shouldAutoScrollRef.current = isNearBottom(
            chatContentRef.current,
        );
    };

    // - Render -
    const renderErrorModal = () => {
        return (
            <div className={styles.errorModal}>
                <ErrorModal />
            </div>
        );
    };

    const renderScrollToBottomButton = () => {
        if (!showScrollToBottom) return null;
        return (
            <button
                className={styles.scrollToBottomButton}
                onClick={() => scrollToBottom(true)}
            >
                <ArrowDown
                    className={styles.scrollToBottomIcon}
                />
            </button>
        );
    };

    // - Effects -
    // Scroll to bottom on new messages,
    // but only if user is already near bottom
    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            scrollToBottom(true);
        }
    }, [currentMessageLength]);

    // Scroll to bottom on session change
    useLayoutEffect(() => {
        const chatContentEl = chatContentRef.current;
        if (!chatContentEl) return;
        chatContentEl.scrollTop =
            chatContentEl.scrollHeight;
    }, [activeSession?.session_id]);

    // Show "scroll to bottom" button if user scrolls up
    useEffect(() => {
        const chatRef = chatContentRef.current;
        const endRef = messagesEndRef.current;

        if (!chatRef || !endRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowScrollToBottom(
                    !entry.isIntersecting,
                );
            },
            {
                root: chatRef,
                threshold: 0.1,
            },
        );

        observer.observe(endRef);

        return () => {
            observer.disconnect();
        };
    }, []);

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
            <div
                className={styles.chatContent}
                ref={chatContentRef}
                onScroll={handleScroll}
            >
                {/* Chat messages will go here */}
                <ChatMessages messages={activeMemory} />
                <AgentThinking />
                <div ref={messagesEndRef} />
            </div>
            <div className={styles.chatInput}>
                {renderScrollToBottomButton()}
                <ChatInput
                    scrollToBottom={scrollToBottom}
                />
            </div>
        </div>
    );
}
