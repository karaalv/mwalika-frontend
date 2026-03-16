/**
 * @description: This component defines the FeedbackModal,
 * which is responsible for collecting user feedback on the
 * chatbot's responses.
 */
// React
import React, { useState } from 'react';

// Icons
import { X } from 'lucide-react';

// Styles
import styles from '@styles/chat/modals/feedback-modal.module.css';

// Context
import { useLanguage } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';

// Feedback library
import {
    mapIntendedServiceCategory,
    mapServiceMatchQuality,
    mapWhatHelped,
    mapWhatWentWrong,
} from '@/lib/users/feedback';

// Lib
import { mapLanguageToUserPreference } from '@/lib/users/mappers';

// Types
import {
    IntendedServiceCategory,
    ServiceMatchQuality,
    WhatHelped,
    WhatWentWrong,
    FeedbackSubmission,
    PromptSource,
} from '@/types/services/users/feedback';
import { Language } from '@/context/LanguageContext';
import { AgentSession } from '@/types/services/agent/sessions.types';
import { AgentMemory } from '@/types/services/agent/memory.types';

// Services
import { submitUserFeedback } from '@services/users/feedback';

// --- Helper functions ---

function initFeedback(
    session: AgentSession | null = null,
    memory: AgentMemory[] | null = null,
    language: Language | null = null,
    feedbackTrigger: PromptSource | null = null,
): FeedbackSubmission {
    const userLanguage = language
        ? mapLanguageToUserPreference(language)
        : null;
    const sessionId = session ? session.session_id : null;
    const memoryId = memory
        ? memory.length > 0
            ? memory[memory.length - 1].memory_id
            : null
        : null;
    return {
        session_id: sessionId,
        memory_id: memoryId,
        language_preference: userLanguage,
        prompt_source: feedbackTrigger,
        helpful: null,
        intended_service_category: null,
        service_match_quality: null,
        what_helped: null,
        what_went_wrong: null,
        comments: null,
    };
}

