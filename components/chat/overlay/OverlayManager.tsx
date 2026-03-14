/**
 * @description: This component manages the display
 * of overlays in the chat interface, such as modals for
 * bug reporting, session details, and other interactive
 * elements that appear on top of the main chat content.
 */

// React

// Context
import {
    useOverlay,
    OverlayType,
} from '@/context/OverlayContext';

// Styles
import styles from '@styles/chat/overlay/overlay-manager.module.css';

// Components
import BugReport from '@components/chat/overlay/BugReport';

export default function OverlayManager() {
    // - Context -
    const { currentOverlay } = useOverlay();

    // - Render -
    const renderOverlay = () => {
        switch (currentOverlay) {
            case OverlayType.BUG_REPORT:
                return <BugReport />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            {renderOverlay()}
        </div>
    );
}
