import { memo } from "react";
import styles from "./index.module.css";

interface MiniButtonProps {
    onClick?: () => void;
    children: string;
    disabled?: boolean;
}

const IconButtonComponent = (props: MiniButtonProps) => {
    return <button
        disabled={props.disabled}
        className={styles.IconButton}
        onClick={props.onClick}>{props.children}</button>
}

export const MiniButton = memo(IconButtonComponent);