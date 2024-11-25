import clsx from 'clsx';
import styles from './index.module.css';
import { FunctionComponent } from 'react';
import React from 'react';

export const MainButton = (props: {
    children: React.ReactNode,
    loading?: boolean,
    disabled?: boolean,
    onClick?: () => void
    fullWidth?: boolean
    variant?: 'primary' | 'secondary'
    square?: boolean;
    component?: FunctionComponent<any>;
    debug?: boolean;
    testId?: string;
    className?: string;
    suppressHydrationWarning?: boolean;
}) => {
    const classes = clsx(styles.MainButton, props.className, {
        [styles.MainButtonFullWidth]: props.fullWidth,
        [styles.MainButtonSecondary]: props.variant === 'secondary',
        [styles.MainButtonDebug]: props.debug,
        [styles.MainButtonSquare]: props.square,
        [styles.MainButtonDisabled]: props.disabled
    });

    if (props.component) {
        const { component, square, ...rest } = props;
        return React.createElement(props.component, {
            ...rest,
            className: classes,
        });

    }

    if (props.loading) return (
        <button
            data-testid={props.testId}
            className={classes}
            disabled
            onClick={props.onClick}
        >
            <img className={styles.MainButtonLoader} src="/icons/loader.svg" alt="loading" />
        </button>
    );

    return <button
        suppressHydrationWarning={props.suppressHydrationWarning}
        data-testid={props.testId}
        onClick={props.onClick}
        disabled={props.disabled}
        className={classes}>
        {props.children}
    </button>;
};