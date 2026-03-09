'use client';
/**
 * @description: WebSocket context used to manage
 * the state of WebSocket connections across the
 * application, providing a centralized context for
 * WebSocket interactions, connection status, and
 * related data.
 */

// React
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef,
} from 'react';

// Contexts
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';

// Services
import { getSocketUrl } from '@/services/core/ws';

// Observability
import { captureError } from '@/lib/observability/sentry/client';

// Types
import {
    WebSocketMessageType,
    WebSocketResponse,
    WebSocketPayloadTypes,
} from '@/types/services/api/responses.types';
import {
    WebSocketRequestType,
    WebSocketRequest,
} from '@/types/services/api/requests.types';
import {
    SentryEvent,
    SeverityLevel,
    SentryExtras,
} from '@/types/lib/observability/sentry/core.types';

// Lib
import { validateStreamItem } from '@/lib/chat/validation';

// --- Constants ---

const HEARTBEAT_INTERVAL_MS = 30000; // 30 seconds

// --- Context interface and types ---

type SocketStatus =
    | 'connected'
    | 'closed'
    | 'connecting'
    | 'error'
    | 'idle';

interface SocketContextType {
    socketStatus: SocketStatus;
    sendMessage: (
        message: WebSocketRequest<string>,
    ) => void;
}

const SocketContext = createContext<
    SocketContextType | undefined
