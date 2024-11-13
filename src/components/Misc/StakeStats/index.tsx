import { useModel } from '@/components/Services/Model';
import styles from './index.module.css';
import { formatCryptoAmountAbbr } from '@/utils';
import { messages } from '@/services/i18n';
import { ITicket } from '@/types';

const StakeStat = ({ label, value, subLabel, subValue, title }: {
  label: string,
  value: string,
  subLabel?: string,
  subValue?: string | number,
  title?: string
}) => {
  return (
    <div title={title} className={styles.StakeStat}>
      <div className={styles.StakeStatLabel}>{label}</div>
      <div>
        <div className={styles.StakeStatValue}>{value}</div>
        {subLabel && subValue && <div className={styles.StakeStatSubValue}>{subValue} {subLabel}</div>}
      </div>
    </div>
  );

}

export const StakeStats = () => {
  const model = useModel();
  return (
    <div className={styles.StakeStats}>
      <StakeStat
        label={`1 ${messages.en.mevTon}`}
        value={model.exchangeRateFormatted()}
        subLabel="USDT"
        subValue={model.exchangeRateInUsd()} />
      <StakeStat
        label="TVL"
        value={model.currentlyStaked()}
        subLabel="USDT"
        subValue={model.currentlyStakedInUsd()} />

    </div>
  );
}

export const UnStakeStats = () => {
  const model = useModel();
  return (
    <div className={styles.StakeStats}>
      <StakeStat
        label="Current Fee"
        value={model.getUnstakeFeeFormatted()}
        subLabel="USDT"
        subValue={model.getUnstakeFeeFormattedAsUsd()} />
      <StakeStat
        label="Stake Type"
        value="End of round" />
      {/* <StakeStat
        label="Unstake min. amt."
        value={`${formatCryptoAmountAbbr(0)} TON`}
        subLabel="USDT"
        subValue={formatCryptoAmountAbbr(0)} />
      <StakeStat
        label="Max w/o Fee"
        value={`${formatCryptoAmountAbbr(0)} TON`}
        subLabel="USDT"
        subValue={formatCryptoAmountAbbr(0)} />
      <StakeStat
        label="Max instant w/o Fee"
        value={`${formatCryptoAmountAbbr(0)} TON`}
        subLabel="USDT"
        subValue={formatCryptoAmountAbbr(0)} /> */}
    </div>
  );
}

export const UnStakeStats2 = () => {
  return <div className={styles.StakeStats}>
    <StakeStat
      label={`1 ${messages.en.mevTon}`}
      value={`${formatCryptoAmountAbbr(0)} ${messages.en.Ton}`}
      subLabel="USDT"
      subValue={formatCryptoAmountAbbr(0)} />
    <StakeStat
      label="TVL"
      value={`${formatCryptoAmountAbbr(0)} ${messages.en.Ton}`}
      subLabel="USDT"
      subValue={formatCryptoAmountAbbr(0)} />

  </div>
}

export type TicketStatsProps = {
  ticket: ITicket
};

export const TicketStats = (props: TicketStatsProps) => {
  return <div className={styles.StakeStats} >
    <StakeStat
      label={props.ticket.name}
      value={`${formatCryptoAmountAbbr(0)} ${messages.en.Ton}`}
      subLabel="USDT"
      subValue={formatCryptoAmountAbbr(0)} />
    <StakeStat
      label="Unlock Time"
      value={props.ticket.eta}
    />
  </div >
};