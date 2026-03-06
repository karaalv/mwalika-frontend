'use client';
/**
 * @description: This file defines the global error
 * boundary for the Mwalika application. It captures any
 * unhandled errors that occur in the application and sends
 * them to Sentry for monitoring and debugging.
 */
import NextError from 'next/error';
import { useEffect } from 'react';

// Observability
import { captureError } from '@/lib/observability/sentry/client';
import {
    SentryEvent,
    SeverityLevel,
} from '@/types/lib/observability/sentry/core.types';

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string };
}) {
    useEffect(() => {
        const event: SentryEvent = {
            error: error,
            level: SeverityLevel.ERROR,
            page: 'unknown',
        };
        captureError(event);
    }, [error]);

    // TODO: Implement a custom error page with better UX and design.

    return (
        <html lang="en">
            <body>
                {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
                <NextError statusCode={0} />
            </body>
        </html>
    );
}
