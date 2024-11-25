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
import { TokenSelectorModal } from "@/components/Modal/TokenSelectorModal";
import { WaitingTransactionModal } from "@/components/Modal/WaitingTransactionModal";
import { TxSpeed, TxSpeedBadge } from "@/components/Misc/TxSpeedBadge";

export function DexSwapTab() {
    const mainModel = useModel();
    const [tonConnectUi] = useTonConnectUI();
    const wallet = useTonWallet();
    const buttonTitle = wallet ? 'Swap' : 'Connect Wallet';
    const [fromModalOpen, setFromModalOpen] = useState(false);
    const [toModalOpen, setToModalOpen] = useState(false);
    const [waitingTransactionModalOpen, setWaitingTransactionModalOpen] = useState(false);
    const { open } = useTonConnectModal();
    const buttonEnabled = mainModel.readyToSwap() || !mainModel.address;

    useEffect(() => {
        if (!tonConnectUi) return;
        mainModel.init(tonConnectUi);
    }, [tonConnectUi]);
    return (
        <>
            <div>
                <SwapInput
                    min={0}
                    id="stake-amount"
                    type="text"
                    variant="top"
                    value={mainModel.amount}
                    onChange={mainModel.setAmount}
                    inputMode="decimal"
                    placeholder={"0.0"}
                    label="Sell"
                    cryptoName={mainModel.selectedFromCurrency.symbol}
                    cryptoIcon={mainModel.selectedFromCurrency.icon}
                    invalid={!!mainModel.errorMessage}
                    error={mainModel.errorMessage}
                    currencies={mainModel.currencies}
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
                            <AnimatedNumber value={mainModel.maxAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={Number(mainModel.tonBalance) === 0}
                            onClick={() => {
                                mainModel.setAmount(mainModel.maxAmountInTon().toString())
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
                            onClick={mainModel.switchCurrencies}
                            className={styles.SwapButton}>
                            <img src="/icons/switch.svg" alt="swap" />
                        </MainButton>
                    </div>
                </div>

                <SwapInput
                    min={0}
                    id="stake-you-receive"
                    value={mainModel.resultAmount}
                    label="Buy"
                    cryptoName={mainModel.selectedToCurrency.symbol}
                    cryptoIcon={mainModel.selectedToCurrency.icon}
                    disabled
                    type="text"
                    currencies={mainModel.currencies}
                    onCurrencyClick={() => setToModalOpen(true)}
                    variant="bottom"
                    placeholder="0.0"
                />
                <TxSpeedBadge
                    speed={TxSpeed.normal}
                />
            </div>
            <MainButton
                // onClick={model.executeSwapOrder}
                disabled={!buttonEnabled}
                onClick={() => {
                    if (!mainModel.address) {
                        open();
                        return;
                    }

                    setWaitingTransactionModalOpen(true);

                    setTimeout(() => {
                        setWaitingTransactionModalOpen(false);
                        mainModel.setAmount("");
                    }, 7000);
                }}
                fullWidth suppressHydrationWarning>{buttonTitle}</MainButton>

            {/* <pre>
                {JSON.stringify({
                    inited: model.inited,
                    isConnected: model.isConnected(),
                    address: model.address?.toString(),
                    tonBalance: model.tonBalance?.toString(),
                    pools: model.pools,
                }, null, 2)}
            </pre> */}

            <TokenSelectorModal
                currencies={mainModel.currencies}
                isOpen={fromModalOpen}
                onClose={() => {
                    setFromModalOpen(false)
                }}
                onCurrencyClick={(currency) => {
                    mainModel.setFromCurrency(currency)
                    setFromModalOpen(false)
                }}
            />
            <TokenSelectorModal
                currencies={mainModel.currencies}
                isOpen={toModalOpen}
                onClose={() => {
                    setToModalOpen(false)
                }}
                onCurrencyClick={(currency) => {
                    mainModel.setToCurrency(currency)
                    setToModalOpen(false)
                }}
            />
            <WaitingTransactionModal
                isOpen={waitingTransactionModalOpen}
            />
        </>
    )
}