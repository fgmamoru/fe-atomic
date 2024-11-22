import clsx from 'clsx';
import styles from './index.module.css';


export const AtomicSpeedCardWrapper = (props: { active: boolean, children: React.ReactNode }) => {
    const className = clsx(
        styles.AtomicSpeedCardWrapper,

    );
    return (
        <div className={styles.AtomicSpeedCardWrapper}>
            <span className={styles.AtomicSpeedCardWrapperTitle}>Atomic Speed</span>
            {props.children}
        </div>
    );
};