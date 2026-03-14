'use client';
/**
 * @description: Chat input component, responsible
 * for sending user messages to the agent.
 */
// React
import React, { useRef, useState } from 'react';

// Icons
import { ArrowUp } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/chat-input.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';

// Lib
import { generateUuid } from '@/lib/shared/ids';
import { scrubString } from '@/lib/privacy/sanitize';

// Component props
interface ChatInputProps {
    scrollToBottom: (smooth: boolean) => void;
}

export default function ChatInput({
    scrollToBottom,
}: ChatInputProps) {
    // - Contexts -
    const { t } = useLanguage();
    const {
        activeSession,
        addUserMessageToMemory,
        isAgentThinking,
        isAgentResponding,
    } = useChat();
    const { sendMessage } = useSocket();

    // - State -
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [message, setMessage] = useState<string>('');
    const isSendDisabled =
        message.trim() === '' ||
        isAgentThinking ||
        isAgentResponding;

    // - Handlers -

    const chatInputHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const textArea = event.currentTarget;

        // Reset height to auto to get the
        // correct scrollHeight
        textArea.style.height = 'auto';

        // Set height based on scroll height,
        // but respect min and max heights
        const maxHeight = parseInt(
            getComputedStyle(textArea).maxHeight,
        );
        const newHeight = Math.min(
            textArea.scrollHeight,
            maxHeight,
        );
        textArea.style.height = `${newHeight}px`;
        setMessage(event.target.value);
    };

    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
            scrollToBottom(true);
        }
    };

    const handleSendMessage = () => {
        // Guard against empty messages or
        // sending while agent is processing/responding
        if (isSendDisabled) return;

        const sanitizedMessage = scrubString(
            message.trim(),
        );
        if (sanitizedMessage === '') {
            setMessage('');
            return;
        }

        const sessionId =
            activeSession?.session_id || generateUuid();

        // 1. Update UI with user message
        addUserMessageToMemory(sessionId, sanitizedMessage);

        // 2. Send message to agent via WebSocket
        sendMessage(sessionId, sanitizedMessage);

        // 3. Clear input field and reset height
        setMessage('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }
    };

    return (
        <div className={styles.container}>
            <textarea
                ref={inputRef}
                className={`${styles.input}`}
                rows={1}
                placeholder={t(
                    'chat.chat_input.placeholder',
                )}
                onChange={chatInputHandler}
                onKeyDown={handleKeyPress}
                value={message}
                disabled={
                    isAgentThinking || isAgentResponding
                }
            />
            <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={isSendDisabled}
            >
                <ArrowUp className={styles.icon} />
            </button>
        </div>
    );
}
