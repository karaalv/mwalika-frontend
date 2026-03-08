/**
 * @description: This file defines types
 * and interfaces related to authentication tokens
 * used in the application.
 */

export interface TokenResponse {
    access_token: string;
    expires_at_ms: number;
}
