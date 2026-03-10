'use server';
/**
 * @description: This file contains the authentication
 * logic for the application. Specifically for token
 * generation and validation.
 */
import { SignJWT } from 'jose';

// --- Constants ---

const FRONTEND_ISSUER = 'mwalika-agent-api';
const FRONTEND_EXPIRATION_TIME = '1m';

// --- Functions ---

/**
 * @description: Generates a JWT token for the
 * frontend to communicate securely with the backend.
 */
export async function generateFrontendToken() {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(
        process.env.FRONTEND_SECRET!,
    );
    const timestamp = new Date().toISOString();
    const token = await new SignJWT({
        timestamp,
        typ: 'frontend',
    })
        .setProtectedHeader({
            alg: 'HS256',
            typ: 'JWT',
        })
        .setIssuedAt()
        .setIssuer(FRONTEND_ISSUER)
        .setExpirationTime(FRONTEND_EXPIRATION_TIME)
        .setSubject('frontend-token')
        .sign(secretKey);
    return token;
}
