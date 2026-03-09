/**
 * @description: This file contains state management logic
 * for the chat application, including functions to manage
 * adding stream items to memory.
 */

// Types
import { StreamItem } from '@/types/services/agent/stream.types';
import {
    MemoryContent,
    AgentMemory,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';

// Mappers
import { streamItemToMemoryContent } from '@/lib/chat/mappers';

export function applyStreamItemToMemoryContent(
    streamItem: StreamItem,
    memory: AgentMemory,
): MemoryContent[] {
    const newContent: MemoryContent =
        streamItemToMemoryContent(streamItem);
    // If content is image or link, add it as a new
    // content item. If it's text, append it to the last
    // text content
    if (
        newContent.type === MemoryContentTypes.IMAGE ||
        newContent.type === MemoryContentTypes.LINK
    ) {
        return [...memory.content, newContent];
    } else {
        // Check the last item in memory content.
        // If it's not text, add the new text content as a
        // new item. If it is text, append to it.
        const lastIndex = memory.content.length - 1;
        const lastContent = memory.content[lastIndex];
        if (
            !lastContent ||
            lastContent.type !== MemoryContentTypes.TEXT
        ) {
            // Last content is not text, add new text content
            return [...memory.content, newContent];
        } else {
            // Update existing text content by appending new text
            const updatedContent = {
                ...lastContent,
                payload:
                    lastContent.payload +
                    newContent.payload,
            };
            return [
                ...memory.content.slice(0, lastIndex),
                updatedContent,
            ];
        }
    }
}
