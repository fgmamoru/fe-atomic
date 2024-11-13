import { formatCryptoAmountAbbr } from '@/utils';
import styles from './index.module.css';
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { H1 } from '@/components/Typography/H1';

export const ChartTitle = (props: {
  children?: React.ReactNode,
  value?: number | string,
  unit?: string,
  align?: 'left' | 'center' | 'right',
  tag?: 'h1' | 'h2',
}) => {
  if (props.tag === 'h2') return (
    <h2 className={styles.ChartTitle}>
      {props.children}
      {' '}
      {props.value !== undefined && <AnimatedNumber value={props.value} formatValue={(value: number | string) => formatCryptoAmountAbbr(value)} />}
      {' '}
      {props.unit && <span className={styles.ChartTitleUnit}>{props.unit}</span>}
    </h2>
  );

  return (
    <H1 className={styles.ChartTitle}>
      {props.children}
      {' '}
      {props.value !== undefined && <AnimatedNumber value={props.value} formatValue={(value: number | string) => formatCryptoAmountAbbr(value)} />}
      {' '}
      {props.unit && <span className={styles.ChartTitleUnit}>{props.unit}</span>}
    </H1>
  )
};