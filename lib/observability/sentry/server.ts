'use server';
/**
 * @description: This file contains the server-side
 * Sentry client used in server components and API routes
 * to capture errors and send them to Sentry with appropriate
 * tags and extras for better error monitoring and debugging.
 */

import * as Sentry from '@sentry/nextjs';
import { scrub } from '@/lib/privacy/sanitize';

// Types
import {
    SentryEvent,
    SentryTags,
    SentryExtras,
} from '@/types/lib/observability/sentry/core.types';

// --- Constants ---

const APP_NAME = 'mwalika-frontend';

// --- Helper Functions ---

/**
 * Sanitizes Sentry event data to ensure that no
 * sensitive information is sent to Sentry.
 *
 * @param event The Sentry event to sanitize
 * @returns The sanitized Sentry event
 */
function sanitizeTags(
    tags: SentryTags,
): SentryTags | undefined {
    if (!tags) return undefined;
    const sanitizedTags: SentryTags = {};
    for (const key in tags) {
        sanitizedTags[key] =
            typeof tags[key] === 'string'
                ? (scrub(tags[key]) as string)
                : tags[key];
    }
    return sanitizedTags;
}

/**
 * Sanitizes Sentry event data to ensure that no
 * sensitive information is sent to Sentry.
 *
 * @param event The Sentry event to sanitize
 * @returns The sanitized Sentry event
 */
function sanitizeExtras(
    extras: SentryExtras,
): SentryExtras | undefined {
    if (!extras) return undefined;
    const sanitizedExtras: SentryExtras = {};
    for (const key in extras) {
        sanitizedExtras[key] =
            typeof extras[key] === 'string'
                ? (scrub(extras[key]) as string)
                : extras[key];
    }
    return sanitizedExtras;
}

/**
 * Captures an error event and sends it to Sentry with
 * appropriate tags and extras.
 *
 * @param event The Sentry event to capture
 */
export async function captureError(event: SentryEvent) {
    const tags = sanitizeTags(event.tags || {});
    const extras = sanitizeExtras(event.extras || {});

    // Normalise the error
    const error =
        event.error instanceof Error
            ? event.error
            : new Error(
                  typeof event.error === 'string'
                      ? event.error
                      : 'Unknown error',
              );

    Sentry.withScope((scope) => {
        // Set primary tags
        scope.setTag('app', APP_NAME);
        scope.setLevel(event.level);

        // Set tags
        scope.setTag('page', event.page);
        scope.setTag(
            'environment',
            process.env.NODE_ENV || 'unknown',
        );
        scope.setTag(
            'ui_component',
            event.uiComponent || 'unknown',
        );
        if (tags) {
            for (const [k, v] of Object.entries(tags)) {
                scope.setTag(k, v);
            }
        }

        // Set extras
        scope.setExtra(
            'message',
            event.message || 'No message provided',
        );
        if (extras) {
            for (const [k, v] of Object.entries(extras)) {
                scope.setExtra(k, v);
            }
        }
        Sentry.captureException(error);
    });
}
