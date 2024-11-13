import clsx from 'clsx';
import styles from './index.module.css';

type CryptoInputProps = {
    value: string | number;
    onChange?: (value: string) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    label?: string;
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

export const CryptoInput = (props: CryptoInputProps) => {
    const inputClass = clsx(
        styles.CryptoInputInputWrapper,
        props.disabled && styles.CryptoInputInputWrapperDisabled,
        props.error && styles.CryptoInputInputWrapperError,
        props.variant === "top" && styles.CryptoInputInputWrapperTop,
        props.variant === "bottom" && styles.CryptoInputInputWrapperBottom
    );

    const errorClass = clsx(
        styles.CryptoInputError,
        props.error && styles.CryptoInputErrorVisible
    );

    return <div className={styles.CryptoInput}>
        <div className={styles.CryptoInputLabelContainer} style={{ display: props.endLabel || props.label ? "flex" : "none" }}>
            <div className={errorClass}>{props.error}</div>
            {props.label && <label htmlFor={props.id} className={styles.CryptoInputLabel}>{props.label}</label>}
            <span className={styles.CryptoInputLabelEnd}>
                {props.endLabel}
            </span>

        </div>
        <div className={inputClass}>
            <div className={styles.CryptoInputCryptoLabel}>
                <img src={props.cryptoIcon} alt={`${props.cryptoName} logo`} />
                <span>{props.cryptoName}</span>
            </div>
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
                disabled={props.disabled} value={props.value} className={styles.CryptoInputInput} />
            <div>
            </div>
        </div>


    </div>
};