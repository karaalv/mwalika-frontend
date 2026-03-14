/**
 * @description: This component contains the bug report
 * form that users can fill out to report issues they encounter
 * while using the Mwalika chatbot. It is displayed as an
 * overlay on top of the chat interface when triggered.
 */
// React
import { useState } from 'react';

// Styles
import styles from '@styles/chat/overlay/bug-report.module.css';

// Context
import { useOverlay } from '@/context/OverlayContext';
import { useLanguage } from '@/context/LanguageContext';

// Lib
import { submitBugReport } from '@/lib/observability/sentry/client';

export default function BugReport() {
    // - Context -
    const { closeOverlay } = useOverlay();
    const { t } = useLanguage();

    // - State -
    const [description, setDescription] =
        useState<string>('');
    const [isSubmitting, setIsSubmitting] =
        useState<boolean>(false);
    const [hasSubmitted, setHasSubmitted] =
        useState<boolean>(false);
    const isSubmitDisabled =
        description.trim() === '' ||
        isSubmitting ||
        hasSubmitted;

    // - Callback handlers -
    const handleSubmit = async () => {
        if (isSubmitDisabled) return;

        setIsSubmitting(true);
        try {
            await submitBugReport(description);
        } catch (_error) {
            // Swallow error, show thank you
            // message anyway to avoid frustrating user
        } finally {
            setHasSubmitted(true);
            setIsSubmitting(false);
            setTimeout(() => {
                closeOverlay();
            }, 3000); // Close after 3 seconds
        }
    };

    // - Render -
    const renderSubmitLoader = () => {
        return <div className={styles.spinner} />;
    };

    const renderSubmitText = () => {
        return hasSubmitted
            ? t('overlay.error_report.submitted')
            : t('overlay.error_report.submit');
    };

    const renderSubmitButton = () => {
        return (
            <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
            >
                {isSubmitting
                    ? renderSubmitLoader()
                    : renderSubmitText()}
            </button>
        );
    };

    const renderCancelButton = () => {
        return (
            <button
                className={styles.cancelButton}
                onClick={closeOverlay}
                disabled={isSubmitting}
            >
                {t('overlay.error_report.cancel_button')}
            </button>
        );
    };

    const renderButtons = () => {
        return (
            <div className={styles.buttonContainer}>
                {renderSubmitButton()}
                {renderCancelButton()}
            </div>
        );
    };

    const renderForm = () => {
        return (
            <>
                <textarea
                    className={styles.textarea}
                    placeholder={t(
                        'overlay.error_report.message_placeholder',
                    )}
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    disabled={isSubmitting || hasSubmitted}
                />
                {renderButtons()}
            </>
        );
    };

    const renderThankYouMessage = () => {
        return (
            <p className={styles.thankYouMessage}>
                {t('overlay.error_report.thank_you')}
            </p>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h3 className="text-subsubheading">
                    {t('overlay.error_report.title')}
                </h3>
                <p className={styles.descriptionText}>
                    {t('overlay.error_report.description')}
                </p>
            </div>

            <div className={styles.formContainer}>
                {hasSubmitted
                    ? renderThankYouMessage()
                    : renderForm()}
            </div>
        </div>
    );
}
