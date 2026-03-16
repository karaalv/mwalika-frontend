/**
 * @description: Library for user-feedback related functions
 * and helpers.
 */
import {
    IntendedServiceCategory,
    ServiceMatchQuality,
    WhatHelped,
    WhatWentWrong,
} from '@/types/services/users/feedback';

// --- Feedback mapping functions ---

// NOTE: These mapping functions are used to get the
// language key used in the i18n translation files
// based on the enum value stored in the database.

export function mapIntendedServiceCategory(
    category: IntendedServiceCategory,
): string {
    switch (category) {
        case IntendedServiceCategory.KRA:
            return 'feedback.options.intent.tax';
        case IntendedServiceCategory.NTSA:
            return 'feedback.options.intent.transport';
        case IntendedServiceCategory.BRS:
            return 'feedback.options.intent.business';
        case IntendedServiceCategory.OTHER:
            return 'feedback.options.intent.other';
        default:
            return '';
    }
}

export function mapServiceMatchQuality(
    quality: ServiceMatchQuality,
): string {
    switch (quality) {
        case ServiceMatchQuality.YES:
            return 'feedback.options.match_quality.yes';
        case ServiceMatchQuality.PARTLY:
            return 'feedback.options.match_quality.partly';
        case ServiceMatchQuality.NO:
            return 'feedback.options.match_quality.no';
        default:
            return '';
    }
}

export function mapWhatHelped(helped: WhatHelped): string {
    switch (helped) {
        case WhatHelped.FOUND_SERVICE:
            return 'feedback.options.what_helped.found_service';
        case WhatHelped.SAVED_TIME:
            return 'feedback.options.what_helped.saved_time';
        case WhatHelped.CLARITY:
            return 'feedback.options.what_helped.clarity';
        case WhatHelped.EASE_OF_USE:
            return 'feedback.options.what_helped.ease_of_use';
        default:
            return '';
    }
}

export function mapWhatWentWrong(
    wentWrong: WhatWentWrong,
): string {
    switch (wentWrong) {
        case WhatWentWrong.DID_NOT_FIND_SERVICE:
            return 'feedback.options.what_went_wrong.did_not_find_service';
        case WhatWentWrong.UNCLEAR_ANSWER:
            return 'feedback.options.what_went_wrong.unclear_answer';
        case WhatWentWrong.TOO_SLOW:
            return 'feedback.options.what_went_wrong.too_slow';
        case WhatWentWrong.DID_NOT_UNDERSTAND:
            return 'feedback.options.what_went_wrong.did_not_understand';
        case WhatWentWrong.WRONG_INFORMATION:
            return 'feedback.options.what_went_wrong.wrong_information';
        case WhatWentWrong.OTHER:
            return 'feedback.options.what_went_wrong.other';
        default:
            return '';
    }
}
