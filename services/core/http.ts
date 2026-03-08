'use server';
/**
 * @description: This file contains the HTTP
 * abstraction layer for the Mwalika application, providing
 * functions to interact with the backend API for HTTP requests.
 */
// Next
import { cookies } from 'next/headers';

// Observability
import { captureError } from '@/lib/observability/sentry/client';

// Types
import { HttpApiResponse } from '@/types/services/api/responses.types';
import {
    SentryEvent,
    SeverityLevel,
} from '@/types/lib/observability/sentry/core.types';

// --- HTTP Client ---

/**
 * Abstraction function for performing
 * HTTP requests to the Mwalika backend API, handling
 * authentication, error handling, and response parsing.
 *
 * @template T The expected type of the response data
 * @param endpoint The API endpoint to call (e.g., '/agents')
 * @param method The HTTP method to use (e.g., 'GET', 'POST')
 * @param authToken Optional authentication token for protected endpoints
 * @param data Optional request body for POST/PUT requests
 * @returns A promise that resolves to the API response data
 */
export async function httpAgent<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    authToken?: string,
    data?: unknown,
): Promise<HttpApiResponse<T | null>> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
        const cookieStore = await cookies();
        // TODO: Handle token retrieval

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
                cookie: cookieStore.toString(),
            },
            credentials: 'include',
        };

        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        // Throw an error if
        // the response is empty
        if (!response) {
            throw new Error(
                `No response from server for ${endpoint}`,
            );
        }

        // Return the JSON response
        const jsonResponse = await response.json();
        return jsonResponse as HttpApiResponse<T>;
    } catch (error) {
        const sentryEvent: SentryEvent = {
            error: error,
            page: 'HTTP Client',
            level: SeverityLevel.ERROR,
            message: `Failed to fetch ${endpoint}`,
            tags: {
                endpoint,
                method,
            },
            extras: {
                data,
            },
        };
        captureError(sentryEvent);
        const errRes: HttpApiResponse<null> = {
            data: null,
            meta: {
                request_id: '',
                success: false,
                message: (error as Error).message,
                timestamp: new Date().toISOString(),
            },
        };
        return errRes;
    }
}
