import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useModel } from "@/components/Services/Model";
import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { TxSpeed, TxSpeedBadge } from "@/components/Misc/TxSpeedBadge";
import { DepositTokenSelectorModal } from "@/components/Modal/DepositTokenSelectorModal";

type DexDepositTabProps = {
    onDepositSuccess: () => void;
    onDepositFailed: () => void;
}


function isDepositAmountButtonEnabled(depositAmount: string, wallet: any, errorMessage: string | null) {
    return depositAmount && parseFloat(depositAmount) && wallet && !errorMessage;
}

export function DexDepositTab(props: DexDepositTabProps) {
    const model = useModel();
    const wallet = useTonWallet();
    const buttonTitle = wallet ? 'Deposit' : 'Connect Wallet';
    const [isTokenSelectorModalOpen, setIsTokenSelectorModalOpen] = useState(false);

    const depositEnabled = isDepositAmountButtonEnabled(model.depositAmount, wallet, model.depositErrorMessage);
    const selectorDisabled = model.isOnlyNativeTonJettonAvailable();

    return (
        <>
            <div>
                <SwapInput
                    currencies={new Set()}
                    min={0}
                    id="stake-amount"
                    type="text"
                    value={model.depositAmount}
                    onChange={model.setDepositAmount}
                    inputMode="decimal"
                    placeholder={"0.0"}
                    label="Deposit"
                    cryptoName={model.selectedDepositCurrency?.symbol}
                    cryptoIcon={model.selectedDepositCurrency?.icon}
                    invalid={!!model.depositErrorMessage}
                    selectorDisabled={selectorDisabled}
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
                            <AnimatedNumber value={model.maxDepositAmount()} formatValue={formatCryptoAmount} duration={300} /></span>
                        <MiniButton
                            disabled={parseInt(model.maxDepositAmount()) === 0}
                            onClick={() => model.setDepositAmountToMax()}>Max</MiniButton>
                    </div>}
                />
                <TxSpeedBadge
                    error={model.depositErrorMessage} speed={TxSpeed.normal} />
            </div>
            <MainButton
                disabled={!depositEnabled}
                fullWidth
                onClick={() => {
                    if (!depositEnabled) return;
                    if (model.depositAmount && parseFloat(model.depositAmount)) {
                        model.executeDeposit().then(() => {
                            props.onDepositSuccess();
                        }).catch(() => {
                            props.onDepositFailed();
                        });
                    }
                }}
            >{buttonTitle}</MainButton>
            <DepositTokenSelectorModal isOpen={isTokenSelectorModalOpen} onClose={
                () => {
                    setIsTokenSelectorModalOpen(false);
                }
            } onCurrencyClick={
                (currency) => {
                    model.setDepositCurrency(currency);
                    setIsTokenSelectorModalOpen(false);
                }
            } />
        </>
    )
}