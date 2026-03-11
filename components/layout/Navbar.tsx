'use client';
/**
 * @description: Navbar component for the
 * Mwalika application.
 */

// React
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Icons
import { X, Menu } from 'lucide-react';

// Styles
import styles from '@/styles/layout/navbar.module.css';

// Context
import { useSiteLayout } from '@/context/LayoutContext';
import { useLanguage } from '@/context/LanguageContext';

// Types
import { Language } from '@/context/LanguageContext';

export default function Navbar() {
    // - Contexts -
    const { isMobile, navbarTextColor } = useSiteLayout();
    const { language, t, setLanguage } = useLanguage();

    // - State -
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // - Callback handlers -
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (isMobile) {
                setIsOpen(false);
            }
        }
    };

    // - Rendering callbacks -
    const renderAskMwalika = (color: 'green' | 'black') => {
        return (
            <button
                onClick={() => router.push('/chat')}
                className={styles.askMwalikaButton}
                style={{
                    backgroundColor:
                        color === 'green'
                            ? 'var(--color-accent)'
                            : 'var(--text-primary)',
                }}
            >
                {t('navbar.ask_mwalika')}
            </button>
        );
    };

    const renderPageLinks = () => {
        // Set color based on context and open
        // state
        const color =
            isOpen || navbarTextColor === 'dark'
                ? 'var(--text-primary)'
                : 'var(--text-alternative)';

        return (
            <div className={styles.pageLinks}>
                <button
                    onClick={() => {
                        if (pathname === '/') {
                            scrollToSection('purpose');
                            return;
                        } else {
                            router.push('/#purpose');
                        }
                    }}
                    style={{ color }}
                    className={styles.navbarPageLink}
                >
                    {t('navbar.purpose')}
                </button>
                <button
                    onClick={() => router.push('/privacy')}
                    style={{ color }}
                    className={styles.navbarPageLink}
                >
                    {t('navbar.privacy')}
                </button>
            </div>
        );
    };

    const renderLanguageToggle = () => {
        const color =
            isOpen || navbarTextColor === 'dark'
                ? 'var(--text-primary)'
                : 'var(--text-alternative)';
        const languages = {
            [Language.ENGLISH]: 'English',
            [Language.SWAHILI]: 'Swahili',
        };
        return (
            <div className={styles.languageSelector}>
                {Object.entries(languages).map(
                    ([key, label]) => (
                        <button
                            key={key}
                            style={{
                                color,
                                opacity:
                                    language === key
                                        ? 1
                                        : 0.6,
                            }}
                            onClick={() =>
                                setLanguage(key as Language)
                            }
                        >
                            {label}
                        </button>
                    ),
                )}
            </div>
        );
    };

    const renderMobileMenu = () => {
        if (!isMobile) return null;
        return (
            <div className={styles.mobileMenu}>
                {renderPageLinks()}
                {renderAskMwalika('black')}
                {renderLanguageToggle()}
            </div>
        );
    };

    const renderDesktopMenu = () => {
        if (isMobile) return null;
        return (
            <div className={styles.desktopMenu}>
                {renderLanguageToggle()}
                {renderPageLinks()}
                {renderAskMwalika('green')}
            </div>
        );
    };

    const renderMenuIcon = () => {
        if (!isMobile) return null;
        const color =
            isOpen || navbarTextColor === 'dark'
                ? 'var(--text-primary)'
                : 'var(--text-alternative)';
        return (
            <button
                className={styles.iconContainer}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isOpen ? (
                    <X
                        className={styles.icon}
                        color={color}
                    />
                ) : (
                    <Menu
                        className={styles.icon}
                        color={color}
                    />
                )}
            </button>
        );
    };

    return (
        <nav
            className={`${styles.navbar} ${isOpen ? styles.navbarOpen : ''}`}
        >
            <div className={styles.navbarRow}>
                {renderMenuIcon()}
                {!isMobile && renderDesktopMenu()}
            </div>
            {isOpen && renderMobileMenu()}
        </nav>
    );
}
