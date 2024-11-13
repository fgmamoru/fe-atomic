import { memo, useEffect, useState } from "react";
import stakeSwitchStyles from "../StakeSwitch/index.module.css";
import styles from "./index.module.css";
import { StakeSwitchButton, StakeSwitchIndicator } from "../StakeSwitch";
import { UnstakeType } from "@/types";
import clsx from "clsx";

const InstantUnstakeSwitchComponent = ({ onChange }: { onChange: (tab: UnstakeType) => void }) => {
  const [value, setValue] = useState<UnstakeType>('recommended');
  const [position, setPosition] = useState<0 | 1>(0);

  useEffect(() => {
    setPosition(value === 'recommended' ? 0 : 1);
    onChange?.(value);
  }, [value]);

  return (
    <div className={stakeSwitchStyles.StakeSwitch}>

      <StakeSwitchButton
        active={value === 'recommended'}
        onClick={() => { setValue('recommended') }}>
        <div className={clsx(styles.InstantUnstakeSwitchOption, value === 'recommended' && styles.InstantUnstakeSwitchOptionActive)}>
          <div className={styles.OptionLabel}>Best Rate</div>
          <div className={styles.OptionSubLabel}>Get your TON on the next epoch at best rate</div>
        </div>
      </StakeSwitchButton>
      <StakeSwitchButton
        onClick={() => setValue('instant')}
        active={value === 'instant'}
      >
        <div className={clsx(styles.InstantUnstakeSwitchOption, value === 'instant' && styles.InstantUnstakeSwitchOptionActive)}>
          <div className={styles.OptionLabel}>Instant</div>
          <div className={styles.OptionSubLabel}>Get your TON back immediately</div>
        </div>
      </StakeSwitchButton>
      <StakeSwitchIndicator position={position} height={63} />
    </div>
  );
}

export const InstantUnstakeSwitch = memo(InstantUnstakeSwitchComponent);