'use client';
/**
 * @description: Footer component for the
 * application with contact information.
 */

// Contexts
import { useLanguage } from '@/context/LanguageContext';

// Styles
import styles from '@styles/layout/footer.module.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={styles.topRow}>
                <div className={styles.column}>
                    <span className="text-body">
                        Mwalika
                    </span>
                    <span className="text-body">
                        {t('footer.tagline')}
                    </span>
                </div>
                <div className={styles.column}>
                    <span className="text-body">
                        {t('footer.built_by')}
                    </span>
                    <div className={styles.contactLinks}>
                        <a
                            className="text-body"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://github.com/karaalv/mwalika-documentation"
                        >
                            GitHub
                        </a>
                        <div className={styles.circle} />
                        <a
                            className="text-body"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.linkedin.com/in/alvin-n-karanja/"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                <span className="text-body">
                    © 2026 Mwalika
                </span>
                <span className="text-body">
                    {t('footer.not_affiliated')}
                </span>
            </div>
        </footer>
    );
}
