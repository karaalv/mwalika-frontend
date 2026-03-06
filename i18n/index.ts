/**
 * @description: This file acts as the main entry
 * point for the english and swahili translations
 * used in the Mwalika application. It exports the
 * translation objects for both languages.
 */
// English translations
import { enNavbarTranslations } from './en/navbar';
import { enHeroTranslations } from './en/hero';

// Swahili translations
import { swNavbarTranslations } from './sw/navbar';
import { swHeroTranslations } from './sw/hero';

export const enDictionary: Record<string, string> = {
    ...enNavbarTranslations,
    ...enHeroTranslations,
};

export const swDictionary: Record<string, string> = {
    ...swNavbarTranslations,
    ...swHeroTranslations,
};
