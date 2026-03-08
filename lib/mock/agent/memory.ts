/**
 * @description: This file provides a mock implementation
 * of agent memory retrieval for testing purposes.
 */

// Types
import {
    AgentMemory,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';

// Test function to generate mock memories for a session
function _mockGetMemory(): AgentMemory[] {
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
        {
            session_id: 'session1',
            user_id: 'user1',
            sender: 'agent',
            memory_id: 'memory3',
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
