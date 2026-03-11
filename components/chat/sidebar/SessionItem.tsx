'use client';
/**
 * @description: Chat sidebar session item
 * component, renders an individual session
 * in the chat sidebar with options to edit or delete
 * the session.
 */

// React/Next
import React, { useState, useRef, useEffect } from 'react';

// Icons
import { Pencil, Trash2, Ellipsis } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/sidebar/session-item.module.css';

// Contexts
import { useLanguage } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';

// Types
import { AgentSession } from '@/types/services/agent/sessions.types';

// Lib
import { scrubString } from '@/lib/privacy/sanitize';

// Main component props
interface SessionItemProps {
    session: AgentSession;
}

// --- Main Component ---

export default function SessionItem({
    session,
}: SessionItemProps) {
    // - Contexts -
    const { setSessionFromSidebar, updateSessionName } =
        useChat();

    // - State -
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOptionsOpen, setIsOptionsOpen] =
        useState<boolean>(false);
    const [chatName, setChatName] = useState<string>(
        session.chat_name,
    );
    const [isEditingChatName, setIsEditingChatName] =
        useState<boolean>(false);

    // - Callbacks -
    const handleChatNameChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChatName(e.target.value);
    };

    const handleChatNameBlur = () => {
        setChatName(session.chat_name);
        setIsEditingChatName(false);
    };

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Enter') {
            const sanitizedChatName = scrubString(chatName);
            if (sanitizedChatName.trim() === '') {
                setChatName(session.chat_name);
            } else {
                updateSessionName(
                    session.session_id,
                    sanitizedChatName,
                );
            }
            setIsEditingChatName(false);
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setChatName(session.chat_name);
            setIsEditingChatName(false);
            inputRef.current?.blur();
        }
    };

    const handleInputClick = (
        e: React.MouseEvent<HTMLInputElement>,
    ) => {
        e.stopPropagation();
        if (!isEditingChatName) {
            setSessionFromSidebar(session);
        }
    };

    const handleInputMouseDown = (
        e: React.MouseEvent<HTMLInputElement>,
    ) => {
        if (!isEditingChatName) {
            // prevents browser from
            // focusing the input
            e.preventDefault();
        }
    };

    // - Effects -
    // Focus and select input text when
    // entering edit mode
    useEffect(() => {
        if (isEditingChatName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingChatName]);

    // Keep chat name in sync with session data,
    // but only if not currently editing name
    useEffect(() => {
        if (!isEditingChatName) {
            setChatName(session.chat_name);
        }
    }, [session.chat_name, isEditingChatName]);

    return (
        <div
            onClick={() => setSessionFromSidebar(session)}
            className={`
                ${styles.container} 
                ${isOptionsOpen ? styles.containerOptionsOpen : ''}
            `}
        >
            <input
                ref={inputRef}
                className={`
                    text-body 
                    ${styles.chatItem}
                `}
                value={chatName}
                onChange={handleChatNameChange}
                onBlur={handleChatNameBlur}
                readOnly={!isEditingChatName}
                onKeyDown={handleInputKeyDown}
                onClick={handleInputClick}
                onMouseDown={handleInputMouseDown}
            />
            <Ellipsis
                className={styles.ellipsisIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOptionsOpen((prev) => !prev);
                }}
            />
            {isOptionsOpen && (
                <OptionsMenu
                    session={session}
                    setIsOptionsOpen={setIsOptionsOpen}
                    setIsEditingChatName={
                        setIsEditingChatName
                    }
                />
            )}
        </div>
    );
}

// --- Options Menu Component ---

interface OptionsMenuProps {
    session: AgentSession;
    setIsOptionsOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    setIsEditingChatName: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

function OptionsMenu({
    session,
    setIsOptionsOpen,
    setIsEditingChatName,
}: OptionsMenuProps) {
    // - Contexts -
    const { t } = useLanguage();
    const { deleteSession } = useChat();

    // - State -
    const optionsMenuRef = useRef<HTMLDivElement>(null);

    // - Effects -
    // Close options menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsMenuRef.current &&
                !optionsMenuRef.current.contains(
                    event.target as Node,
                )
            ) {
                setIsOptionsOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        );
        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            );
        };
    }, []);
    return (
        <div
            ref={optionsMenuRef}
            className={styles.optionsMenu}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className={styles.optionsButton}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingChatName(true);
                    setIsOptionsOpen(false);
                }}
            >
                <Pencil className={styles.optionsIcon} />
                {t('chat.sidebar.session_options.rename')}
            </button>
            <button
                className={`
                    ${styles.optionsButton}
                    ${styles.deleteOption}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.session_id);
                    setIsOptionsOpen(false);
                }}
            >
                <Trash2 className={styles.optionsIcon} />
                {t('chat.sidebar.session_options.delete')}
            </button>
        </div>
    );
}
