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
} from 'react';

// Types
import { AgentSession } from '@/types/services/agent/sessions.types';
import {
    AgentMemory,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';
import { UiError } from '@/types/lib/errors/ui.types';

// Services
import { fetchSessionMemory } from '@/services/agent/sessions';

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
    // Error state
    uiError: UiError | null;
    setUiError: React.Dispatch<
        React.SetStateAction<UiError | null>
    >;
    // Chat sessions
    sessions: AgentSession[];
    setSessions: React.Dispatch<
        React.SetStateAction<AgentSession[]>
    >;
    activeSession: AgentSession | null;
    newSession: () => void;
    setSession: (session: AgentSession) => void;
    // Memories for the active session
    memories: AgentMemory[];
    setMemories: React.Dispatch<
        React.SetStateAction<AgentMemory[]>
    >;
}

const ChatContext = createContext<
    ChatContextType | undefined
>(undefined);

export default function ChatProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // - State management -
    const [isAgentThinking, setIsAgentThinking] =
        useState<boolean>(false);
    const [agentThinkingTitles, setAgentThinkingTitles] =
        useState<string[]>([]);
    const [uiError, setUiError] = useState<UiError | null>(
        null,
    );
    const [sessions, setSessions] = useState<
        AgentSession[]
    >([]);
    const [activeSession, setActiveSession] =
        useState<AgentSession | null>(null);
    const [memories, setMemories] = useState<AgentMemory[]>(
        _fetchTestMemory(),
    );

    // - Cache state -
    const [sessionCache, setSessionCache] = useState<
        Record<string, AgentMemory[]>
    >({});

    // - Callback functions -

    // Clear active session and memories
    // to start a new chat
    const newSession = () => {
        setActiveSession(null);
        setMemories([]);
    };

    const setSession = async (session: AgentSession) => {
        // Check if the session is already active
        if (
            activeSession?.session_id === session.session_id
        ) {
            return;
        }

        // Check if the session is in cache
        if (sessionCache[session.session_id]) {
            setMemories(sessionCache[session.session_id]);
        } else {
            // If not in cache, clear memories and load from API
            setMemories([]);
            const fetchedMemories =
                await fetchSessionMemory(
                    session.session_id,
                );
            setMemories(fetchedMemories);
            setSessionCache((prevCache) => ({
                ...prevCache,
                [session.session_id]: fetchedMemories,
            }));
        }
        setActiveSession(session);
    };

    const value = useMemo(
        () => ({
            isAgentThinking,
            setIsAgentThinking,
            agentThinkingTitles,
            setAgentThinkingTitles,
            uiError,
            setUiError,
            sessions,
            setSessions,
            activeSession,
            setSession,
            newSession,
            memories,
            setMemories,
        }),
        [
            isAgentThinking,
            uiError,
            sessions,
            activeSession,
            memories,
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

function _fetchTestMemory(): AgentMemory[] {
    return [
        {
            session_id: 'session1',
            user_id: 'user1',
            sender: 'user',
            memory_id: 'memory1',
            timestamp: new Date().toISOString(),
            content: [
                {
                    type: MemoryContentTypes.TEXT,
                    payload: 'Hello, how are you?',
                },
            ],
        },
        {
            session_id: 'session1',
            user_id: 'user1',
            sender: 'agent',
            memory_id: 'memory2',
            timestamp: new Date().toISOString(),
            content: [
                {
                    type: MemoryContentTypes.TEXT,
                    payload:
                        "I'm good, thank you! How can I assist you today?",
                },
                {
                    type: MemoryContentTypes.LINK,
                    payload:
                        'https://react.dev/reference/react/useContext/ecitizen',
                },
                {
                    type: MemoryContentTypes.IMAGE,
                    payload:
                        'https://demoadmin.ecitizen.pesaflow.com/assets/uploads/Agricultural-Development-Corporation-log.png',
                },
            ],
        },
    ];
}
