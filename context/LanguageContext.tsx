'use client';
/**
 * @description: Language context used
 * to manage the state of the application's
 * current language and provide a method to
 * switch between languages.
 */

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from 'react';

// Dictionaries
import { enDictionary, swDictionary } from '@/i18n/index';

// Services
import { updateUserLanguagePreference } from '@services/users/core';

// Lib
import { mapLanguageToUserPreference } from '@/lib/users/mappers';

// Observability
import { captureError } from '@/lib/observability/sentry/client';

// Types
import {
    SentryEvent,
    SeverityLevel,
} from '@/types/lib/observability/sentry/core.types';

export enum Language {
    ENGLISH = 'english',
    SWAHILI = 'swahili',
}

interface LanguageContextType {
    language: Language;
    setLanguage: React.Dispatch<
        React.SetStateAction<Language>
    >;
    t: (key: string) => string;
    setLanguageUpdatePreference: (
        lang: Language,
        accessToken: string,
    ) => Promise<void>;
}

const LanguageContext = createContext<
    LanguageContextType | undefined
>(undefined);

export default function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - Context -
    // This is the highest level context,
    // unless this provider is nested inside another provider,
    // DO NOT try to use any other context inside this provider

    // - State -
    const [language, setLanguage] = useState<Language>(
        Language.ENGLISH,
    );

    // - Helper functions -
    // Translation function
    const t = (key: string) => {
        if (language === Language.SWAHILI) {
            return swDictionary[key] || key;
        } else if (language === Language.ENGLISH) {
            return enDictionary[key] || key;
        }
        return key;
    };

    const setLanguageUpdatePreference = useCallback(
        async (lang: Language, accessToken: string) => {
            setLanguage(lang);
            if (!accessToken) {
                return;
            }
            try {
                if (!accessToken) {
                    return;
                }
                await updateUserLanguagePreference(
                    mapLanguageToUserPreference(lang),
                    accessToken,
                );
            } catch (error) {
                const sentryEvent: SentryEvent = {
                    error: error,
                    page: 'LanguageContext',
                    message:
                        'Error updating user language preference',
                    level: SeverityLevel.WARNING,
                };
                captureError(sentryEvent);
            }
        },
        [],
    );

    // - Effects -

    // - Memoized context value -
    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t,
            setLanguageUpdatePreference,
        }),
        [language],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error(
            'useLanguage must be used within a LanguageProvider',
        );
    }
    return context;
}
