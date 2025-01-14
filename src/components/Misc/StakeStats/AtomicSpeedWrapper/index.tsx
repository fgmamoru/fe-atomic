import clsx from 'clsx';
import styles from './index.module.css';

export const AtomicSpeedCardWrapper = (props: { active: boolean, children: React.ReactNode }) => {
    const className = clsx(
        styles.AtomicSpeedCardWrapper,
        props.active && styles.AtomicSpeedCardWrapperActive,
        !props.active && styles.AtomicSpeedCardWrapperInactive
    );
    return (
        <div className={className}>
            <span className={styles.AtomicSpeedCardWrapperTitle}>Atomic Speed</span>
            {props.children}
        </div>
    );
};