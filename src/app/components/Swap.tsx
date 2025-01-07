import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useTonConnectModal, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

import { useModel } from "@/components/Services/Model";
import { SwapTokenSelectorModal } from "@/components/Modal/SwapTokenSelectorModal";
import { WaitingTransactionModal } from "@/components/Modal/WaitingTransactionModal";
import { TxSpeed, TxSpeedBadge } from "@/components/Misc/TxSpeedBadge";
import { SwapSpeedModal } from "@/components/Modal/SwapSpeedModal";
import { toast } from "react-toastify";

export function DexSwapTab() {
    const model = useModel();
    const [tonConnectUi] = useTonConnectUI();
    const wallet = useTonWallet();
    wallet?.account.publicKey;
    const buttonTitle = wallet ? 'Swap' : 'Connect Wallet';
    const [fromModalOpen, setFromModalOpen] = useState(false);
    const [toModalOpen, setToModalOpen] = useState(false);
    const [swapSpeedModalOpen, setSwapSpeedModalOpen] = useState(false);
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const { open } = useTonConnectModal();

    useEffect(() => {
        if (!tonConnectUi) return;
        model.init(tonConnectUi);
    }, [tonConnectUi]);
    return (
        <>
            <h2>Swap</h2>
            <div>
                <SwapInput
                    min={0}
                    id="stake-amount"
                    type="text"
                    variant="top"
                    value={model.swapAmount}
                    onChange={model.setSwapAmount}
                    inputMode="decimal"
                    placeholder={"0.0"}
                    label="Sell"
                    cryptoName={model.selectedFromCurrency.symbol}
                    cryptoIcon={model.selectedFromCurrency.icon}
                    invalid={!!model.swapErrorMessage}
                    currencies={model.currencies}
                    onCurrencyClick={() => {
                        setFromModalOpen(true)
                    }}
                    endLabel={<div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <span style={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: "var(--color-text-secondary)",
                        }}>
                            <AnimatedNumber value={model.getMaxAmountOfSelectedCurrency()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={Number(model.getMaxAmountOfSelectedCurrency()) === 0}
                            onClick={() => {
                                model.setSwapAmount(model.getMaxAmountOfSelectedCurrency().toString())
                            }}>Max</MiniButton>
                    </div>}
                />
                <div
                    className={styles.SwapButtonContainer}
                >
                    <div className={styles.SwapButtonWrapper}>
                        <MainButton
                            square
                            variant="secondary"
                            onClick={model.switchCurrencies}
                            className={styles.SwapButton}>
                            <img src="/icons/switch.svg" alt="swap" />
                        </MainButton>
                    </div>
                </div>

                <SwapInput
                    min={0}
                    id="stake-you-receive"
                    value={model.resultSwapAmount}
                    label="Buy"
                    cryptoName={model.selectedToCurrency.symbol}
                    cryptoIcon={model.selectedToCurrency.icon}
                    disabled
                    type="text"
                    currencies={model.currencies}
                    onCurrencyClick={() => setToModalOpen(true)}
                    variant="bottom"
                    placeholder="0.0"
                />
                <TxSpeedBadge
                    speed={TxSpeed.normal}
                    error={model.swapErrorMessage}
                />
            </div>
            <MainButton
                disabled={!model.readyToSwap()}
                onClick={() => {
                    if (!model.isConnected()) return open();
                    // if (model.isSwapFromTonWallet()) return setSwapSpeedModalOpen(true);
                    if (!model._memberRecord?.havePositiveBalances()) return setSwapSpeedModalOpen(true);
                    model.executeSwapOrder();
                }}
                fullWidth
                suppressHydrationWarning
            >{buttonTitle}</MainButton>



            <SwapTokenSelectorModal
                currencies={model.currencies}
                isOpen={fromModalOpen}
                onClose={() => {
                    setFromModalOpen(false)
                }}
                onCurrencyClick={(currency) => {
                    model.setFromCurrency(currency)
                    setFromModalOpen(false)
                }}
            />
            <SwapTokenSelectorModal
                currencies={model.currencies}
                isOpen={toModalOpen}
                onClose={() => {
                    setToModalOpen(false)
                }}
                onCurrencyClick={(currency) => {
                    model.setToCurrency(currency)
                    setToModalOpen(false)
                }}
            />
            <WaitingTransactionModal
                status={model.requestStatus}
                type={model.requestType}
            />
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
        </>
    )
}