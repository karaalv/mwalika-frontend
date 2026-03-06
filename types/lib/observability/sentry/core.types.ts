/**
 * @description: This file defines types and
 * interfaces related to Sentry integration for
 * error tracking and observability in the Mwalika
 * application.
 */

export enum SeverityLevel {
    FATAL = 'fatal',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    DEBUG = 'debug',
}

export type SentryTags = Record<string, string>;
export type SentryExtras = Record<string, unknown>;

export interface SentryEvent {
    error: unknown;
    page: string;
    level: SeverityLevel;
    uiComponent?: string;
    message?: string;
    tags?: SentryTags;
    extras?: SentryExtras;
}
