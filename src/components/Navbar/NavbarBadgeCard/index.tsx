import styles from './index.module.css';
import { ReactNode } from 'react';


export const NavbarBadgeCard = ({children}:{children: ReactNode}) =>
  <div className={styles.NavbarBadgeCard}>
    {children}
  </div>

const NavbarBadgeCardLabel = ({children}:{children: ReactNode}) =>
  <div className={styles.NavbarBadgeCardLabel}>
    {children}
  </div>

const NavbarBadgeCardValue = ({children}:{children: ReactNode}) => <span className={styles.NavbarBadgeCardValue}>
  {children}
</span>

NavbarBadgeCard.Label = NavbarBadgeCardLabel;
NavbarBadgeCard.Value = NavbarBadgeCardValue;
