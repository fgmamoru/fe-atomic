import styles from './index.module.css';

export const CardSection = (props: { children?: React.ReactNode }) => {
  return (
    <div className={styles.CardSection}>
      {props.children}
    </div>
  )
};