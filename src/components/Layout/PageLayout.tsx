import styles from './PageLayout.module.css';

type PageProps = {
    children: React.ReactNode;
}

export function PageLayout(props: PageProps): JSX.Element {
    return (
        <main className={styles.PageLayout}>
            <div className={styles.PageLayoutContainer}>
                {props.children}
            </div>
        </main>
    );
}

export function PageLayoutNarrow(props: PageProps): JSX.Element {
    return (
        <main className={styles.PageLayoutNarrow}>
            {props.children}
        </main>
    );
}

export function PageWrapper(props: PageProps): JSX.Element {
    return (
        <div className={styles.PageWrapper}>
            {props.children}
        </div>
    );
}