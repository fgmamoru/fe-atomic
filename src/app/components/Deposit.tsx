import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useModel } from "@/components/Services/Model";
import { useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { TxSpeed, TxSpeedBadge } from "@/components/Misc/TxSpeedBadge";

export function DexDepositTab() {
    const model = useModel();
    const wallet = useTonWallet();
    const buttonTitle = wallet ? 'Deposit' : 'Connect Wallet';

    useEffect(() => { model.setActiveTab("deposit") }, []);

    const isDepositButtonEnabled = model.amount && parseFloat(model.amount) && wallet;

    return (
        <>
            <div>
                <SwapInput
                    currencies={new Set()}
                    min={0}
                    id="stake-amount"
                    type="text"
                    value={model.amount}
                    onChange={model.setAmount}
                    inputMode="decimal"
                    placeholder={formatCryptoAmount(0.0)}
                    label="Deposit"
                    cryptoName="Ton"
                    cryptoIcon="/icons/ton.svg"
                    invalid={!!model.errorMessage}
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
                            <AnimatedNumber value={model.maxAmountOfTonBalanceInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={model.maxAmountOfTonBalanceInTon() === 0}
                            onClick={() => model.setAmountToMax()}>Max</MiniButton>
                    </div>}
                />
                <TxSpeedBadge
                    error={model.errorMessage} speed={TxSpeed.normal} />
            </div>
            <MainButton
                disabled={!isDepositButtonEnabled}
                fullWidth
            >{buttonTitle}</MainButton>
        </>
    )
}