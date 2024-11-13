'use client'
import styles from './index.module.css'
import { CardSection } from '@/components/Card';
import { Card } from '@/components/Card/Card';
import { Loader } from '@/components/Misc/Loader';
import { useModel } from '@/components/Services/Model';
import { TicketCard } from '../TicketCard';
import { ITicket } from '@/types';
import Link from 'next/link';

export const TicketList: React.FC = () => {
  const model = useModel();

  // const tickets: ITicket[] = [
  //   ...model.stakingInProgressDetails() || [],
  //   ...model.unstakingInProgressDetails() || []
  // ];

  const tickets: ITicket[] = [
    {
      name: 'Stake Request',
      unlocked: false,
      formattedAmount: '1n TON',
      amount: 1,
      eta: 'Available',
      // amount: formatNano(value) + ' TON',
      // estimated: until === 0n ? undefined : formatDate(new Date((Number(until) + 5 * 60) * 1000)),
    }
  ];

  if (!model.inited) {
    return <Card>
      <CardSection>
        <p className={styles.TicketListEmptyText}>
          <Loader />
        </p>
      </CardSection>
    </Card>
  }

  if (!model.address) {
    return (
      <Card>
        <CardSection>
          <p className={styles.TicketListEmptyText}>Please connect your wallet to see your Stake Or Unstake request</p>
        </CardSection>
      </Card>
    )
  }

  if (!tickets?.length) {
    return <Card >
      <CardSection>
        <p className={styles.TicketListEmptyText}>
          You don&apos;t have any ongoing staking or unstaking operations at the moment.
        </p>
        <p className={styles.TicketListLink}><Link href="/">Go Back</Link></p>
      </CardSection>
    </Card>;
  }

  return (
    <div className={styles.TicketList}>
      {tickets.map((ticket, index) => (
        <TicketCard key={index} ticket={ticket} onUnstakeClick={() => { }} />
      ))}
    </div>
  );
}