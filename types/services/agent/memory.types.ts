/**
 * @description: This file defines types related to
 * the memory component of the agent service.
 */

export enum MemoryContentTypes {
    TEXT = 'text',
    IMAGE = 'image',
    LINK = 'link',
}

export interface MemoryContent {
    type: MemoryContentTypes;
    payload: string;
}

export interface AgentMemory {
    session_id: string;
    user_id: string;
    sender: 'user' | 'agent';
    memory_id: string;
    timestamp: string;
    content: MemoryContent[];
}
