/**
 * @description: This file contains mappers for
 * transforming user-related data between different
 * formats used in the Mwalika application.
 */

// Types
import { UserLanguagePreference } from '@/types/services/users/core';
import { Language } from '@/context/LanguageContext';

export function mapLanguageToUserPreference(
    language: Language,
): UserLanguagePreference {
    switch (language) {
        case Language.ENGLISH:
            return UserLanguagePreference.ENGLISH;
        case Language.SWAHILI:
            return UserLanguagePreference.SWAHILI;
        default:
            return UserLanguagePreference.ENGLISH; // Default to English if unknown
    }
}

export function mapUserPreferenceToLanguage(
    preference: UserLanguagePreference,
): Language {
    switch (preference) {
        case UserLanguagePreference.ENGLISH:
            return Language.ENGLISH;
        case UserLanguagePreference.SWAHILI:
            return Language.SWAHILI;
        default:
            return Language.ENGLISH; // Default to English if unknown
    }
}
