import styles from './BundleMessage.module.css';

type BundleMessageProps = {
    children: React.ReactNode;
};

export function BundleMessage(props: BundleMessageProps) {
    return (
        <div className={styles.BundleMessage}>
            <pre>{props.children}</pre>
        </div>
    )
}