/**
 * @description: Sanitization utilities for user input
 * and data handling to ensure privacy and security in the
 * Mwalika application.
 */

/**
 * Used to scrub sensitive information from
 * user input or other data sources.
 *
 * @param value Input to scrub of
 * sensitive information
 * @returns The sanitized value
 */
export function scrub(value: unknown): unknown {
    if (typeof value !== 'string') {
        return value;
    }

    // Keep this conservative, chat can contain anything.
    const trimmed = value.slice(0, 500);

    // Very light redaction examples.
    return trimmed
        .replace(/\b\d{8,}\b/g, '[redacted-number]')
        .replace(
            /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
            '[redacted-email]',
        );
}
