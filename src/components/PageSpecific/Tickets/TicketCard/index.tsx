import { MainButton } from "@/components/Button/MainButton";
import styles from "./index.module.css";
import { CardSection } from "@/components/Card";
import { Card } from "@/components/Card/Card";
import { Divider } from "@/components/Misc/Divider";
import RoundProgress from "@/components/Misc/EpochProgress";
import { ITicket } from "@/types";
import { TicketStats } from "@/components/Misc/StakeStats";


export type TicketCardProps = {
  ticket: ITicket,
  onUnstakeClick: (ticket: any) => void;
}

export const UnstakeTicketStats = (props: { ticket: ITicket }) => {
  return (
    <div className={styles.UnstakeTicketStats}>
      <div className={styles.UnstakeTicketStatsTitle}>
        {props.ticket?.name}
      </div>
    </div>
  );
}

export const TicketCard = (props: TicketCardProps) => {
  return (
    <Card className={styles.TicketCard}>
      <CardSection>
        <TicketStats ticket={props.ticket} />
        {
          props.ticket?.unlocked ? (
            <MainButton
              onClick={() => props.onUnstakeClick?.(props.ticket)}
            >Withdraw</MainButton>
          ) : (
            <RoundProgress />
          )
        }
      </CardSection>

    </Card>
  );
}