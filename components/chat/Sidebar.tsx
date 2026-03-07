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
import styles from '@styles/chat/components/sidebar.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';

// Types
import { Language } from '@/context/LanguageContext';

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
    const { language, t, setLanguage } = useLanguage();

    // - State -
    const chatTitles: string[] = Array.from(
        { length: 100 },
        (_, i) => `Chat ${i + 1}`,
    );

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
                    onClick={() => setLanguage(en)}
                    style={{
                        opacity: language === en ? 1 : 0.6,
                    }}
                >
                    English
                </button>
                <div className={styles.circle} />
                <button
                    className="text-body"
                    onClick={() => setLanguage(sw)}
                    style={{
                        opacity: language === sw ? 1 : 0.6,
                    }}
                >
                    Kiswahili
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
        return (
            <button className={styles.newButton}>
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

    const renderChatTitles = () => {
        return (
            <div className={styles.chatContainer}>
                <span
                    className={`
                        text-body 
                        ${styles.chatHeader}
                        ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                    `}
                >
                    {`${t('chat.sidebar.chats')} (${chatTitles.length}/TODO:LIMIT)`}
                </span>
                <div className={styles.chatScrollContainer}>
                    {chatTitles.map((title, index) => (
                        <div
                            key={index}
                            className={`
                                ${styles.chatItem} 
                                ${!isSidebarOpen ? styles.sidebarItemClose : styles.sidebarItemOpen}
                            `}
                        >
                            <span className="text-body">
                                {title}
                            </span>
                        </div>
                    ))}
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
                {renderChatTitles()}
            </div>
            <div className={styles.sidebarFooter}>
                {renderLinks()}
                {renderLanguageOptions()}
            </div>
        </div>
    );
}
