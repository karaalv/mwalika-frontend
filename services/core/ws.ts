'use server';
/**
 * @description: This file contains the WebSocket
 * core service logic for the application, note this
 * is not a WebSocket client implementation, but rather
 * a service layer that can be used by WebSocket client
 * implementations to interact with the backend API for
 * WebSocket connections, authentication, and related
 * functionalities.
 */

/**
 * Used to construct the WebSocket URL for
 * connecting to the backend API.
 * @param authToken The authentication token
 * to be used for the WebSocket connection.
 * @returns The WebSocket URL with the
 * authentication token appended as a query parameter.
 */
export async function getSocketUrl(
    authToken: string,
): Promise<string> {
    const agentUrl = process.env.MWALIKA_AGENT_URL;
    if (!agentUrl) {
        throw new Error(
            `Agent URL is not defined in environment variables`,
        );
    }
    // Append the access token as a
    // query parameter for authentication
    return `${agentUrl}/api/agent/ws/chat?access_token=${authToken}`;
}
