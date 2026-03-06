/**
 * @description: This file acts as the main entry
 * point for the english and swahili translations
 * used in the Mwalika application. It exports the
 * translation objects for both languages.
 */
// English translations
import { enNavbarTranslations } from './en/navbar';

// Swahili translations
import { swNavbarTranslations } from './sw/navbar';

export const enDictionary: Record<string, string> = {
    ...enNavbarTranslations,
};

export const swDictionary: Record<string, string> = {
    ...swNavbarTranslations,
};
