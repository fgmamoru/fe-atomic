import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";
import reactToastify from "react-toastify";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useTonConnectModal, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

import { useModel } from "@/components/Services/Model";
import { TokenSelectorModal } from "@/components/Modal/TokenSelectorModal";
import { useSwapModel } from "@/state/swap.model";
import { WaitingTransactionModal } from "@/components/Modal/WaitingTransactionModal";
import { set } from "lodash";

export function DexSwapTab() {
    const model = useSwapModel();
    const mainModel = useModel();
    const [tonConnectUi] = useTonConnectUI();
    const wallet = useTonWallet();
    const buttonTitle = wallet ? 'Swap' : 'Connect Wallet';
    const [fromModalOpen, setFromModalOpen] = useState(false);
    const [toModalOpen, setToModalOpen] = useState(false);
    const [waitingTransactionModalOpen, setWaitingTransactionModalOpen] = useState(false);
    const { open } = useTonConnectModal();

    useEffect(() => {
        if (!tonConnectUi) return;
        model.init(tonConnectUi);
    }, [tonConnectUi]);
    return (
        <>
            <div>
                <SwapInput
                    min={0}
                    id="stake-amount"
                    type="text"
                    variant="top"
                    value={model.amount}
                    onChange={model.setAmount}
                    inputMode="decimal"
                    placeholder={"0.0"}
                    label="Sell"
                    cryptoName={model.selectedFromCurrency.symbol}
                    cryptoIcon={model.selectedFromCurrency.icon}
                    invalid={!!model.errorMessage}
                    error={model.errorMessage}
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
                            <AnimatedNumber value={mainModel.maxAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={Number(mainModel.tonBalance) === 0}
                            onClick={() => {
                                model.setAmount(mainModel.maxAmountInTon().toString())
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
                    value={model.resultAmount}
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
            </div>
            <MainButton
                // onClick={model.executeSwapOrder}
                disabled={!model.readyToSwap()}
                onClick={() => {
                    if (!mainModel.address) {
                        open();
                        return;
                    }

                    setWaitingTransactionModalOpen(true);

                    setTimeout(() => {
                        setWaitingTransactionModalOpen(false);
                        model.setAmount("");
                    }, 7000);
                }}
                fullWidth>{buttonTitle}</MainButton>

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
            <TokenSelectorModal
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
                isOpen={waitingTransactionModalOpen}
            />
        </>
    )
}