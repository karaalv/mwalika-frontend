/**
 * @description: This component defines the PurposeItem
 * used in the Purpose section of the landing page.
 */

// Styles
import styles from '@/styles/landing/purpose-item.module.css';

export interface PurposeItemProps {
    title: string;
    description: string;
    url: string;
    backupColor: string;
}

export default function PurposeItem({
    title,
    description,
    url,
    backupColor,
}: PurposeItemProps) {
    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${url})`,
                backgroundColor: backupColor,
            }}
        >
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.descriptionContainer}>
                <span className={styles.description}>
                    {description}
                </span>
            </div>
        </div>
    );
}
