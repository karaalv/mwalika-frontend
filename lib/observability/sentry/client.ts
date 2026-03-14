'use client';
/**
 * @description: This file contains the sentry client
 * used in client components to capture errors and send them to
 * Sentry with appropriate tags and extras for better error monitoring
 * and debugging.
 */

import * as Sentry from '@sentry/nextjs';
import { scrub, scrubString } from '@/lib/privacy/sanitize';

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
                ? scrub(extras[key])
                : extras[key];
    }
    return sanitizedExtras;
}

// --- Main Client Function ---

/**
 * Captures an error event and sends it to Sentry with
 * appropriate tags and extras.
 *
 * @param event The Sentry event to capture
 */
export function captureError(event: SentryEvent) {
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
            event.message
                ? scrubString(event.message)
                : 'No message provided',
        );
        if (extras) {
            for (const [k, v] of Object.entries(extras)) {
                scope.setExtra(k, v);
            }
        }
        Sentry.captureException(error);
    });
}

// --- Bug Report Function ---

/**
 * Submits a bug report to Sentry
 * using the User Feedback API.
 */
export async function submitBugReport(
    message: string,
    name?: string,
    email?: string,
): Promise<string> {
    return Sentry.sendFeedback(
        {
            message: scrubString(message),
            name,
            email,
            source: 'bug_report_form',
            url: window.location.href,
            tags: {
                channel: 'manual_feedback',
            },
        },
        {
            captureContext: {
                tags: {
                    feature: 'feedback',
                },
            },
        },
    );
}
