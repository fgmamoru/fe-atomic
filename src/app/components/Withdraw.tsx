import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useState } from "react";
import { TxSpeed, TxSpeedBadge } from "@/components/Misc/TxSpeedBadge";
import { useModel } from "@/components/Services/Model";
import { WithdrawTokenSelectorModal } from "@/components/Modal/WithdrawTokenSelectorModal";
import { useTonWallet } from "@tonconnect/ui-react";


export function DexWithdrawTab() {
    const model = useModel();
    const [isTokenSelectorModalOpen, setIsTokenSelectorModalOpen] = useState(false);
    const wallet = useTonWallet();

    const isWithdrawButtonEnabled = () => {
        return model.withdrawAmount && parseFloat(model.withdrawAmount) && !model.withdrawErrorMessage && wallet;
    };
    const getWithdrawButtonLabel = () => {
        if (!wallet) {
            return "Connect Wallet";
        }
        return "Withdraw";
    }


    return (
        <>
            <div>
                <SwapInput
                    currencies={new Set()}
                    min={0}
                    id="stake-amount"
                    type="text"
                    value={model.withdrawAmount}
                    onChange={model.setWithdrawAmount}
                    inputMode="decimal"
                    placeholder={"0.0"}
                    label="Withdraw"
                    invalid={!!model.withdrawErrorMessage}
                    selectedCurrency={model.selectedWithdrawCurrency}
                    onCurrencyClick={() => setIsTokenSelectorModalOpen(true)}
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
                            <AnimatedNumber value={model.maxWithdrawAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={parseFloat(model.maxWithdrawAmountInTon()) === 0}
                            onClick={() => model.setWithdrawAmountToMax()}>Max</MiniButton>
                    </div>}
                />
                <TxSpeedBadge
                    error={model.withdrawErrorMessage}
                    speed={TxSpeed.normal}
                />
            </div>
            <MainButton
                disabled={!isWithdrawButtonEnabled()}
                onClick={() => {
                    alert('Withdraw button clicked');
                }}
                fullWidth>{getWithdrawButtonLabel()}</MainButton>
            <WithdrawTokenSelectorModal isOpen={isTokenSelectorModalOpen} onClose={
                () => {
                    setIsTokenSelectorModalOpen(false);
                }
            } onCurrencyClick={
                (currency) => {
                    model.setWithdrawCurrency(currency);
                    setIsTokenSelectorModalOpen(false);
                }
            } />
        </>
    )
}