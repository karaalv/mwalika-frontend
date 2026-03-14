/**
 * @description: This file acts as the main entry
 * point for the english and swahili translations
 * used in the Mwalika application. It exports the
 * translation objects for both languages.
 */
// English translations
import { enNavbarTranslations } from './en/navbar';
import { enHeroTranslations } from './en/hero';
import { enPurposeTranslations } from './en/purpose';
import { enFooterTranslations } from './en/footer';
import { enNotFoundTranslations } from './en/not-found';
import { enPrivacyTranslations } from './en/privacy';
import { enChatTranslations } from './en/chat';
import { enOverlayTranslations } from './en/overlay';

// Swahili translations
import { swNavbarTranslations } from './sw/navbar';
import { swHeroTranslations } from './sw/hero';
import { swPurposeTranslations } from './sw/purpose';
import { swFooterTranslations } from './sw/footer';
import { swNotFoundTranslations } from './sw/not-found';
import { swPrivacyTranslations } from './sw/privacy';
import { swChatTranslations } from './sw/chat';
import { swOverlayTranslations } from './sw/overlay';

export const enDictionary: Record<string, string> = {
    ...enNavbarTranslations,
    ...enHeroTranslations,
    ...enPurposeTranslations,
    ...enFooterTranslations,
    ...enNotFoundTranslations,
    ...enPrivacyTranslations,
    ...enChatTranslations,
    ...enOverlayTranslations,
};

export const swDictionary: Record<string, string> = {
    ...swNavbarTranslations,
    ...swHeroTranslations,
    ...swPurposeTranslations,
    ...swFooterTranslations,
    ...swNotFoundTranslations,
    ...swPrivacyTranslations,
    ...swChatTranslations,
    ...swOverlayTranslations,
};
