/**
 * @description: This file contains mapping functions that convert
 * between different data structures used in the chat
 * application, particularly for agent sessions and
 * streaming interactions.
 */

// Types
import {
    StreamItem,
    NdjsonTypes,
} from '@/types/services/agent/stream.types';
import {
    MemoryContent,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';

export function streamItemToMemoryContent(
    item: StreamItem,
): MemoryContent {
    let contentType: MemoryContentTypes;
    switch (item.type) {
        case NdjsonTypes.TEXT:
            contentType = MemoryContentTypes.TEXT;
            break;
        case NdjsonTypes.IMAGE:
            contentType = MemoryContentTypes.IMAGE;
            break;
        case NdjsonTypes.LINK:
            contentType = MemoryContentTypes.LINK;
            break;
        default:
            contentType = MemoryContentTypes.TEXT;
    }
    return {
        content_id: item.stream_id,
        type: contentType,
        payload: item.payload,
    };
}
