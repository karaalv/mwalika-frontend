/**
 * @description Validation functions for chat
 * messages and agent stream items to ensure they
 * meet the desired formats and constraints before being
 * processed or added to memory.
 */

// Types
import { StreamItem } from '@/types/services/agent/stream.types';

export function validateStreamItem(
    data: any,
): StreamItem | null {
    if (
        typeof data !== 'object' ||
        typeof data.type !== 'string' ||
        typeof data.payload !== 'string' ||
        (typeof data.title !== 'string' &&
            data.title !== null) ||
        typeof data.user_id !== 'string' ||
        typeof data.session_id !== 'string' ||
        typeof data.memory_id !== 'string' ||
        typeof data.sequence_number !== 'number' ||
        typeof data.stream_id !== 'string' ||
        typeof data.timestamp !== 'string'
    ) {
        return null;
    }
    return {
        type: data.type,
        payload: data.payload,
        title: data.title,
        user_id: data.user_id,
        session_id: data.session_id,
        memory_id: data.memory_id,
        sequence_number: data.sequence_number,
        stream_id: data.stream_id,
        timestamp: data.timestamp,
    };
}
