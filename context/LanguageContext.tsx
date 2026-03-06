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
} from 'react';

// Dictionaries
import { enDictionary, swDictionary } from '@/i18n/index';

export enum Language {
    ENGLISH = 'en',
    SWAHILI = 'sw',
}

interface LanguageContextType {
    language: Language;
    setLanguage: React.Dispatch<
        React.SetStateAction<Language>
    >;
    t: (key: string) => string;
}

const LanguageContext = createContext<
    LanguageContextType | undefined
>(undefined);

export default function LanguageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [language, setLanguage] = useState<Language>(
        Language.ENGLISH,
    );

    // Translation function
    const t = (key: string) => {
        if (language === Language.SWAHILI) {
            return swDictionary[key] || key;
        } else if (language === Language.ENGLISH) {
            return enDictionary[key] || key;
        }
        return key;
    };

    const value = useMemo(
        () => ({ language, setLanguage, t }),
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
