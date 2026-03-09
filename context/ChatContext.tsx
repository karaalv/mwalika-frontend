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
import { AgentMemory } from '@/types/services/agent/memory.types';
import { StreamItem } from '@/types/services/agent/stream.types';

// Services
import {
    fetchSessionMemory,
    fetchSessionById,
    fetchSessions,
} from '@/services/agent/sessions';

// Mappers
import { streamItemToMemoryContent } from '@/lib/chat/mappers';

// State helpers
import { applyStreamItemToMemoryContent } from '@/lib/chat/state';

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
    // Chat sessions
    isLoadingSessions: boolean;
    sessions: AgentSession[];
    setSessions: React.Dispatch<
        React.SetStateAction<AgentSession[]>
    >;
    activeSession: AgentSession | null;
    newSession: () => void;
    setSession: (session: AgentSession) => Promise<void>;
    fetchAndSetSessionById: (
        session_id: string,
    ) => Promise<void>;
    // Memories for the active session
    activeMemory: AgentMemory[];
    addAgentStreamItemToMemory: (item: StreamItem) => void;
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
    const { authState } = useAuth();

    // - State management -
    const [isAgentThinking, setIsAgentThinking] =
        useState<boolean>(false);
    const [agentThinkingTitles, setAgentThinkingTitles] =
        useState<string[]>([]);
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

    const setSession = useCallback(
        async (session: AgentSession) => {
            // Check if the session is already active
            if (
                activeSession?.session_id ===
                session.session_id
            ) {
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
        [],
    );

    const fetchAndSetSessionById = useCallback(
        async (session_id: string) => {
            const session =
                await fetchSessionById(session_id);
            if (!session) {
                setUiError({
                    level: 'error',
                    message: 'Failed to load session.',
                });
                return;
            }
            setSession(session);
        },
        [setSession, setUiError],
    );

    // - Chat memory management -

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
            setIsLoadingSessions(true);
            const fetchedSessions = await fetchSessions();
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
            isLoadingSessions,
            sessions,
            setSessions,
            activeSession,
            setSession,
            newSession,
            fetchAndSetSessionById,
            addAgentStreamItemToMemory,
            activeMemory,
        }),
        [
            isAgentThinking,
            agentThinkingTitles,
            isLoadingSessions,
            sessions,
            activeSession,
            activeMemory,
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
