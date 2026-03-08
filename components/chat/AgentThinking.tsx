/**
 * @description: This component renders the "thinking" indicator
 * for the Mwalika chatbot, showing that the agent is processing
 * the user's input.
 */

// React/Next
import { useEffect, useState } from 'react';

// Styles
import styles from '@styles/chat/components/agent-thinking.module.css';

// Context
import { useChat } from '@/context/ChatContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AgentThinking() {
    // - Context -
    const { isAgentThinking, agentThinkingTitles } =
        useChat();
    const { t } = useLanguage();

    // Safe guard: Only render if agent is thinking
    if (!isAgentThinking) return null;

    // - State -
    const [currentTitle, setCurrentTitle] =
        useState<string>('');

    // - Effects -
    // Cycle through thinking titles every 3 seconds
    useEffect(() => {
        if (agentThinkingTitles.length === 0) return;

        let index = 0;
        setCurrentTitle(agentThinkingTitles[index]);

        const interval = setInterval(() => {
            setCurrentTitle((prev) => {
                const currentIndex =
                    agentThinkingTitles.indexOf(prev);
                const nextIndex =
                    (currentIndex + 1) %
                    agentThinkingTitles.length;
                return agentThinkingTitles[nextIndex];
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [agentThinkingTitles]);

    return (
        <div className={styles.container}>
            <span
                className={`text-body-standout ${styles.thinking}`}
            >
                {t('chat.agent_thinking')}
            </span>
            <span className={`text-body ${styles.title}`}>
                {currentTitle}
            </span>
        </div>
    );
}
