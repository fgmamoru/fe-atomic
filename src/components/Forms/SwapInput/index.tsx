import clsx from 'clsx';
import styles from './index.module.css';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

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
};

const SwapInputSelector = (props: SwapInputProps) => {
    return <Menu>
        <MenuButton className={styles.SwapInputCryptoLabel}>
            <img className={styles.SwapInputCryptoLabelImg} src={props.cryptoIcon} alt={`${props.cryptoName} logo`} />
            <span>{props.cryptoName}</span>
            <img src="/icons/arrow_down.svg" aria-hidden />
        </MenuButton>
        <MenuItems className={styles.SwapInputCryptoMenu}>
            <MenuItem>
                {({ active }) => (
                    <button
                        className={clsx(styles.SwapInputCryptoMenuItem, active && styles.SwapInputCryptoMenuItemActive)}
                        onClick={() => console.log('ETH')}
                    >
                        {/* <img src="/icons/eth.svg" alt="ETH logo" /> */}
                        <span>ETH</span>
                    </button>
                )}
            </MenuItem>
            <MenuItem>
                {({ active }) => (
                    <button
                        className={clsx(styles.SwapInputCryptoMenuItem, active && styles.SwapInputCryptoMenuItemActive)}
                        onClick={() => console.log('BTC')}
                    >
                        {/* <img src="/icons/btc.svg" alt="BTC logo" /> */}
                        <span>BTC</span>
                    </button>
                )}
            </MenuItem>
        </MenuItems>
    </Menu>
}

export const SwapInput = (props: SwapInputProps) => {
    const inputClass = clsx(
        styles.SwapInputInputWrapper,
        props.disabled && styles.SwapInputInputWrapperDisabled,
        props.error && styles.SwapInputInputWrapperError,
        props.variant === "top" && styles.SwapInputInputWrapperTop,
        props.variant === "bottom" && styles.SwapInputInputWrapperBottom
    );

    const errorClass = clsx(
        styles.SwapInputError,
        props.error && styles.SwapInputErrorVisible
    );

    return <div className={styles.SwapInput}>
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