'use client';
/**
 * @description: Chat input component, responsible
 * for sending user messages to the agent.
 */
// React
import React, { useRef } from 'react';

// Icons
import { ArrowUp } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/chat-input.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';

export default function ChatInput() {
    // - Contexts -

    const { t } = useLanguage();

    // - State -

    const inputRef = useRef<HTMLTextAreaElement>(null);

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
    };

    return (
        <div className={styles.container}>
            <textarea
                ref={inputRef}
                className={`text-body ${styles.input}`}
                rows={1}
                placeholder={t(
                    'chat.chat_input.placeholder',
                )}
                onChange={chatInputHandler}
            />
            <button className={styles.sendButton}>
                <ArrowUp className={styles.icon} />
            </button>
        </div>
    );
}
