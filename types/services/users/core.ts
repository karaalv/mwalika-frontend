/**
 * @description: Core types for user-related data structures and
 * operations in the Mwalika application.
 */

export enum UserLanguagePreference {
    ENGLISH = 'english',
    SWAHILI = 'swahili',
}

export interface AnonymousUser {
    user_id: string;
    language_preference: UserLanguagePreference;
    created_at: string;
    last_active_at: string;
}
