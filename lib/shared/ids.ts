/**
 * @description: This file contains logic for managing unique
 * identifiers used across the Mwalika application, such as
 * generating unique IDs for subprocesses.
 */

export function generateUuid() {
    return crypto.randomUUID().replace(/-/g, '');
}
