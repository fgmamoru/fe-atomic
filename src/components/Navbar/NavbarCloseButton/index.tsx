import clsx from 'clsx';
import styles from './NavbarCloseButton.module.css';

export const NavbarCloseButton = (prop: {
    onClick: () => void;
    isClosed: boolean;
}) => {

    const imgClass = clsx(styles.Img, {
        [styles.Closed]: prop.isClosed,
        [styles.Open]: !prop.isClosed,
    });

    return (
        <div
            onClick={prop.onClick}
            className={styles.NavbarCloseButton}>
            <img className={imgClass} src="/icons/collapse.svg" />
        </div>
    );
};