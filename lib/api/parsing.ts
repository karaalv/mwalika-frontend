'use server';
/**
 * @description this file contains the parsing logic
 * for the Mwalika API responses, providing functions to
 * handle and transform API responses data.
 */

// Internal types and interface

interface CookieOptions {
    path?: string;
    domain?: string;
    sameSite?: 'lax' | 'strict' | 'none' | boolean;
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    priority?: 'low' | 'medium' | 'high';
    partitioned?: boolean;
}

// --- Cookie Management ---

/**
 * Splits a raw Set-Cookie header string into
 * individual cookie strings.
 * @param rawSetCookie
 * @returns Array of individual cookie strings
 */
export function splitSetCookie(
    rawSetCookie: string | null,
): string[] {
    if (!rawSetCookie) return [];
    return rawSetCookie.split(/,(?=\s*[^;=]+=[^;]+)/);
}

/**
 * Parses a raw Set-Cookie header string into
 * its individual components.
 * @param raw Set-Cookie header string
 * @returns Parsed cookie object
 */
export function parseSetCookie(raw: string): {
    name: string;
    value: string;
    options: CookieOptions;
} {
    const parts = raw.split(';').map((s) => s.trim());
    const nv = parts.shift() || '';
    const i = nv.indexOf('=');
    const name = nv.slice(0, i);
    const value = nv.slice(i + 1);

    const options: CookieOptions = {};
    for (const a of parts) {
        const j = a.indexOf('=');
        const k = (
            j === -1 ? a : a.slice(0, j)
        ).toLowerCase();
        const v = j === -1 ? '' : a.slice(j + 1).trim();

        if (k === 'path') options.path = v || '/';
        else if (k === 'domain') options.domain = v;
        else if (k === 'samesite')
            options.sameSite = v.toLowerCase() as any;
        else if (k === 'max-age')
            options.maxAge = Number(v);
        else if (k === 'expires')
            options.expires = new Date(v);
        else if (k === 'httponly')
            options.httpOnly = v.toLowerCase() === 'true';
        else if (k === 'secure')
            options.secure = v.toLowerCase() === 'true';
        else if (k === 'priority')
            options.priority = v as any;
        else if (k === 'partitioned')
            options.partitioned =
                v.toLowerCase() === 'true';
    }
    return { name, value, options };
}
