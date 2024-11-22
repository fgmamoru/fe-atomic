import { memo } from "react";
import styles from "./index.module.css";

interface MiniButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    icon: string;
    alt: string;
    ariaHidden?: boolean;
}

const IconButtonComponent = (props: MiniButtonProps) => {
    return <button
        disabled={props.disabled}
        className={styles.IconButton}
        onClick={props.onClick}>
        <img src={props.icon} alt={props.alt} />
    </button>
}

export const IconButton = memo(IconButtonComponent);