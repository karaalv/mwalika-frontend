/**
 * @description: Type definitions for API requests
 * in the Mwalika application, providing structured types for
 * various API endpoints and their expected request formats.
 */

export enum WebsocketRequestType {
    AGENT_INTERACTION = 'agent_interaction',
    HEARTBEAT = 'heartbeat',
}

export interface WebsocketRequest<T> {
    type: WebsocketRequestType;
    payload: T;
}
