'use server';
/**
 * @description: This file contains the authentication
 * logic for the users routes in the Mwalika application
 * providing functions to handle token generation and user
 * session management.
 */
// Next
import { cookies } from 'next/headers';

// Core
import { httpAgent } from '@services/core/http';

// Types
import { HttpApiResponse } from '@/types/services/api/responses.types';
import { TokenResponse } from '@/types/services/auth/tokens';

/**
 * Obtains a new refresh token from the backend
 * API, this token is set as a cookie in the
 * httpAgent function, and is used for maintaining
 * user sessions and refreshing access tokens when
 * they expire.
 *
 * @returns HttpApiResponse with null data
 */
export async function ensureRefreshToken(): Promise<
    HttpApiResponse<null>
> {
    const cookieStore = await cookies();
    if (cookieStore.has('mwalika_rt')) {
        const res: HttpApiResponse<null> = {
            meta: {
                request_id: '',
                success: true,
                message: 'Refresh token already exists',
                timestamp: new Date().toISOString(),
            },
            data: null,
        };
        return res;
    }
    return await httpAgent(
        '/api/users/mwalika-rt',
        'GET',
        true,
    );
}

/**
 * Obtains a new access token from the backend
 * API, this token is used for authenticating
 * requests to protected endpoints and is typically
 * short-lived, while the refresh token is used to
 * obtain new access tokens when they expire.
 *
 * @returns HttpApiResponse containing the new
 * access token
 */
export async function getAccessToken(): Promise<
    HttpApiResponse<TokenResponse | null>
> {
    return await httpAgent(
        '/api/users/mwalika-at',
        'GET',
        true,
    );
}

/**
 * Claims user cookie for anonymous user, associating the
 * users session with a user account. User cookie and new
 * refresh token are set in the httpAgent function, and are used
 * for subsequent authentication and session management.
 *
 * @param userId The ID of the user to claim the cookie for
 * @param claimToken The token used to claim the cookie
 * @param authToken The current authentication token for the user
 * @returns HttpApiResponse containing the new access token
 */
export async function claimUserCookie(
    userId: string,
    claimToken: string,
    authToken: string,
): Promise<HttpApiResponse<TokenResponse | null>> {
    return await httpAgent(
        '/api/users/claim-cookie',
        'POST',
        true,
        authToken,
        {
            user_id: userId,
            claim_token: claimToken,
        },
    );
}
