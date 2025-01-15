import styles from "./WalletSidebar.module.css";
import { Sidebar } from "../Sidebar";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { formatAddress, formatUSD } from "@/utils";
import { IconButton } from "@/components/Button/IconButton";
import { useModel } from "@/components/Services/Model";
import { TokenButton } from "@/components/Button/TokenButton";
import { NativeJettonModel } from "@/models/NativeJetton.model";
import { DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";
import { SwapSpeedModal } from "../SwapSpeedModal";
import { useState } from "react";
import { toast } from "react-toastify";

export type WalletSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
}

const WalletSection = (props: { address: string }) => {
    const [tonConnectUi] = useTonConnectUI();
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
                alt="Logout"
                icon="/icons/logout.svg"
                onClick={() => {
                    tonConnectUi.disconnect();
                }}
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
    const { _memberRecord, setDepositModalOpen } = useModel();
    const [swapSpeedModalOpen, setSwapSpeedModalOpen] = useState(false);

    if (!_memberRecord?.havePositiveBalances()) {
        return (
            <section>

                <h2 className={styles.SectionSubtitle}>Deposited Tokens</h2>

                <div className={styles.DepositedSectionEmpty}>
                    Currently you don&apos;t have any tokens deposited.<br />
                    <span
                        onClick={() => setSwapSpeedModalOpen(true)}
                        className={styles.DepositedSectionEmptyLink}>Depositing</span>
                    {' '}unlocks high swap speed.
                </div>
                <SwapSpeedModal
                    isOpen={swapSpeedModalOpen}
                    onDepositClick={() => {
                        setSwapSpeedModalOpen(false)
                        setDepositModalOpen(true)
                    }}
                    onSwapClick={() => {
                        toast.error("Slow Swap is not available yet")
                        // model.executeSwapOrder()
                        // setSwapSpeedModalOpen(false)
                    }}
                />
            </section>
        )
    }

    return (
        <section>
            <h2 className={styles.SectionSubtitle}>
                <img src="/icons/mini-coins.svg" aria-hidden />Deposited Tokens</h2>
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
    const { setDepositModalOpen, tonBalanceInNano } = useModel();


    return (
        <section>
            <div className={styles.ActionButtons}>
                <button
                    className={styles.ActionButton}
                    onClick={() => setDepositModalOpen(true)}
                    disabled={tonBalanceInNano === 0n || !tonBalanceInNano}
                >
                    <img src="/icons/deposit.svg" aria-hidden />
                    Deposit
                </button>
                <button className={styles.ActionButton} disabled>
                    <img src="/icons/withdraw.svg" aria-hidden />
                    Withdraw
                </button>
            </div>
        </section>
    )
}

const TokensInYourWalletSection = () => {
    const { jettons, tonBalanceInNano } = useModel();

    return (
        <section>
            <h2 className={styles.SectionSubtitle}>
                <img src="/icons/mini-wallet.svg" aria-hidden />
                Tokens in your wallet</h2>
            <TokenButton
                key={'ton'}
                currency={DEFAULT_CURRENCIES_MAP.TON}
                balance={tonBalanceInNano}
                onClick={() => { }} />
            {
                jettons.filter((jetton) => jetton.balance).map((jetton: NativeJettonModel) => {
                    return (<TokenButton
                        key={jetton.address}
                        currency={jetton.currency}
                        balance={jetton.balance}
                        onClick={() => { }} />)
                })
            }
        </section>
    )
}


export const WalletSidebar = ({ isOpen, onClose }: WalletSidebarProps) => {
    const address = useTonAddress();
    const { _memberRecord, _exchangeRates } = useModel();
    if (!isOpen) { return null }

    return (
        <Sidebar onClose={onClose} isOpen={isOpen} clickOutsideToClose>
            <WalletSection address={address} />
            <TotalPortfolioSection totalPortfolio={_memberRecord?.getPortfolioValueInUsd(_exchangeRates) || 0} changeAmount={1.28} changePercentage={2.8} />
            <DepositedTokensSection />
            <ActionButtonsSection />
            <TokensInYourWalletSection />
        </Sidebar>
    )
}