/**
 * @description: Type definitions for sessions
 * in the agent service, outlining the structure of
 * session-related data and responses.
 */

export interface AgentSession {
    session_id: string;
    user_id: string;
    chat_name: string;
    created_at: string;
    last_active_at: string;
}
