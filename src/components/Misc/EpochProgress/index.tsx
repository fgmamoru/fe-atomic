import { useEffect, useState } from "react";
import Progress from "../Progress";
import styles from './index.module.css';
import { useModel } from "@/components/Services/Model";

const getFormattedRemainingTime = (endTime: number, currentTime: number) => {
  const remainingTime = endTime - currentTime;
  const remainingHours = Math.floor(remainingTime / 1000 / 60 / 60);
  const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60);

  if (remainingHours > 0) {
    return `${remainingHours}h`;
  }

  if (remainingMinutes > 0) {
    return `${remainingMinutes}m`;
  }

  return `${remainingSeconds}s`;
}

export const RoundProgress = () => {
  const model = useModel();
  const [epochProgress, setEpochProgress] = useState<number>(0);
  const stats = { system: {
    epochStartDateMs: Number(model.times?.currentRoundSince)* 1000,
    epochEndDateMs: Number(model.times?.nextRoundSince)* 1000,
  }}


  const epochStart = stats.system?.epochStartDateMs;
  const epochEnd = stats.system?.epochEndDateMs;
  const formatedRemainingTime = getFormattedRemainingTime(epochEnd, new Date().getTime());

  useEffect(() => {

    const update = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - epochStart;
      const epochDuration = epochEnd - epochStart;
      const epochProgress = epochDuration === 0 ? 0 : (elapsedTime / epochDuration) * 100;
      const remainingTime = epochEnd - currentTime;

      setEpochProgress(parseInt(epochProgress.toFixed(0)));

    }
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);

  }, [epochEnd, epochStart]);


  return (
    <div>
      <Progress value={epochProgress} />
      <div className={styles.EpochProgressStats}>
        <div className={styles.EpochProgressStatsLabel}>Round Progress:</div>
        <div className={styles.EpochProgressStatsValue} >{epochProgress}% ({
          formatedRemainingTime
        } remaining)</div>
      </div>
    </div>
  );
}
export default RoundProgress;