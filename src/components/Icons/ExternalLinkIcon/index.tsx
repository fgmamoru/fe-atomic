import Icon from '@mdi/react';
import { mdiOpenInNew } from '@mdi/js';
import styles from './index.module.css';

export const ExternalLinkIcon = () => {
    return (
        <span className={styles.ExternalLinkIcon}>
            <Icon path={mdiOpenInNew}
                title="External Link"
                size={0.6}
                color="var(--color-secondary-btn-text)"
            />
        </span>
    )
}