import clsx from 'clsx';
import styles from './index.module.css';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Currency } from '@/types';
import { useModel } from '@/components/Services/Model';

type SwapInputProps = {
    value: string | number;
    onChange?: (value: string) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    label: string;
    endLabel?: React.ReactNode;
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
    selectedCurrency: Currency;

};

const SwapInputSelector = (props: SwapInputProps) => {
    return <button className={styles.SwapInputCurrencyButton}
        disabled={props.selectorDisabled}
        onClick={() => props.onCurrencyClick?.()}
    >
        <img className={styles.SwapInputCryptoLabelImg} src={props?.selectedCurrency?.icon} alt={`${props?.selectedCurrency.symbol} logo`} />
        <span>{props?.selectedCurrency.symbol}</span>
        <img className={styles.InputSelectorArrow} src="/icons/arrow_down.svg" aria-hidden />
    </button>
}

export const SwapInput = (props: SwapInputProps) => {
    const model = useModel();
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
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "inherit" }}>

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
                <span className={styles.SwapInputUsdt}>{
                    model.getInUsd(props.value.toString(), props.selectedCurrency)
                }</span>
            </div>

            <SwapInputSelector {...props} />
        </div>
    </div>
};