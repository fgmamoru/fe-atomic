import { useSwapModel } from '@/state/swap.model'
import styles from './Stars.module.css'
import clsx from 'clsx'


export const Stars = (props: {}) => {
    const model = useSwapModel()
    return (
        <>
            <div className={clsx(styles.stars, model.readyToSwap() ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars2, model.readyToSwap() ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars3, model.readyToSwap() ? styles.active : styles.inactive)} />
        </>
    )
}