'use client';
/**
 * @description: Chat placeholder component,
 * displayed when the chat area is empty, providing
 * instructions and guidance to users on how to start
 * interacting with the Mwalika chatbot.
 */

// Styles
import styles from '@styles/chat/components/chat-placeholder.module.css';

// Contexts
import { useLanguage } from '@/context/LanguageContext';

export default function ChatPlaceholder() {
    // - Context -
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                <h2 className="text-subsubheading">
                    {t('chat.chat_area.placeholder.title')}
                </h2>
                <p className="text-body-standout">
                    {t(
                        'chat.chat_area.placeholder.description',
                    )}
                </p>
            </div>
        </div>
    );
}
