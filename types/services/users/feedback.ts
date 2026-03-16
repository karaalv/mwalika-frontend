/**
 * @description: This file contains types for user
 * feedback related information.
 */
import { UserLanguagePreference } from '@/types/services/users/core';

// --- Enums ---

export enum PromptSource {
    AGENT = 'agent',
    USER_TRIGGERED = 'user_triggered',
}

export enum IntendedServiceCategory {
    KRA = 'kra',
    NTSA = 'ntsa',
    BRS = 'brs',
    OTHER = 'other',
}

export enum ServiceMatchQuality {
    YES = 'yes',
    PARTLY = 'partly',
    NO = 'no',
}

export enum WhatHelped {
    FOUND_SERVICE = 'found_service',
    SAVED_TIME = 'saved_time',
    CLARITY = 'clarity',
    EASE_OF_USE = 'ease_of_use',
}

export enum WhatWentWrong {
    DID_NOT_FIND_SERVICE = 'did_not_find_service',
    UNCLEAR_ANSWER = 'unclear_answer',
    TOO_SLOW = 'too_slow',
    DID_NOT_UNDERSTAND = 'did_not_understand',
    WRONG_INFORMATION = 'wrong_information',
    OTHER = 'other',
}

// --- Main feedback submission type ---

export interface FeedbackSubmission {
    session_id: string | null;
    memory_id: string | null;
    language_preference: UserLanguagePreference | null;
    prompt_source: PromptSource | null;
    helpful: boolean | null;
    intended_service_category: IntendedServiceCategory | null;
    service_match_quality: ServiceMatchQuality | null;
    what_helped: WhatHelped[] | null;
    what_went_wrong: WhatWentWrong[] | null;
    comments: string | null;
}
