import clsx from 'clsx';
import styles from './index.module.css';

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
            <div className={styles.SwapInputCryptoLabel}>
                <img src={props.cryptoIcon} alt={`${props.cryptoName} logo`} />
                <span>{props.cryptoName}</span>
            </div>
            <div>
            </div>
        </div>


    </div>
};