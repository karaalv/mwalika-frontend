'use client';
/**
 * @description: Chat sidebar component, provides
 * navigation and additional options for the chat
 * interface.
 */

// React/Next
import React from 'react';
import Link from 'next/link';

// Icons
import {
    LockKeyhole,
    PanelLeftDashed,
    PanelLeft,
    Plus,
    Sparkles,
} from 'lucide-react';

// Styles
import styles from '@styles/chat/components/sidebar/sidebar.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';

// Components
import SessionItem from '@/components/chat/sidebar/SessionItem';

// Types
import { Language } from '@/context/LanguageContext';

// Constants
import { MAX_AGENT_SESSIONS } from '@/services/agent/config';

// Component props
interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
}: SidebarProps) {
    // - Contexts -
    const { language, t, setLanguageUpdatePreference } =
        useLanguage();
    const { sessions, isLoadingSessions, newSession } =
        useChat();
    const { getStateAccessToken } = useAuth();

    // - State -

    // - Callback handlers -
    const handleLanguageChange = async (lang: Language) => {
        await setLanguageUpdatePreference(
            lang,
            getStateAccessToken() || '',
        );
    };

    // - Render -

    const renderLanguageOptions = () => {
        const en = Language.ENGLISH;
        const sw = Language.SWAHILI;
        return (
            <div
                className={`
                    ${styles.languageOptions}
                    ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                `}
            >
                <button
                    className="text-body"
                    onClick={() => handleLanguageChange(en)}
                    style={{
                        opacity: language === en ? 1 : 0.6,
                    }}
                >
                    English
                </button>
                <div className={styles.circle} />
                <button
                    className="text-body"
                    onClick={() => handleLanguageChange(sw)}
                    style={{
                        opacity: language === sw ? 1 : 0.6,
                    }}
                >
                    Swahili
                </button>
            </div>
        );
    };

    const renderToggleButton = () => {
        return (
            <div
                className={`
                    ${styles.toggleButton} 
                    ${isSidebarOpen ? styles.open : styles.closed}
                `}
                onClick={() =>
                    setIsSidebarOpen(!isSidebarOpen)
                }
            >
                {isSidebarOpen ? (
                    <PanelLeftDashed
                        className={styles.icon}
                    />
                ) : (
                    <PanelLeft className={styles.icon} />
                )}
            </div>
        );
    };

    const renderNewButton = () => {
        const isNewDisabled =
            sessions.length >= MAX_AGENT_SESSIONS;
        return (
            <button
                className={styles.newButton}
                onClick={newSession}
                disabled={isNewDisabled}
            >
                <div className={styles.plusIconContainer}>
                    <Plus className={styles.plusIcon} />
                </div>
                <span
                    className={
                        !isSidebarOpen
                            ? styles.sidebarItemClose
                            : styles.sidebarItemOpen
                    }
                >
                    {t('chat.sidebar.new')}
                </span>
            </button>
        );
    };

    const renderLinks = () => {
        return (
            <div className={styles.linkContainer}>
                <Link
                    className={styles.link}
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Sparkles className={styles.aiIcon} />
                    <span
                        className={`text-body-standout ${
                            !isSidebarOpen
                                ? styles.sidebarItemClose
                                : styles.sidebarItemOpen
                        }`}
                    >
                        Mwalika
                    </span>
                </Link>
                <Link
                    className={styles.link}
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LockKeyhole className={styles.icon} />
                    <span
                        className={`text-body-standout ${
                            !isSidebarOpen
                                ? styles.sidebarItemClose
                                : styles.sidebarItemOpen
                        }`}
                    >
                        {t('chat.sidebar.links.privacy')}
                    </span>
                </Link>
            </div>
        );
    };

    const renderEmptyState = () => {
        return (
            <span
                className={`
                    text-body 
                    ${styles.emptyState}
                    ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                `}
            >
                {t('chat.sidebar.empty')}
            </span>
        );
    };

    const renderLoadingState = () => {
        return (
            <div
                className={`
                    ${styles.loadingSkeleton} 
                    ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                `}
            />
        );
    };

    const renderChatSessions = () => {
        if (sessions.length === 0) {
            return renderEmptyState();
        }
        return sessions.map((session) => (
            <SessionItem
                key={session.session_id}
                session={session}
            />
        ));
    };

    const renderChatInfo = () => {
        return (
            <div className={styles.chatContainer}>
                <span
                    className={`
                        text-body 
                        ${styles.chatHeader}
                        ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                    `}
                >
                    {`${t('chat.sidebar.chats')} (${sessions.length}/${MAX_AGENT_SESSIONS})`}
                </span>
                <div
                    className={`
                    ${styles.chatScrollContainer} 
                    ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                    `}
                >
                    {isLoadingSessions
                        ? renderLoadingState()
                        : renderChatSessions()}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebarHeader}>
                {renderToggleButton()}
            </div>
            <div className={styles.sidebarBody}>
                {renderNewButton()}
                {renderChatInfo()}
            </div>
            <div className={styles.sidebarFooter}>
                {renderLinks()}
                {renderLanguageOptions()}
            </div>
        </div>
    );
}
