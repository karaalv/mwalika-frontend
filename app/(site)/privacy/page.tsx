'use client';
/**
 * @description: Privacy policy page for
 * the Mwalika application.
 */

// Styles
import styles from '@/styles/privacy/privacy.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
    // - Contexts -
    const { t } = useLanguage();

    // - Render -
    const renderTitle = () => (
        <div className={styles.section}>
            <h1 className="text-heading">
                {t('privacy.title')}
            </h1>
            <h2
                className="text-subheading"
                style={{ color: 'var(--text-secondary)' }}
            >
                {t('privacy.date_updated')}
            </h2>
        </div>
    );

    const renderOverview = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.overview.heading')}
            </h3>
            <p>{t('privacy.overview.content')}</p>
        </div>
    );

    const renderOpenSource = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.open_source.heading')}
            </h3>
            <p>{t('privacy.open_source.content')}</p>
        </div>
    );

    const renderDataCollection = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.collection.heading')}
            </h3>
            <p>{t('privacy.collection.intro')}</p>
            <ul>
                <li>{t('privacy.collection.item1')}</li>
                <li>{t('privacy.collection.item2')}</li>
                <li>{t('privacy.collection.item3')}</li>
                <li>{t('privacy.collection.item4')}</li>
            </ul>
            <p>{t('privacy.collection.note1')}</p>
            <p>{t('privacy.collection.note2')}</p>
        </div>
    );

    const renderHosting = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.hosting.heading')}
            </h3>
            <p>{t('privacy.hosting.content')}</p>
        </div>
    );

    const renderRetention = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.retention.heading')}
            </h3>
            <p>{t('privacy.retention.content')}</p>
        </div>
    );

    const renderCookies = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.cookies.heading')}
            </h3>
            <p>{t('privacy.cookies.content1')}</p>
            <p>{t('privacy.cookies.content2')}</p>
        </div>
    );

    const renderThirdPartyServices = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.third_party.heading')}
            </h3>
            <p>{t('privacy.third_party.intro')}</p>
            <ul>
                <li>{t('privacy.third_party.item1')}</li>
                <li>{t('privacy.third_party.item2')}</li>
                <li>{t('privacy.third_party.item3')}</li>
            </ul>
            <p>{t('privacy.third_party.note')}</p>
        </div>
    );

    const renderDisclaimer = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.disclaimer.heading')}
            </h3>
            <p>{t('privacy.disclaimer.content1')}</p>
            <p>{t('privacy.disclaimer.content2')}</p>
            <p>{t('privacy.disclaimer.content3')}</p>
        </div>
    );

    const renderChanges = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.changes.heading')}
            </h3>
            <p>{t('privacy.changes.content')}</p>
        </div>
    );

    const renderContact = () => (
        <div className={styles.section}>
            <h3 className="text-subsubheading">
                {t('privacy.contact.heading')}
            </h3>
            <p>{t('privacy.contact.content')}</p>
            <p>{t('privacy.contact.email')}</p>
        </div>
    );

    return (
        <div className={styles.container}>
            {renderTitle()}
            {renderOverview()}
            {renderOpenSource()}
            {renderDataCollection()}
            {renderHosting()}
            {renderRetention()}
            {renderCookies()}
            {renderThirdPartyServices()}
            {renderDisclaimer()}
            {renderChanges()}
            {renderContact()}
        </div>
    );
}
