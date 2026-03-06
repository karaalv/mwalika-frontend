'use client';
/**
 * @description: This file defines the main
 * landing page of the Mwalika application.
 */

// Styles
import styles from '@/styles/landing/landing-page.module.css';

// Sections
import Hero from '@/components/landing/Hero';
import Purpose from '@/components/landing/Purpose';

export default function LandingPage() {
    return (
        <div className={styles.container}>
            <Hero />
            <div className={styles.paddingContainer}>
                <Purpose />
            </div>

            {/* Padding for footer */}
            <div />
        </div>
    );
}
