'use client';
/**
 * @description: 404 Not Found page for the
 * Mwalika application.
 */

// Styles
import styles from '@styles/not-found/not-found.module.css';

// Contexts
import { useLanguage } from '@/context/LanguageContext';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
    const { t } = useLanguage();

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
