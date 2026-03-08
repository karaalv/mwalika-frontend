/**
 * @description: Error modal component for displaying
 * UI errors in the chat interface, providing users
 * with clear feedback when something goes wrong.
 */

// Icons
import { X } from 'lucide-react';

// Styles
import styles from '@styles/chat/components/error-modal.module.css';

// Context
import { useChat } from '@/context/ChatContext';

export default function ErrorModal() {
    // - Context -
    const { uiError, setUiError } = useChat();
    if (!uiError) return null;

    // - State -
    const statusColor =
        uiError.level === 'error'
            ? 'var(--color-error)'
            : 'var(--color-warning)';
    return (
        <div
            className={styles.overlay}
            style={{
                borderLeft: `5px solid ${statusColor}`,
            }}
        >
            <div
                className={styles.iconContainer}
                onClick={() => setUiError(null)}
            >
                <X className={styles.icon} />
            </div>
            <div className={styles.scrollContent}>
                <p className="text-body">
                    {uiError.message}
                </p>
            </div>
        </div>
    );
}
