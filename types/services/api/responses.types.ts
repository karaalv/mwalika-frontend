/**
 * @description: Type definitions for API responses in
 * the Mwalika application, providing structured types for
 * various API endpoints and their expected response formats.
 */

export interface MetaData {
    request_id: string;
    success: boolean;
    message: string;
    timestamp: string;
}

// --- HTTP Response Types ---

export interface HttpApiResponse<T> {
    data: T;
    meta: MetaData;
}

// --- WebSocket Response Types ---

export enum WebSocketMessageType {
    HEARTBEAT = 'heartbeat',
    AGENT_START = 'agent_start',
    AGENT_END = 'agent_end',
    AGENT_RESPONSE = 'agent_response',
    TOOL_MESSAGE = 'tool_message',
    SET_USER_ID = 'set_user_id',
    SET_SESSION_ID = 'set_session_id',
    WARNING = 'warning',
    ERROR = 'error',
}

export interface WebSocketMessage<T> {
    type: WebSocketMessageType;
    payload: T;
}

export interface WebSocketResponse<T> {
    message: WebSocketMessage<T>;
    meta: MetaData;
}
