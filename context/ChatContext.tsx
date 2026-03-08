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
import { AgentMemory } from '@/types/services/agent/memory.types';

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
    // Chat sessions
    sessions: AgentSession[];
    setSessions: React.Dispatch<
        React.SetStateAction<AgentSession[]>
    >;
    activeSession: AgentSession | null;
    newSession: () => void;
    setSession: (session: AgentSession) => void;
    // Memories for the active session
    activeMemory: AgentMemory[];
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
    const [sessions, setSessions] = useState<
        AgentSession[]
    >([]);
    const [activeSession, setActiveSession] =
        useState<AgentSession | null>(null);

    // - Session storage state -
    const [sessionStore, setSessionStore] = useState<
        Record<string, AgentMemory[]>
    >({});

    // - Active memories in use -
    const activeMemory = activeSession
        ? sessionStore[activeSession.session_id] || []
        : [];

    // - Callback functions -

    // Clear active session and memories
    // to start a new chat
    const newSession = () => {
        setActiveSession(null);
    };

    const setSession = async (session: AgentSession) => {
        // Check if the session is already active
        if (
            activeSession?.session_id === session.session_id
        ) {
            return;
        }

        // Set active session
        setActiveSession(session);

        // Check if the session is in cache
        if (sessionStore[session.session_id]) {
            return;
        } else {
            // If not in cache, clear memories and load from API
            const fetchedMemories =
                await fetchSessionMemory(
                    session.session_id,
                );
            setSessionStore((prevCache) => ({
                ...prevCache,
                [session.session_id]: fetchedMemories,
            }));
        }
    };

    const value = useMemo(
        () => ({
            isAgentThinking,
            setIsAgentThinking,
            agentThinkingTitles,
            setAgentThinkingTitles,
            sessions,
            setSessions,
            activeSession,
            setSession,
            newSession,
            activeMemory,
        }),
        [
            isAgentThinking,
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
