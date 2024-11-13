import { memo, ReactNode, useEffect, useState } from "react";
import styles from "./index.module.css";
import clsx from "clsx";
import { useModel } from "@/components/Services/Model";

const ApyBadge = () => {
  const model = useModel();
  return (
    <div className={styles.ApyBadge}>
      <div>{model.apyFormatted()} APY</div>
    </div>
  );
}

const StakeSwitchIndicatorButton = ({ position, height }: { position: 0 | 1, height?: number }) => {
  return (
    <div className={clsx(styles.StakeSwitchIndicator, position === 1 && styles.StakeSwitchIndicatorRight)} style={{ transform: `translateX(${position * 100}%)`, height }} />
  );
}

/**
 * StakeSwitchIndicator is a visual indicator that shows which button is currently selected.
 * it translates to the left or right depending on the button that is selected.
 */
export const StakeSwitchIndicator = memo(StakeSwitchIndicatorButton)


const StakeSwitchButtonComponent = (props: {
  children: ReactNode, onClick: () => void;
  active?: boolean;
  testId?: string;
}) => {
  return (
    <div
      tabIndex={props.active ? -1 : 0}
      data-testid={props.testId}
      onClick={props.onClick}
      onKeyPress={(e) => e.key === "Enter" && props.onClick()}
      className={clsx(styles.StakeSwitchButton, props.active && styles.StakeSwitchButtonActive)}>
      {props.children}
    </div>
  );
}

export const StakeSwitchButton = memo(StakeSwitchButtonComponent);

const StakeSwitchComponent = ({ onChange }: { onChange: (tab: 0 | 1) => void }) => {
  const [position, setPosition] = useState<0 | 1>(0);

  useEffect(() => {
    onChange?.(position);
  }, [position]);

  return (
    <div className={styles.StakeSwitch}>
      <StakeSwitchButton
        testId="stake-switch-button__stake"
        onClick={() => setPosition(0)}
        active={position === 0}
      >Stake <ApyBadge></ApyBadge> </StakeSwitchButton>
      <StakeSwitchButton
        testId="stake-switch-button__unstake"
        active={position === 1}
        onClick={() => { setPosition(1) }}>Unstake</StakeSwitchButton>
      <StakeSwitchIndicator position={position} />
    </div>
  );
}

export const StakeSwitch = memo(StakeSwitchComponent);
