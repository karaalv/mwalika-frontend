'use server';
/**
 * @description: Service functions for managing agent
 * sessions, including creating new sessions and fetching
 * existing sessions for a user.
 */

// Core
import { httpAgent } from '@services/core/http';

// Types
import { HttpApiResponse } from '@/types/services/api/responses.types';
import { AgentSession } from '@/types/services/agent/sessions.types';
import { AgentMemory } from '@/types/services/agent/memory.types';

// - Retrieval functions -

/**
 * Fetches the list of agent memories for
 * a given session ID.
 */
export async function fetchSessionMemory(
    sessionId: string,
    authToken: string,
): Promise<AgentMemory[] | null> {
    const res: HttpApiResponse<AgentMemory[] | null> =
        await httpAgent(
            `/api/agent/session/${sessionId}/memory`,
            'GET',
            true,
            authToken,
        );
    if (!res || !res.meta.success || !res.data) {
        return null;
    }
    return res.data;
}

/**
 * Fetches the list of agent sessions for the
 * authenticated user, allowing them to view and manage
 * their active and past sessions.
 */
export async function fetchSessions(
    authToken: string,
): Promise<AgentSession[] | null> {
    const res: HttpApiResponse<AgentSession[] | null> =
        await httpAgent(
            '/api/agent/sessions',
            'GET',
            true,
            authToken,
        );
    if (!res || !res.meta.success || !res.data) {
        return null;
    }
    return res.data;
}

/**
 * Fetches a specific agent session by its ID, allowing
 * users to view the details and history of a particular
 * session.
 */
export async function fetchSessionById(
    sessionId: string,
    authToken: string,
): Promise<AgentSession | null> {
    const res: HttpApiResponse<AgentSession | null> =
        await httpAgent(
            `/api/agent/session/${sessionId}`,
            'GET',
            true,
            authToken,
        );
    if (!res || !res.meta.success || !res.data) {
        return null;
    }
    return res.data;
}

/**
 * Deletes a specific agent session by its ID.
 */
export async function deleteSessionById(
    sessionId: string,
    authToken: string,
): Promise<boolean> {
    const res: HttpApiResponse<null> = await httpAgent(
        `/api/agent/session/${sessionId}`,
        'DELETE',
        true,
        authToken,
    );
    if (!res || !res.meta.success) {
        return false;
    }
    return true;
}

/**
 * Updates the name of a specific
 * agent session by its ID.
 */
export async function updateSessionNameById(
    sessionId: string,
    newName: string,
    authToken: string,
): Promise<boolean> {
    const res: HttpApiResponse<null> = await httpAgent(
        `/api/agent/session/${sessionId}/update-name`,
        'PUT',
        true,
        authToken,
        {
            new_name: newName,
        },
    );
    if (!res || !res.meta.success) {
        return false;
    }
    return true;
}
