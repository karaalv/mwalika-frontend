'use server';
/**
 * @description This file contains user feedback related
 * interfaces with the backend API, including functions
 * to submit feedback.
 */
import { httpAgent } from '@services/core/http';

// Types
import { FeedbackSubmission } from '@/types/services/users/feedback';

// Observability
import { captureError } from '@/lib/observability/sentry/server';
import {
    SentryEvent,
    SeverityLevel,
} from '@/types/lib/observability/sentry/core.types';

/**
 * Submits user feedback to the backend API, allowing users
 * to provide insights on their experience with the service.
 * This function sends a POST request to the API with the
 * feedback data and returns a success status.
 *
 */
export async function submitUserFeedback(
    feedbackData: FeedbackSubmission,
    authToken: string,
): Promise<boolean> {
    try {
        const res = await httpAgent<null>(
            '/api/users/feedback',
            'POST',
            true,
            authToken,
            feedbackData,
        );

        // If the response is not successful,
        // log the error
        if (!res || !res.meta.success) {
            const errorEvent: SentryEvent = {
                error: new Error(
                    'Failed to submit user feedback',
                ),
                message: 'User feedback submission failed',
                level: SeverityLevel.ERROR,
                page: '/chat',
                tags: {
                    service: 'user-feedback',
                },
                extras: {
                    feedbackData,
                    response: res,
                },
            };
            captureError(errorEvent);
        }
    } catch (error) {
        const errorEvent: SentryEvent = {
            error:
                error instanceof Error
                    ? error
                    : new Error('Unknown error'),
            message: 'Error submitting user feedback',
            level: SeverityLevel.ERROR,
            page: '/chat',
            tags: {
                service: 'user-feedback',
            },
            extras: {
                feedbackData,
            },
        };
        captureError(errorEvent);
    }

    // The API is designed to always return success
    // even if the feedback submission fails, to avoid
    // disrupting the user experience, so we return true
    // regardless of the actual outcome of the API call.

    return true;
}
