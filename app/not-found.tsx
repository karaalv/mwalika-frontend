'use client';
/**
 * @description: 404 Not Found page for the
 * Mwalika application.
 */
// React
import { useEffect } from 'react';

// Styles
import styles from '@styles/not-found/not-found.module.css';

// Contexts
import { useLanguage } from '@/context/LanguageContext';
import { useSiteLayout } from '@/context/LayoutContext';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Types
import { NavbarTextColor } from '@/context/LayoutContext';

export default function NotFound() {
    // - Contexts -
    const { t } = useLanguage();
    const { setNavbarTextColor } = useSiteLayout();

    // - Effects -
    useEffect(() => {
        setNavbarTextColor(NavbarTextColor.DARK);
    }, [setNavbarTextColor]);

    return (
        <div className={styles.notFoundContainer}>
            <Navbar />
            <main className={styles.main}>
                <h1 className="text-heading">
                    {t('not_found.title')}
                </h1>
            </main>
            <div className={styles.footerContainer}>
                <Footer />
            </div>
        </div>
    );
}
