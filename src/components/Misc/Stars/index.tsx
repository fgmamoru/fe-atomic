import { useModel } from '@/components/Services/Model'
import styles from './Stars.module.css'
import clsx from 'clsx'


export const Stars = (props: {}) => {
    const model = useModel()
    return (
        <>
            <div className={clsx(styles.stars, model.readyToSwap() ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars2, model.readyToSwap() ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars3, model.readyToSwap() ? styles.active : styles.inactive)} />
        </>
    )
}