export default function FeedbackModal() {
    // - Context -
    const { t, language } = useLanguage();
    const {
        activeSession,
        activeMemory,
        requestingFeedback,
        setRequestingFeedback,
    } = useChat();
    const { getStateAccessToken } = useAuth();

    // - State -
    const [feedbackState, setFeedbackState] =
        useState<FeedbackSubmission>(
            initFeedback(
                activeSession,
                activeMemory,
                language,
                requestingFeedback,
            ),
        );
    const [helpful, setHelpful] = useState<boolean | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] =
        useState<boolean>(false);
    const [hasSubmitted, setHasSubmitted] =
        useState<boolean>(false);
    const isSubmitDisabled =
        helpful === null || isSubmitting || hasSubmitted;

    // - Helpers -
    const handleHelpfulChange = (value: boolean) => {
        setHelpful(value);
        setFeedbackState((prev) => ({
            ...prev,
            helpful: value,
        }));
    };

    const closeFeedback = () => {
        setRequestingFeedback(null);
    };

    // Intent
    const isIntentChecked = (
        category: IntendedServiceCategory,
    ) => {
        return (
            feedbackState.intended_service_category ===
            category
        );
    };

    const handleIntentChange = (
        category: IntendedServiceCategory,
    ) => {
        setFeedbackState((prev) => ({
            ...prev,
            intended_service_category: category,
        }));
    };

    const getIntentLabel = (
        category: IntendedServiceCategory,
    ) => {
        return t(mapIntendedServiceCategory(category));
    };

    // Service match quality
    const isServiceQualityChecked = (
        quality: ServiceMatchQuality,
    ) => {
        return (
            feedbackState.service_match_quality === quality
        );
    };

    const handleServiceQualityChange = (
        quality: ServiceMatchQuality,
    ) => {
        setFeedbackState((prev) => ({
            ...prev,
            service_match_quality: quality,
        }));
    };

    const getServiceQualityLabel = (
        quality: ServiceMatchQuality,
    ) => {
        return t(mapServiceMatchQuality(quality));
    };

    // What helped
    const isWhatHelpedChecked = (helped: WhatHelped) => {
        return (
            feedbackState.what_helped?.includes(helped) ||
            false
        );
    };

    const handleWhatHelpedChange = (helped: WhatHelped) => {
        const current = feedbackState.what_helped || [];
        if (current.includes(helped)) {
            // Uncheck
            setFeedbackState((prev) => ({
                ...prev,
                what_helped: current.filter(
                    (h) => h !== helped,
                ),
            }));
        } else {
            // Check
            setFeedbackState((prev) => ({
                ...prev,
                what_helped: [...current, helped],
            }));
        }
    };

    const getWhatHelpedLabel = (helped: WhatHelped) => {
        return t(mapWhatHelped(helped));
    };

    // What went wrong
    const isWhatWentWrongChecked = (
        wentWrong: WhatWentWrong,
    ) => {
        return (
            feedbackState.what_went_wrong?.includes(
                wentWrong,
            ) || false
        );
    };

    const handleWhatWentWrongChange = (
        wentWrong: WhatWentWrong,
    ) => {
        const current = feedbackState.what_went_wrong || [];
        if (current.includes(wentWrong)) {
            // Uncheck
            setFeedbackState((prev) => ({
                ...prev,
                what_went_wrong: current.filter(
                    (w) => w !== wentWrong,
                ),
            }));
        } else {
            // Check
            setFeedbackState((prev) => ({
                ...prev,
                what_went_wrong: [...current, wentWrong],
            }));
        }
    };

    const getWhatWentWrongLabel = (
        wentWrong: WhatWentWrong,
    ) => {
        return t(mapWhatWentWrong(wentWrong));
    };

    // Comment
    const handleCommentChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const value = e.target.value;
        setFeedbackState((prev) => ({
            ...prev,
            comments: value,
        }));
    };

    // Submit
    const handleSubmit = async () => {
        if (isSubmitDisabled) return;

        setIsSubmitting(true);

        try {
            const authToken = getStateAccessToken();
            if (!authToken) {
                throw new Error(
                    'User is not authenticated',
                );
            }
            await submitUserFeedback(
                feedbackState,
                authToken,
            );
        } catch (_error) {
            // Ignore errors for smoother
            // UX
        }

        setIsSubmitting(false);
        setHasSubmitted(true);

        // Close feedback after
        // submission
        setTimeout(() => {
            closeFeedback();
        }, 4000);
    };

    // - Render -
    const renderHelpfulOptions = () => {
        const values = [
            {
                label: t('feedback.options.helpful.yes'),
                value: true,
            },
            {
                label: t('feedback.options.helpful.no'),
                value: false,
            },
        ];
        return (
            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>
                    {t('feedback.options.helpful.title')}
                </span>
                <div
                    className={
                        styles.helpfulOptionsContainer
                    }
                >
                    {values.map((option) => (
                        <button
                            type="button"
                            key={option.label}
                            className={`
                                ${styles.formOption}
                                ${helpful === option.value ? styles.selected : ''}
                            `}
                            onClick={() => {
                                handleHelpfulChange(
                                    option.value,
                                );
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderIntentOptions = () => {
        return (
            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>
                    {t('feedback.options.intent.title')}
                </span>
                {Object.values(IntendedServiceCategory).map(
                    (category) => (
                        <label
                            key={category}
                            className={styles.formOption}
                        >
                            <input
                                type="radio"
                                name="intent"
                                value={category}
                                checked={isIntentChecked(
                                    category,
                                )}
                                onChange={() =>
                                    handleIntentChange(
                                        category,
                                    )
                                }
                            />
                            <span>
                                {getIntentLabel(category)}
                            </span>
                        </label>
                    ),
                )}
            </div>
        );
    };

    const renderServiceQualityOptions = () => {
        return (
            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>
                    {t(
                        'feedback.options.match_quality.title',
                    )}
                </span>
                {Object.values(ServiceMatchQuality).map(
                    (quality) => (
                        <label
                            key={quality}
                            className={styles.formOption}
                        >
                            <input
                                type="radio"
                                name="match_quality"
                                value={quality}
                                checked={isServiceQualityChecked(
                                    quality,
                                )}
                                onChange={() =>
                                    handleServiceQualityChange(
                                        quality,
                                    )
                                }
                            />
                            <span>
                                {getServiceQualityLabel(
                                    quality,
                                )}
                            </span>
                        </label>
                    ),
                )}
            </div>
        );
    };

    const renderWhatHelpedOptions = () => {
        return (
            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>
                    {t(
                        'feedback.options.what_helped.title',
                    )}
                </span>
                {Object.values(WhatHelped).map((helped) => (
                    <label
                        key={helped}
                        className={styles.formOption}
                    >
                        <input
                            type="checkbox"
                            name="what_helped"
                            value={helped}
                            checked={isWhatHelpedChecked(
                                helped,
                            )}
                            onChange={() =>
                                handleWhatHelpedChange(
                                    helped,
                                )
                            }
                        />
                        <span>
                            {getWhatHelpedLabel(helped)}
                        </span>
                    </label>
                ))}
            </div>
        );
    };

    const renderWhatWentWrongOptions = () => {
        return (
            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>
                    {t(
                        'feedback.options.what_went_wrong.title',
                    )}
                </span>
                {Object.values(WhatWentWrong).map(
                    (wentWrong) => (
                        <label
                            key={wentWrong}
                            className={styles.formOption}
                        >
                            <input
                                type="checkbox"
                                name="what_went_wrong"
                                value={wentWrong}
                                checked={isWhatWentWrongChecked(
                                    wentWrong,
                                )}
                                onChange={() =>
                                    handleWhatWentWrongChange(
                                        wentWrong,
                                    )
                                }
                            />
                            <span>
                                {getWhatWentWrongLabel(
                                    wentWrong,
                                )}
                            </span>
                        </label>
                    ),
                )}
            </div>
        );
    };

    const renderCommentOption = () => {
        return (
            <div className={styles.commentOptionContainer}>
                <span className={styles.optionsTitle}>
                    {t('feedback.options.comments.title')}
                </span>
                <textarea
                    className={styles.commentBox}
                    value={feedbackState.comments || ''}
                    onChange={handleCommentChange}
                />
            </div>
        );
    };

    const renderSubmitLoader = () => {
        return <div className={styles.spinner} />;
    };

    const renderSubmitText = () => {
        return hasSubmitted
            ? ''
            : t('feedback.modal.submit');
    };

    const renderSubmitButton = () => {
        return (
            <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitDisabled}
            >
                {isSubmitting
                    ? renderSubmitLoader()
                    : renderSubmitText()}
            </button>
        );
    };

    const renderThankYouMessage = () => {
        return (
            <div className={styles.thankYouContainer}>
                <h2 className={styles.thankYouTitle}>
                    {t('feedback.modal.thank_you.title')}
                </h2>
                <p className={styles.thankYouDescription}>
                    {t(
                        'feedback.modal.thank_you.description',
                    )}
                </p>
            </div>
        );
    };

    // Form options are rendered based on
    // helpful state
    const renderHelpfulForm = () => {
        return (
            <>
                {renderIntentOptions()}
                {renderServiceQualityOptions()}
                {renderWhatHelpedOptions()}
            </>
        );
    };

    const renderUnhelpfulForm = () => {
        return (
            <>
                {renderIntentOptions()}
                {renderWhatWentWrongOptions()}
            </>
        );
    };

    const renderManagedHelpfulState = () => {
        let options = null;
        if (helpful === null) {
            return null;
        } else if (helpful === true) {
            options = renderHelpfulForm();
        } else {
            options = renderUnhelpfulForm();
        }

        return (
            <>
                {options}
                {renderCommentOption()}
                {renderSubmitButton()}
            </>
        );
    };

    const renderFormOptions = () => {
        return (
            <>
                {renderHelpfulOptions()}
                {renderManagedHelpfulState()}
            </>
        );
    };

    return (
        <form
            className={styles.container}
            id="feedback-form"
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            {/* Header */}
            <div className={styles.headerContainer}>
                <span className="text-subsubheading">
                    {t('feedback.modal.title')}
                </span>
                <div
                    className={styles.iconContainer}
                    onClick={closeFeedback}
                >
                    <X className={styles.icon} />
                </div>
            </div>
            {hasSubmitted
                ? renderThankYouMessage()
                : renderFormOptions()}
        </form>
    );
}
