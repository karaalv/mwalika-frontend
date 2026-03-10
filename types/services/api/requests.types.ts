/**
 * @description: Type definitions for API requests
 * in the Mwalika application, providing structured types for
 * various API endpoints and their expected request formats.
 */

export enum WebSocketRequestType {
    AGENT_INTERACTION = 'agent_interaction',
    HEARTBEAT = 'heartbeat',
}

export interface WebSocketRequestPayload {
    session_id: string;
    message: string;
}

export interface WebSocketRequest {
    type: WebSocketRequestType;
    payload: WebSocketRequestPayload;
}
