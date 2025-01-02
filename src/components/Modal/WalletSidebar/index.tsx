import styles from "./WalletSidebar.module.css";
import { Sidebar } from "../Sidebar";
import { useTonAddress } from "@tonconnect/ui-react";
import { formatAddress, formatUSD } from "@/utils";
import { IconButton } from "@/components/Button/IconButton";
import { useModel } from "@/components/Services/Model";
import { TokenButton } from "@/components/Button/TokenButton";
import { Currency } from "@/types";

export type WalletSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
}

const WalletSection = (props: { address: string }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className={styles.WalletAvatar}>

                </div>
                <div className={styles.WalletFont}>
                    <p>{formatAddress(props.address)}</p>
                </div>
            </div>

            <IconButton
                alt="Close"
                icon="/icons/logout.svg"
                onClick={() => { }}
            />
        </div>
    )
}


const TotalPortfolioSection = (props: { totalPortfolio: number, changeAmount: number, changePercentage: number }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <data
                className={styles.TotalPortfolio}
                value={props.totalPortfolio}>{formatUSD(props.totalPortfolio)}</data>
            <div className={styles.TotalPortfolioDetails}>
                <data value={props.changeAmount}>${Math.abs(props.changeAmount)}</data>
                <data value={props.changePercentage}>{' '}({props.changePercentage}%)</data>
            </div>
        </div>
    )
}

const DepositedTokensSection = () => {
    const { _memberRecord } = useModel();

    if (!_memberRecord) {
        return (
            <section>

                <h2 className={styles.SectionSubtitle}>Deposited Tokens</h2>

                <div className={styles.DepositedSectionEmpty}>
                    You need to connect your wallet to see deposited tokens.
                </div>
            </section>
        )
    }

    if (!_memberRecord?.havePositiveBalances()) {
        return (
            <section>

                <h2 className={styles.SectionSubtitle}>Deposited Tokens</h2>

                <div className={styles.DepositedSectionEmpty}>
                    Currently you don&apos;t have any tokens deposited.<br />
                    Depositing unlocks high swap speed.
                </div>
            </section>
        )
    }

    return (
        <section>
            <h2 className={styles.SectionSubtitle}>
                <img src="/icons/mini-coins.svg" aria-hidden />

                Deposited Tokens</h2>
            {
                _memberRecord.getPositiveBalances().map(([currency, balance]) => {
                    return (<TokenButton
                        key={currency.id}
                        currency={currency}
                        balance={balance}
                        onClick={() => { }} />)
                })
            }
        </section>
    )
}

const ActionButtonsSection = () => {
    return (
        <section>
            <div className={styles.ActionButtons}>
                <button className={styles.ActionButton}>
                    <img src="/icons/deposit.svg" aria-hidden />
                    Deposit
                </button>
                <button className={styles.ActionButton}>
                    <img src="/icons/withdraw.svg" aria-hidden />
                    Withdraw
                </button>
            </div>
        </section>
    )
}

const TokensInYourWalletSection = () => {
    return (
        <section>
            <h2 className={styles.SectionSubtitle}>
                <img src="/icons/mini-wallet.svg" aria-hidden />
                Tokens in your wallet</h2>
        </section>
    )
}


export const WalletSidebar = ({ isOpen, onClose }: WalletSidebarProps) => {
    const address = useTonAddress();
    return (
        <Sidebar
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideToClose
        >
            <WalletSection address={address} />
            <TotalPortfolioSection
                totalPortfolio={5759}
                changeAmount={1.28}
                changePercentage={2.8}
            />
            <DepositedTokensSection />

            <ActionButtonsSection />
            <TokensInYourWalletSection />
        </Sidebar>
    )
}