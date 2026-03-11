/**
 * @description: This file contains Core user service
 * interactions with the backend API, providing functions
 * to handle user-related operations such as fetching user
 * data and managing user preferences.
 */
// Core
import { httpAgent } from '@services/core/http';

// Types
import {
    AnonymousUser,
    UserLanguagePreference,
} from '@/types/services/users/core';

/**
 * Fetches the current anonymous user data from the backend
 * API, this includes information such as the user's unique
 * identifier, language preference, and timestamps for when
 * the user was created and last active.
 *
 * @returns AnonymousUser data or null if the request fails
 */
export async function fetchAnonymousUser(
    authToken: string,
): Promise<AnonymousUser | null> {
    const res = await httpAgent<AnonymousUser | null>(
        '/api/users/me',
        'GET',
        true,
        authToken,
    );

    if (!res || !res.meta.success || !res.data) {
        return null;
    }

    return res.data;
}

/**
 * Updates the user's language preference in the backend API,
 * allowing the user to switch between supported languages in
 * the application. This function sends a PATCH request to the
 * API with the new language preference and returns the updated
 * user data if successful.
 */
export async function updateUserLanguagePreference(
    language: UserLanguagePreference,
    authToken: string,
): Promise<null> {
    const res = await httpAgent<null>(
        `/api/users/language-preference/${language}`,
        'PATCH',
        true,
        authToken,
    );
    console.log(
        'Language preference update response:',
        res,
    );

    if (!res || !res.meta.success || !res.data) {
        return null;
    }

    return res.data;
}
