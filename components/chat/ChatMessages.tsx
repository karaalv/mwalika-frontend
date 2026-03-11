/* eslint-disable @next/next/no-img-element */
/**
 * @description: This component renders the messages
 * in the chat area, displaying the conversation between
 * the user and the Mwalika chatbot.
 */

// React/Next
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

// Styles
import styles from '@styles/chat/components/chat-messages.module.css';
import markdownStyles from '@styles/chat/components/markdown-reset.module.css';

// Types
import {
    AgentMemory,
    MemoryContent,
    MemoryContentTypes,
} from '@/types/services/agent/memory.types';

// Component props
interface ChatMessagesProps {
    messages: AgentMemory[];
}

// --- Main component ---

export default function ChatMessages({
    messages,
}: ChatMessagesProps) {
    // - Render -
    const renderMessageContent = (
        content: MemoryContent,
    ) => {
        switch (content.type) {
            case MemoryContentTypes.TEXT:
                return (
                    <TextContent text={content.payload} />
                );
            case MemoryContentTypes.IMAGE:
                return (
                    <ImageContent
                        url={content.payload}
                        title={content.title}
                    />
                );
            case MemoryContentTypes.LINK:
                return (
                    <LinkContent
                        url={content.payload}
                        title={content.title}
                    />
                );
            default:
                return null;
        }
    };

    const renderMessage = (memory: AgentMemory) => {
        return (
            <div
                key={memory.memory_id}
                className={`
                    ${styles.message}
                    ${
                        memory.sender === 'user'
                            ? styles.userMessage
                            : styles.agentMessage
                    }
                `}
            >
                {memory.content.map((content, index) => (
                    <div
                        key={index}
                        className={styles.messageContent}
                    >
                        {renderMessageContent(content)}
                    </div>
                ))}
            </div>
        );
    };
    return (
        <div className={styles.container}>
            {messages.map(renderMessage)}
        </div>
    );
}

// --- Sub components ---

function TextContent({ text }: { text: string }) {
    return (
        <div
            className={`text-body ${markdownStyles.markdown}`}
        >
            <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );
}

function ImageContent({
    url,
    title,
}: {
    url: string;
    title: string | null;
}) {
    return (
        <div className={styles.imageWrapper}>
            <img
                src={url}
                alt={title || ''}
                width={100}
                height={100}
                loading="lazy"
                className={styles.imageContent}
            />
        </div>
    );
}

function LinkContent({
    url,
    title,
}: {
    url: string;
    title: string | null;
}) {
    // - Helper functions -

    const urlTitle = (url: string) => {
        // If title is provided, use it
        if (title) {
            return title;
        }

        // Fallback to domain name extraction
        try {
            const { hostname } = new URL(url);

            const domain = hostname
                .replace(/^www\./, '')
                .split('.')[0];

            return (
                domain.charAt(0).toUpperCase() +
                domain.slice(1)
            );
        } catch {
            return url.split('.')[0] || '';
        }
    };

    const linkImageSrc = (url: string) => {
        if (url.toLocaleLowerCase().includes('ecitizen')) {
            return '/assets/ecitizen-logo.png';
        }
        return '/assets/ken-coa.png';
    };

    return (
        <Link
            className={`
                text-body
                ${styles.linkContainer}
            `}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
            <Image
                src={linkImageSrc(url)}
                alt={`${urlTitle(url)} Logo`}
                width={80}
                height={80}
                className={styles.linkImage}
            />
            <div className={styles.linkTitleContainer}>
                <span className={styles.linkTitle}>
                    {urlTitle(url)}
                </span>
                {url}
            </div>
        </Link>
    );
}