>(undefined);

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - Context -
    const { setUiError } = useNotification();
    const {
        accessToken,
        authState,
        claimUserCookieHandler,
    } = useAuth();
    const {
        clearThinkingState,
        setAgentThinkingTitles,
        fetchAndSetSessionById,
        addAgentStreamItemToMemory,
    } = useChat();

    // - State -
    // Used to track the WebSocket connection
    const wsRef = useRef<WebSocket | null>(null);
    const [socketStatus, setSocketStatus] =
        useState<SocketStatus>('idle');
    const heartbeatIntervalRef = useRef<ReturnType<
        typeof setInterval
    > | null>(null);

    // - Handlers -

    // Abstraction for handling errors and
    // sending them to Sentry and the UI
    const captureSocketError = useCallback(
        (
            sentryMessage: string,
            level: SeverityLevel = SeverityLevel.ERROR,
            error?: Error,
            extras?: SentryExtras,
        ) => {
            const eventError =
                error || new Error(sentryMessage);
            const eventData: SentryEvent = {
                error: eventError,
                page: '/chat',
                message: sentryMessage,
                level: level,
                extras,
            };
            captureError(eventData);
        },
        [],
    );

    const captureErrorSetUi = useCallback(
        (
            sentryMessage: string,
            uiMessage: string,
            level: SeverityLevel = SeverityLevel.ERROR,
            error?: Error,
            extras?: SentryExtras,
        ) => {
            captureSocketError(
                sentryMessage,
                level,
                error,
                extras,
            );
            setUiError({
                level:
                    level === SeverityLevel.ERROR
                        ? 'error'
                        : 'warning',
                message: uiMessage,
            });
        },
        [setUiError, captureSocketError],
    );

    // Heartbeat functionality
    const sendHeartbeat = useCallback(() => {
        if (
            wsRef.current &&
            wsRef.current.readyState === WebSocket.OPEN
        ) {
            const heartbeatMessage: WebSocketRequest<string> =
                {
                    type: WebSocketRequestType.HEARTBEAT,
                    payload: 'Heartbeat pong',
                };
            wsRef.current.send(
                JSON.stringify(heartbeatMessage),
            );
        }
    }, []);

    const clearHeartbeatInterval = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    }, []);

    const startHeartbeat = useCallback(() => {
        clearHeartbeatInterval();
        heartbeatIntervalRef.current = setInterval(
            sendHeartbeat,
            HEARTBEAT_INTERVAL_MS,
        );
    }, [sendHeartbeat, clearHeartbeatInterval]);

    // Function to send messages through the WebSocket
    const sendMessage = useCallback(
        (message: WebSocketRequest<string>) => {
            if (
                wsRef.current &&
                wsRef.current.readyState === WebSocket.OPEN
            ) {
                wsRef.current.send(JSON.stringify(message));
            }
        },
        [],
    );

    // - Handlers for specific incoming message types -

    const handleToolMessage = useCallback(
        (payload: any) => {
            if (
                payload &&
                typeof payload === 'object' &&
                'tool_name' in payload &&
                'titles' in payload
            ) {
                const { tool_name, titles } = payload;
                if (
                    typeof tool_name === 'string' &&
                    Array.isArray(titles) &&
                    titles.every(
                        (title: any) =>
                            typeof title === 'string',
                    )
                ) {
                    setAgentThinkingTitles(titles);
                }
            }
        },
        [setAgentThinkingTitles],
    );

    const handleSetUserId = useCallback(
        async (payload: any) => {
            if (
                payload &&
                typeof payload === 'object' &&
                'user_id' in payload &&
                'claim_token' in payload
            ) {
                const { user_id, claim_token } = payload;
                if (
                    typeof user_id === 'string' &&
                    typeof claim_token === 'string'
                ) {
                    await claimUserCookieHandler(
                        user_id,
                        claim_token,
                        accessToken!,
                    );
                }
            }
        },
        [claimUserCookieHandler, accessToken],
    );

    const handleSetSessionId = useCallback(
        async (payload: any) => {
            if (
                payload &&
                typeof payload === 'object' &&
                'session_id' in payload
            ) {
                const { session_id } = payload;
                if (typeof session_id === 'string') {
                    fetchAndSetSessionById(session_id);
                }
            }
        },
        [fetchAndSetSessionById],
    );

    const handleAgentResponse = useCallback(
        (payload: any) => {
            if (payload && typeof payload === 'object') {
                const item = validateStreamItem(payload);
                if (!item) {
                    captureErrorSetUi(
                        'Invalid agent stream item received',
                        'Received malformed data from server.',
                        SeverityLevel.ERROR,
                        undefined,
                        {
                            payload,
                        },
                    );
                    return;
                }
                addAgentStreamItemToMemory(item);
            }
        },
        [addAgentStreamItemToMemory],
    );

    // - Effects -

    // --- Connection ---
    useEffect(() => {
        // Only attempt to connect if
        // we have an access token and
        // are authenticated
        if (!accessToken || authState !== 'authenticated') {
            return;
        }

        // Only attempt to connect if not
        // already connected
        if (wsRef.current) {
            return;
        }

        let closedByClient = false;

        // Proceed to connect
        (async () => {
            try {
                if (closedByClient) {
                    return;
                }
                const url = await getSocketUrl(accessToken);
                const ws = new WebSocket(url);
                wsRef.current = ws;

                // -- Connection management --

                ws.onopen = () => {
                    if (closedByClient) {
                        ws.close();
                        return;
                    }
                    setSocketStatus('connected');
                    startHeartbeat();
                };

                ws.onerror = (event) => {
                    if (closedByClient) {
                        return;
                    }
                    const uiMessage =
                        'An error occurred with the WebSocket connection.';
                    const sentryMessage =
                        'WebSocket error occurred';
                    captureErrorSetUi(
                        sentryMessage,
                        uiMessage,
                        SeverityLevel.ERROR,
                        undefined,
                        {
                            event: String(event),
                        },
                    );
                    setSocketStatus('error');
                };

                ws.onclose = (event) => {
                    clearHeartbeatInterval();
                    wsRef.current = null;
                    setSocketStatus('closed');

                    if (!event.wasClean) {
                        const sentryMessage = `WebSocket closed 
                            unexpectedly: ${event.reason}`;
                        const uiMessage = `WebSocket connection closed 
                            for the following reason: ${event.reason}`;
                        captureErrorSetUi(
                            sentryMessage,
                            uiMessage,
                            SeverityLevel.WARNING,
                            undefined,
                            {
                                code: event.code,
                                reason: event.reason,
                            },
                        );
                    }
                };

                ws.onmessage = (event) => {
                    try {
                        const data: WebSocketResponse<WebSocketPayloadTypes> =
                            JSON.parse(event.data);

                        switch (data.message.type) {
                            case WebSocketMessageType.HEARTBEAT:
                                // No action needed for heartbeat messages
                                break;
                            case WebSocketMessageType.WARNING:
                                setUiError({
                                    level: 'warning',
                                    message: String(
                                        data.message
                                            .payload,
                                    ),
                                });
                                break;
                            case WebSocketMessageType.ERROR:
                                setUiError({
                                    level: 'error',
                                    message: String(
                                        data.message
                                            .payload,
                                    ),
                                });
                                break;
                            case WebSocketMessageType.AGENT_START:
                                // Clears thinking state to indicate
                                // agent has started processing and
                                // responding to the message
                                clearThinkingState();
                                break;
                            case WebSocketMessageType.AGENT_RESPONSE:
                                // Handles incoming agent responses to update
                                // the chat UI in real-time as the agent
                                // responds
                                handleAgentResponse(
                                    data.message.payload,
                                );
                                break;
                            case WebSocketMessageType.TOOL_MESSAGE:
                                // Handle tool messages to update
                                // agent thinking titles based on the tool
                                handleToolMessage(
                                    data.message.payload,
                                );
                                break;
                            case WebSocketMessageType.SET_USER_ID:
                                // Handle user ID claiming to associate
                                // anonymous sessions with user accounts
                                handleSetUserId(
                                    data.message.payload,
                                );
                                break;
                            case WebSocketMessageType.SET_SESSION_ID:
                                // This session will now be mounted as
                                // the active session in the chat context
                                handleSetSessionId(
                                    data.message.payload,
                                );
                                break;
                            default: {
                                // Log unknown message types for observability
                                const message = `Received unknown WebSocket 
                                    message type: ${data.message.type}`;
                                captureSocketError(
                                    message,
                                    SeverityLevel.WARNING,
                                    undefined,
                                    {
                                        messageType:
                                            data.message
                                                .type,
                                        payload:
                                            data.message
                                                .payload,
                                    },
                                );
                                break;
                            }
                        }
                    } catch (_error) {
                        const sentryMessage = `Failed to parse 
                            WebSocket message: ${event.data}`;
                        const uiMessage =
                            'Received malformed data from server.';
                        captureErrorSetUi(
                            sentryMessage,
                            uiMessage,
                            SeverityLevel.ERROR,
                            _error instanceof Error
                                ? _error
                                : undefined,
                            {
                                rawMessage: event.data,
                            },
                        );
                        setSocketStatus('error');
                    }
                };
            } catch (error) {
                if (closedByClient) {
                    return;
                }
                captureErrorSetUi(
                    'WebSocket connection failed',
                    'Failed to connect to WebSocket.',
                    SeverityLevel.ERROR,
                    error instanceof Error
                        ? error
                        : undefined,
                    {
                        error: String(error),
                    },
                );
                setSocketStatus('error');
            }
        })();

        // Cleanup on unmount
        return () => {
            closedByClient = true;
            clearHeartbeatInterval();
            wsRef.current?.close();
            wsRef.current = null;
            setSocketStatus('idle');
        };
    }, [
        authState,
        startHeartbeat,
        clearHeartbeatInterval,
        captureErrorSetUi,
        captureSocketError,
        setUiError,
    ]);

    // - Memoized context value -
    const value = useMemo(
        () => ({
            socketStatus,
            sendMessage,
        }),
        [socketStatus, sendMessage],
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error(
            'useSocket must be used within a SocketProvider',
        );
    }
    return context;
}
