/**
 * @description: Hero section of the landing
 * page
 */

// React
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Styles
import styles from '@/styles/landing/hero.module.css';

// Context
import {
    useSiteLayout,
    NavbarTextColor,
} from '@/context/LayoutContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Hero() {
    // - Contexts -
    const { t } = useLanguage();
    const { setNavbarTextColor } = useSiteLayout();

    // - State -
    const heroRef = useRef<HTMLElement>(null);
    const router = useRouter();

    // Rendering callbacks
    const renderCTAButton = () => {
        return (
            <button
                className={styles.cta}
                onClick={() => router.push('/chat')}
            >
                {t('hero.cta')}
            </button>
        );
    };

    // Set navbar text to light if hero
    // is in view, and dark otherwise
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setNavbarTextColor(
                        NavbarTextColor.LIGHT,
                    );
                } else {
                    setNavbarTextColor(
                        NavbarTextColor.DARK,
                    );
                }
            },
            {
                root: null,
                threshold: 0,
            },
        );

        observer.observe(hero);

        return () => observer.disconnect();
    }, [setNavbarTextColor]);

    return (
        <section
            id="hero"
            className={styles.hero}
            ref={heroRef}
        >
            <div className={styles.content}>
                <div
                    className={styles.taglineAndDescription}
                >
                    <div
                        className={styles.taglineContainer}
                    >
                        <h1 className="text-heading">
                            {t('hero.tagline_1')}
                        </h1>
                        <h1 className="text-heading">
                            {t('hero.tagline_2')}
                        </h1>
                    </div>
                    <p className={styles.description}>
                        {t('hero.description')}
                    </p>
                </div>
                {renderCTAButton()}
            </div>
        </section>
    );
}
