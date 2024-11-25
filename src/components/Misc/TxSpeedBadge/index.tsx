import clsx from 'clsx';
import styles from './index.module.css';

export enum TxSpeed {
    normal,
    fast,
}

export type TxSpeedBadgeProps = {
    speed: TxSpeed;
}

export const TxSpeedBadge = (props: TxSpeedBadgeProps) => {
    const className = clsx(
        styles.TxSpeedBadge,
        props.speed === TxSpeed.fast && styles.fast,
        props.speed === TxSpeed.normal && styles.normal
    )
    return <div className={className}>
        {props.speed === TxSpeed.fast ? "Increased Transaction Speed" : "Standard Transaction Speed"}
    </div>
};
