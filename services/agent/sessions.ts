'use server';
/**
 * @description: Service functions for managing agent
 * sessions, including creating new sessions and fetching
 * existing sessions for a user.
 */

// Types
import { AgentMemory } from '@/types/services/agent/memory.types';

// - Retrieval functions -

export async function fetchSessionMemory(
    _session_id: string,
): Promise<AgentMemory[]> {
    // TODO: Implement API call to fetch memories for a session
    return [];
}
