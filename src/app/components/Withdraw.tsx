import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { create } from 'zustand';
import { DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";

const useSwapModel = create(() => ({
    amount: "0.0",
    setAmount: () => { },
    maxAmountInTon: () => { return "0.0" },
    setAmountToMax: () => { },
    errorMessage: "",
}))

export function DexWithdrawTab() {
    const model = useSwapModel();
    return (
        <>
            <SwapInput
                currencies={new Set()}
                min={0}
                id="stake-amount"
                type="text"
                value={model.amount}
                onChange={model.setAmount}
                inputMode="decimal"
                placeholder={formatCryptoAmount(0.0)}
                label="Withdraw"
                invalid={!!model.errorMessage}
                error={model.errorMessage}
                selectedCurrency={DEFAULT_CURRENCIES_MAP.TON}
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

            <MainButton fullWidth>Connect Wallet</MainButton>
        </>
    )
}