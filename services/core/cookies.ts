'use server';
/**
 * @description: This file contains cookie management
 * functions for the Mwalika application, providing utilities
 * to parse and handle cookies from API responses.
 */

// Next
import { cookies } from 'next/headers';

// Lib
import {
    splitSetCookie,
    parseSetCookie,
} from '@/lib/api/parsing';

/**
 * Utility function to parse a raw Set-Cookie
 * header string and set the cookies in the
 * Next.js cookies store, this overwrites
 * existing cookies with the same name.
 *
 * @param setCookieHeader
 */
export async function setCookieHeader(
    setCookieHeader: string,
): Promise<void> {
    const cookieStore = await cookies();
    const cookiesArray = splitSetCookie(setCookieHeader);
    for (const cookieStr of cookiesArray) {
        const { name, value, options } =
            parseSetCookie(cookieStr);
        // Set the cookie in the Next.js cookies store
        cookieStore.set(name, value, options);
    }
}
