/**
 * @description: Type definitions for stream responses
 * in the agent service, detailing the structure of data
 * received during streaming interactions.
 */

export enum NdjsonTypes {
    TEXT = 'text',
    IMAGE = 'image',
    LINK = 'link',
}

export interface StreamItem {
    type: NdjsonTypes;
    payload: string;
    title: string | null;
    user_id: string;
    session_id: string;
    memory_id: string;
    sequence_number: number;
    stream_id: string;
    timestamp: string;
}
