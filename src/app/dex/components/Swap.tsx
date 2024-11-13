import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { create } from 'zustand';

const useSwapModel = create(() => ({
    amount: "0.0",
    setAmount: () => { },
    maxAmountInTon: () => { return "0.0" },
    setAmountToMax: () => { },
    errorMessage: "",
    selectedFromCurrency: {
        symbol: "TON",
        icon: "/icons/ton.svg",
    },
    selectedToCurrency: {
        symbol: "MevTon",
        icon: "/icons/mevton.svg",
    },
}))


export function DexSwapTab() {
    const model = useSwapModel();
    return (
        <>
            <SwapInput
                min={0}
                id="stake-amount"
                type="text"
                value={model.amount}
                onChange={model.setAmount}
                inputMode="decimal"
                placeholder={formatCryptoAmount(0.0)}
                label="Sell"
                cryptoName="Ton"
                cryptoIcon="/icons/ton.svg"
                invalid={!!model.errorMessage}
                error={model.errorMessage}
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
                        <AnimatedNumber value={model.maxAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                    <MiniButton
                        disabled={parseFloat(model.maxAmountInTon()) === 0}
                        onClick={() => model.setAmountToMax()}>Max</MiniButton>
                </div>}
            />
            <div
                className={styles.SwapButtonContainer}
            >
                <div className={styles.SwapButtonWrapper}>
                    <MainButton square variant="secondary" className={styles.SwapButton}>
                        <img src="/icons/switch.svg" alt="swap" />
                    </MainButton>
                </div>
            </div>

            <SwapInput
                min={0}
                id="stake-you-receive"
                value={model.maxAmountInTon()}
                label="Buy"
                cryptoName="MevTon"
                cryptoIcon="/icons/mevton.svg"
                disabled
                type="text"
            />
            <MainButton fullWidth>Connect Wallet</MainButton>
        </>
    )
}