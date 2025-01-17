import clsx from 'clsx';
import styles from './index.module.css';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Currency } from '@/types';

type SwapInputProps = {
    value: string | number;
    onChange?: (value: string) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    label: string;
    endLabel?: React.ReactNode;
    cryptoIcon: string;
    cryptoName: string;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    invalid?: boolean;
    id?: string;
    variant?: "default" | "top" | "bottom";
    type?: "number" | "text";
    min?: number;
    pattern?: string;
    inputMode?: "text" | "decimal" | "numeric" | "search" | "none" | "tel" | "url" | "email" | undefined;
    currencies: Set<Currency>;
    onCurrencyClick?: () => void;
    selectorDisabled?: boolean;
};

const SwapInputSelector = (props: SwapInputProps) => {
    return <button className={styles.SwapInputCurrencyButton}
        disabled={props.selectorDisabled}
        onClick={() => props.onCurrencyClick?.()}
    >
        <img className={styles.SwapInputCryptoLabelImg} src={props.cryptoIcon} alt={`${props.cryptoName} logo`} />
        <span>{props.cryptoName}</span>
        <img className={styles.InputSelectorArrow} src="/icons/arrow_down.svg" aria-hidden />
    </button>
}

export const SwapInput = (props: SwapInputProps) => {
    const rootClass = clsx(
        styles.SwapInput,
        props.variant === "top" && styles.SwapInputInputWrapperTop,
        props.variant === "bottom" && styles.SwapInputInputWrapperBottom,
        props.disabled && styles.SwapInputDisabled
    );
    const inputClass = clsx(
        styles.SwapInputInputWrapper,
        props.disabled && styles.SwapInputInputWrapperDisabled,
        props.error && styles.SwapInputInputWrapperError,

    );

    const errorClass = clsx(
        styles.SwapInputError,
        props.error && styles.SwapInputErrorVisible
    );

    return <div className={rootClass}>
        <div className={styles.SwapInputLabelContainer} style={{ display: props.endLabel || props.label ? "flex" : "none" }}>
            <div className={errorClass}>{props.error}</div>
            {props.label && <label htmlFor={props.id} className={styles.SwapInputLabel}>{props.label}</label>}
            <span className={styles.SwapInputLabelEnd}>
                {props.endLabel}
            </span>

        </div>
        <div className={inputClass}>
            <input
                min={props.min}
                id={props.id}
                name={props.id}
                autoComplete='off'
                placeholder={props.placeholder}
                inputMode={props.inputMode}
                type={props.type || "number"}
                onChange={(e) => props.onChange?.(e.target.value)}
                pattern={props.pattern}
                disabled={props.disabled}
                value={props.value}
                className={styles.SwapInputInput} />
            <SwapInputSelector {...props} />
        </div>
    </div>
};