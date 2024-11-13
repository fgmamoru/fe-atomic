import { memo } from "react";
import styles from "./index.module.css";

interface MiniButtonProps {
  onClick?: () => void;
  children: string;
  disabled?: boolean;
}

const MiniButtonComponent = (props: MiniButtonProps) => {
  return <button
    disabled={props.disabled}
    className={styles.MiniButton} 
    onClick={props.onClick}>{props.children}</button>
}

export const MiniButton = memo(MiniButtonComponent);