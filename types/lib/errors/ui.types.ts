/**
 * @description: This file defines types related to
 * UI errors in the Mwalika application, providing structured
 * types for representing and handling errors that occur in the
 * user interface.
 */

export interface UiError {
    level: 'error' | 'warning';
    message: string;
}
