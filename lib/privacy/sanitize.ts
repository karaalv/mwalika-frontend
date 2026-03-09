/**
 * @description: Sanitization utilities for user input
 * and data handling to ensure privacy and security in the
 * Mwalika application.
 */

// Config
import {
    MAX_INPUT_LENGTH as MAX_INPUT_LEN,
    MAX_SINGLE_INPUT_TOKEN_LENGTH as MAX_WORD_LEN,
} from '@services/agent/config';

const EMAIL_RE =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const PHONE_RE =
    /(?:\+?\d{1,3}[\s\-()]*)?(?:\d[\s\-()]*){7,14}/g;

const CARD_RE = /\b(?:\d[ -]*?){13,19}\b/g;

const ID_NUMBER_RE = /\b\d{7,12}\b/g;

const URL_RE = /\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+\b/gi;

const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

const WHITESPACE_RE = /\s+/g;

const LONG_SPACE_RE = /[ \t]{2,}/g;

const LONG_TOKEN_RE = new RegExp(
    `\\b\\S{${MAX_WORD_LEN},}\\b`,
    'g',
);

function stripControlChars(text: string): string {
    let result = '';

    for (const ch of text) {
        if (ch === '\n' || ch === '\t' || ch === ' ') {
            result += ch;
            continue;
        }

        // eslint-disable-next-line no-control-regex
        if (/[\u0000-\u001F\u007F-\u009F]/.test(ch)) {
            continue;
        }

        if (/[\u200B-\u200D\uFEFF]/.test(ch)) {
            continue;
        }

        result += ch;
    }

    return result;
}

function normaliseWhitespace(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(LONG_SPACE_RE, ' ')
        .trim();
}

function redactPii(text: string): string {
    return text
        .replace(EMAIL_RE, '[redacted-email]')
        .replace(URL_RE, '[redacted-url]')
        .replace(IPV4_RE, '[redacted-ip]')
        .replace(CARD_RE, '[redacted-card]')
        .replace(PHONE_RE, '[redacted-phone]')
        .replace(ID_NUMBER_RE, '[redacted-number]');
}

function cleanNoise(text: string): string {
    return text.replace(
        LONG_TOKEN_RE,
        '[redacted-long-token]',
    );
}

function looksLikeNonsense(text: string): boolean {
    if (!text) {
        return true;
    }

    const compact = text.replace(WHITESPACE_RE, '');

    if (!compact) {
        return true;
    }

    let alpha = 0;
    let digits = 0;

    for (const ch of compact) {
        if (/[A-Za-z]/.test(ch)) {
            alpha += 1;
            continue;
        }

        if (/\d/.test(ch)) {
            digits += 1;
        }
    }

    const alnum = alpha + digits;

    if (compact.length > 20 && alnum === 0) {
        return true;
    }

    if (compact.length >= 20) {
        let weird = 0;

        for (const ch of compact) {
            const isAlnum = /[A-Za-z0-9]/.test(ch);
            const isAllowedPunct = ".,?!:;'-_/()".includes(
                ch,
            );

            if (!isAlnum && !isAllowedPunct) {
                weird += 1;
            }
        }

        const weirdRatio = weird / compact.length;

        if (weirdRatio > 0.45) {
            return true;
        }
    }

    if (compact.length >= 24 && alpha > 0) {
        let vowels = 0;

        for (const ch of compact) {
            if ('aeiouAEIOU'.includes(ch)) {
                vowels += 1;
            }
        }

        const vowelRatio = vowels / Math.max(alpha, 1);

        if (vowelRatio < 0.08) {
            return true;
        }
    }

    return false;
}

/**
 * Used to scrub sensitive information from
 * user input or other data sources.
 *
 * @param value Input to scrub of
 * sensitive information
 * @returns The sanitized value
 */
export function scrub(
    value: unknown,
    limit: number = MAX_INPUT_LEN,
): unknown {
    if (typeof value !== 'string') {
        return value;
    }

    let text = value.normalize('NFKC');

    text = stripControlChars(text);
    text = normaliseWhitespace(text);

    if (!text) {
        return '';
    }

    text = text.slice(0, limit);
    text = cleanNoise(text);
    text = redactPii(text);
    text = normaliseWhitespace(text);

    if (looksLikeNonsense(text)) {
        return '[redacted-noisy-input]';
    }

    return text;
}

/**
 * Scrubs a string of sensitive information and normalizes it,
 * ensuring that any potentially harmful or private data is removed.
 *
 * @param value The string to be scrubbed
 * @param limit Optional maximum length for the scrubbed string
 * @returns The sanitized string
 */
export function scrubString(
    value: string,
    limit?: number,
): string {
    return scrub(value, limit) as string;
}
