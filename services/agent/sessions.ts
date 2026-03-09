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
    session_id: string,
): Promise<AgentMemory[] | null> {
    const res: HttpApiResponse<AgentMemory[] | null> =
        await httpAgent(
            `/api/agent/session/${session_id}/memory`,
            'GET',
            true,
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
export async function fetchSessions(): Promise<
    AgentSession[] | null
> {
    const res: HttpApiResponse<AgentSession[] | null> =
        await httpAgent('/api/agent/sessions', 'GET', true);
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
    session_id: string,
): Promise<AgentSession | null> {
    const res: HttpApiResponse<AgentSession | null> =
        await httpAgent(
            `/api/agent/session/${session_id}`,
            'GET',
            true,
        );
    if (!res || !res.meta.success || !res.data) {
        return null;
    }
    return res.data;
}
