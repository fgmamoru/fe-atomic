import styles from './index.module.css';
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { formatCryptoAmountAbbr } from '@/utils';
import { NavbarBadgeCard } from '../NavbarBadgeCard';
import { useModel } from '@/components/Services/Model';
import { messages } from '@/services/i18n';


export const NavbarBalance = () => {
    const model = useModel();
    return (
        <NavbarBadgeCard>
            <div className={styles.NavBarBalanceLogoWrapper}>
                <img src="/icons/ton.svg" aria-hidden />
            </div>
            <div className={styles.NavbarBalanceData}>
                <NavbarBadgeCard.Label>
                    <AnimatedNumber value={model.tonBalanceFormatted()} formatValue={formatCryptoAmountAbbr} duration={300} /> {messages.en.ton}

                </NavbarBadgeCard.Label>

                <NavbarBadgeCard.Value >
                    <AnimatedNumber value={model.tonBalanceInUsd()} formatValue={formatCryptoAmountAbbr} duration={300} /> USDT
                </NavbarBadgeCard.Value >
            </div>
        </NavbarBadgeCard>
    );
};