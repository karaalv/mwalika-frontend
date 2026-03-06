/**
 * @description: Purpose section of
 * the landing page
 */

// Context
import { useLanguage } from '@/context/LanguageContext';

// Components
import PurposeItem from '@/components/landing/PurposeItem';

// Styles
import styles from '@/styles/landing/purpose.module.css';

export default function Purpose() {
    // - Contexts -
    const { t } = useLanguage();
    const tags = ['who', 'what', 'why'];
    const backupColors = {
        who: '#a1657d80',
        what: '#b9cee380',
        why: '#a59d8380',
    };

    // - Rendering callbacks -
    const renderItems = () => {
        return tags.map((tag) => (
            <PurposeItem
                key={tag}
                title={t(`purpose.${tag}.title`)}
                description={t(
                    `purpose.${tag}.description`,
                )}
                url={`/assets/${tag}.jpg`}
                backupColor={
                    backupColors[
                        tag as keyof typeof backupColors
                    ]
                }
            />
        ));
    };

    return (
        <section id="purpose" className={styles.container}>
            <h2 className="text-subheading">
                {t('purpose.heading')}
            </h2>
            <div className={styles.itemsContainer}>
                {renderItems()}
            </div>
        </section>
    );
}
