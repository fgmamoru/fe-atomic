import { useModel } from '@/components/Services/Model'
import styles from './Stars.module.css'
import clsx from 'clsx'


export const Stars = (props: {}) => {
    const model = useModel()
    const isAtomicSpeedSwap = model.isAtomicSpeedSwap()
    return (
        <>
            <div className={clsx(styles.stars, isAtomicSpeedSwap ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars2, isAtomicSpeedSwap ? styles.active : styles.inactive)} />
            <div className={clsx(styles.stars3, isAtomicSpeedSwap ? styles.active : styles.inactive)} />
        </>
    )
}