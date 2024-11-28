import clsx from 'clsx';
import styles from './index.module.css';
import { memo } from 'react';

export enum TxSpeed {
    normal,
    fast,
}

export type TxSpeedBadgeProps = {
    speed: TxSpeed;
    error?: string;
}

export const TxSpeedBadgeComponent = (props: TxSpeedBadgeProps) => {
    const className = clsx(
        styles.TxSpeedBadge,
        props.speed === TxSpeed.fast && styles.fast,
        props.speed === TxSpeed.normal && styles.normal,
        props.error && styles.error
    )



    return <div className={className}>
        {getMessage(props)}
    </div>
};

export const TxSpeedBadge = memo(TxSpeedBadgeComponent);

function getMessage(props: TxSpeedBadgeProps) {
    if (props.error) {
        return props.error;
    }
    if (props.speed === TxSpeed.fast) {
        return "Increased Transaction Speed";
    } else {
        return "Standard Transaction Speed";
    }
}