'use client';
/**
 * @description: ChatContext used to manage chat-related
 * state and functionality across the Mwalika application,
 * providing a centralized context for chat sessions, interactions,
 * and related data.
 */

// React
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
} from 'react';

// Contexts
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

// Types
import { AgentSession } from '@/types/services/agent/sessions.types';
import {
    AgentMemory,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';
import { StreamItem } from '@/types/services/agent/stream.types';

// Services
import {
    fetchSessionMemory,
    fetchSessionById,
    fetchSessions,
    deleteSessionById,
    updateSessionNameById,
} from '@/services/agent/sessions';

// Mappers
import { streamItemToMemoryContent } from '@/lib/chat/mappers';

// State helpers
import { applyStreamItemToMemoryContent } from '@/lib/chat/state';

// Lib
import { generateUuid } from '@/lib/shared/ids';

// --- Internal types ---

type SessionMemoryState = {
    // Order of memory IDs for display
    memoryOrder: string[];
    // Map of memory ID to memory content
    memoryMap: Record<string, AgentMemory>;
};

// Interface for the context value
interface ChatContextType {
    // Loading state
    isAgentThinking: boolean;
    setIsAgentThinking: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    agentThinkingTitles: string[];
    setAgentThinkingTitles: React.Dispatch<
        React.SetStateAction<string[]>
    >;
    clearThinkingState: () => void;
    // Response state
    isAgentResponding: boolean;
    setIsAgentResponding: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    // Chat sessions
    isLoadingSessions: boolean;
    sessions: AgentSession[];
    setSessions: React.Dispatch<
        React.SetStateAction<AgentSession[]>
    >;
    activeSession: AgentSession | null;
    newSession: () => void;
    setSessionFromSidebar: (
        session: AgentSession,
    ) => Promise<void>;
    fetchAndAddSessionById: (
        session_id: string,
    ) => Promise<void>;
    deleteSession: (session_id: string) => Promise<void>;
    updateSessionName: (
        session_id: string,
        new_name: string,
    ) => Promise<void>;
    // Memories for the active session
    activeMemory: AgentMemory[];
    addAgentStreamItemToMemory: (item: StreamItem) => void;
    addUserMessageToMemory: (
        sessionId: string,
        message: string,
    ) => void;
}

const ChatContext = createContext<
    ChatContextType | undefined
>(undefined);

export default function ChatProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - Context -
    const { setUiError } = useNotification();
    const { authState, getStateAccessToken } = useAuth();

    // - State management -
    const [isAgentThinking, setIsAgentThinking] =
        useState<boolean>(false);
    const [agentThinkingTitles, setAgentThinkingTitles] =
        useState<string[]>([]);
    const [isAgentResponding, setIsAgentResponding] =
        useState<boolean>(false);
    const [isLoadingSessions, setIsLoadingSessions] =
        useState<boolean>(false);
    const [sessions, setSessions] = useState<
        AgentSession[]
    >([]);
    const [activeSession, setActiveSession] =
        useState<AgentSession | null>(null);

    // - Session storage state -
    const [sessionStore, setSessionStore] = useState<
        Record<string, SessionMemoryState>
    >({});

    // -- Callback functions --

    // - Agent thinking state management -

    // Used to clear thinking state when agent starts
    // processing a new message
    const clearThinkingState = useCallback(() => {
        setIsAgentThinking(false);
        setAgentThinkingTitles([]);
    }, []);

    // - Session management -

    // Clear active session and memories
    // to start a new chat
    const newSession = useCallback(() => {
        setActiveSession(null);
    }, []);

    const setSessionFromSidebar = useCallback(
        async (session: AgentSession) => {
            // Check if the session is already active
            if (
                activeSession?.session_id ===
                session.session_id
            ) {
                return;
            }

            const accessToken = getStateAccessToken();
            if (!accessToken) {
                setUiError({
                    level: 'error',
                    message: 'Access token not available.',
                });
                return;
            }

            // Set active session
            setActiveSession(session);

            // Check if the session is in cache
            if (sessionStore[session.session_id]) {
                return;
            } else {
                // If not in cache load from API
                const fetchedMemories =
                    await fetchSessionMemory(
                        session.session_id,
                        accessToken,
                    );

                if (!fetchedMemories) {
                    setUiError({
                        level: 'error',
                        message:
                            'Failed to load session memories.',
                    });
                    return;
                }
                // Get ids in the order they were created for display
                const memoryOrder = fetchedMemories.map(
                    (memory) => memory.memory_id,
                );
                const memoryMap = fetchedMemories.reduce(
                    (acc, memory) => {
                        acc[memory.memory_id] = memory;
                        return acc;
                    },
                    {} as Record<string, AgentMemory>,
                );
                setSessionStore((prevStore) => ({
                    ...prevStore,
                    [session.session_id]: {
                        memoryOrder,
                        memoryMap,
                    },
                }));
            }
        },
        [
            authState,
            activeSession,
            sessionStore,
            setUiError,
        ],
    );

    const fetchAndAddSessionById = useCallback(
        async (sessionId: string) => {
            // Guard against trying to fetch
            // session if not authenticated
            const accessToken = getStateAccessToken();
            if (!accessToken) {
                setUiError({
                    level: 'error',
                    message: 'Access token not available.',
                });
                return;
            }
            const session = await fetchSessionById(
                sessionId,
                accessToken,
            );
            if (!session) {
                setUiError({
                    level: 'error',
                    message: 'Failed to load session.',
                });
                return;
            }

            // Add session to list if not already there
            setSessions((prevSessions) => {
                const exists = prevSessions.some(
                    (s) => s.session_id === sessionId,
                );
                if (exists) {
                    return prevSessions;
                }
                return [...prevSessions, session];
            });

            // Update active session if
            // IDs match
            setActiveSession((prev) =>
                prev?.session_id === sessionId
                    ? session
                    : prev,
            );
        },
        [
            authState,
            activeSession,
            sessionStore,
            setUiError,
        ],
    );

    const deleteSession = useCallback(
        async (sessionId: string) => {
            const accessToken = getStateAccessToken();
            if (!accessToken) {
                setUiError({
                    level: 'error',
                    message: 'Access token not available.',
                });
                return;
            }
            const success = await deleteSessionById(
                sessionId,
                accessToken,
            );
            if (!success) {
                setUiError({
                    level: 'error',
                    message: 'Failed to delete session.',
                });
                return;
            }
            // Remove session from list
            // and store
            setSessions((prevSessions) =>
                prevSessions.filter(
                    (s) => s.session_id !== sessionId,
                ),
            );
            setSessionStore((prevStore) => {
                const newStore = { ...prevStore };
                delete newStore[sessionId];
                return newStore;
            });
            // If the deleted session is the
            // active one, clear active session
            setActiveSession((prev) =>
                prev?.session_id === sessionId
                    ? null
                    : prev,
            );
        },
        [getStateAccessToken, setUiError],
    );

    const updateSessionName = useCallback(
        async (sessionId: string, newName: string) => {
            const accessToken = getStateAccessToken();
            if (!accessToken) {
                setUiError({
                    level: 'error',
                    message: 'Access token not available.',
                });
                return;
            }
            const success = await updateSessionNameById(
                sessionId,
                newName,
                accessToken,
            );
            if (!success) {
                setUiError({
                    level: 'error',
                    message:
                        'Failed to update session name.',
                });
                return;
            }
            // Update session name in list
            setSessions((prevSessions) =>
                prevSessions.map((s) =>
                    s.session_id === sessionId
                        ? { ...s, chat_name: newName }
                        : s,
                ),
            );
            // Update active session if IDs match
            setActiveSession((prev) =>
                prev?.session_id === sessionId
                    ? { ...prev, chat_name: newName }
                    : prev,
            );
        },
        [getStateAccessToken, setUiError],
    );

    // - Chat memory management -

    const addUserMessageToMemory = useCallback(
        (sessionId: string, message: string) => {
            const newMemory: AgentMemory = {
                session_id: sessionId,
                user_id: '',
                sender: 'user',
                memory_id: generateUuid(), // Temp ID
                timestamp: new Date().toISOString(),
                content: [
                    {
                        type: MemoryContentTypes.TEXT,
                        payload: message,
                        content_id: generateUuid(),
                    },
                ],
            };

            setSessionStore((prevStore) => {
                const sessionState = prevStore[
                    sessionId
                ] ?? {
                    memoryOrder: [],
                    memoryMap: {},
                };

                return {
                    ...prevStore,
                    [sessionId]: {
                        memoryOrder: [
                            ...sessionState.memoryOrder,
                            newMemory.memory_id,
                        ],
                        memoryMap: {
                            ...sessionState.memoryMap,
                            [newMemory.memory_id]:
                                newMemory,
                        },
                    },
                };
            });

            // If no active session,
            // set this as temp active session
            // until we get the real session from
            // the server
            if (!activeSession) {
                const t = new Date().toISOString();
                setActiveSession({
                    session_id: sessionId,
                    user_id: '',
                    chat_name: '',
                    created_at: t,
                    last_active_at: t,
                });
            }
        },
        [activeSession, setActiveSession],
    );

    const addAgentStreamItemToMemory = useCallback(
        (item: StreamItem) => {
            setSessionStore((prevStore) => {
                const sessionId = item.session_id;
                const sessionState = prevStore[
                    sessionId
                ] ?? {
                    memoryOrder: [],
                    memoryMap: {},
                };

                const existingMemory =
                    sessionState.memoryMap[item.memory_id];

                if (existingMemory) {
                    // If memory already exists
                    // update the content with
                    // the new stream item
                    const updatedMemory = {
                        ...existingMemory,
                        content:
                            applyStreamItemToMemoryContent(
                                item,
                                existingMemory,
                            ),
                    };

                    return {
                        ...prevStore,
                        [sessionId]: {
                            ...sessionState,
                            memoryMap: {
                                ...sessionState.memoryMap,
                                [item.memory_id]:
                                    updatedMemory,
                            },
                        },
                    };
                } else {
                    // If memory doesn't exist, create a new one
                    const newMemory: AgentMemory = {
                        session_id: item.session_id,
                        user_id: item.user_id,
                        sender: 'agent',
                        memory_id: item.memory_id,
                        timestamp: item.timestamp,
                        content: [
                            streamItemToMemoryContent(item),
                        ],
                    };

                    return {
                        ...prevStore,
                        [sessionId]: {
                            memoryOrder: [
                                ...sessionState.memoryOrder,
                                item.memory_id,
                            ],
                            memoryMap: {
                                ...sessionState.memoryMap,
                                [item.memory_id]: newMemory,
                            },
                        },
                    };
                }
            });
        },
        [],
    );

    // - Effects -
    // On mount, we could load the
    // user's sessions
    useEffect(() => {
        const loadSessions = async () => {
            const accessToken = getStateAccessToken();
            if (!accessToken) {
                // Skip ui error here, since on
                // initial load, we may not
                // have an access token yet
                return;
            }
            setIsLoadingSessions(true);
            const fetchedSessions =
                await fetchSessions(accessToken);
            if (!fetchedSessions) {
                setIsLoadingSessions(false);
                setUiError({
                    level: 'error',
                    message:
                        'Failed to load chat sessions.',
                });
                return;
            }
            setSessions(fetchedSessions);
            setIsLoadingSessions(false);
        };

        if (authState === 'authenticated') {
            loadSessions();
        } else if (authState === 'unauthenticated') {
            setSessions([]);
            setActiveSession(null);
            setSessionStore({});
        }

        return () => {
            // Cleanup if needed when auth state changes
            setSessions([]);
            setActiveSession(null);
            setSessionStore({});
        };
    }, [authState, setUiError]);

    // - Memoized context value -

    // - Active memories in use -
    const activeSessionId =
        activeSession?.session_id ?? null;
    const activeSessionState = activeSessionId
        ? sessionStore[activeSessionId]
        : undefined;

    const activeMemory = useMemo(() => {
        if (!activeSessionState) {
            return [];
        }

        return activeSessionState.memoryOrder.map(
            (memoryId) =>
                activeSessionState.memoryMap[memoryId],
        );
    }, [activeSessionState]);

    const value = useMemo(
        () => ({
            isAgentThinking,
            setIsAgentThinking,
            agentThinkingTitles,
            setAgentThinkingTitles,
            clearThinkingState,
            isAgentResponding,
            setIsAgentResponding,
            isLoadingSessions,
            sessions,
            setSessions,
            activeSession,
            setSessionFromSidebar,
            newSession,
            fetchAndAddSessionById,
            addAgentStreamItemToMemory,
            addUserMessageToMemory,
            deleteSession,
            updateSessionName,
            activeMemory,
        }),
        [
            isAgentThinking,
            agentThinkingTitles,
            isLoadingSessions,
            sessions,
            activeSession,
            activeMemory,
            isAgentResponding,
        ],
    );

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

// Custom hook for consuming the context
export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error(
            'useChat must be used within a ChatProvider',
        );
    }
    return context;
};
