import { formatCryptoAmount } from "@/utils";
import React, { useEffect } from "react";
import { CardSection } from "../Card";
import { MiniButton } from "../Button/MiniButton";
import { CryptoInput } from "../Forms/CryptoInput";
import { Divider } from "../Misc/Divider";
import stakeStyles from '../Stake/index.module.css';
import { StakeStats, UnStakeStats } from "../Misc/StakeStats";
import { MainButton } from "../Button/MainButton";
import RoundProgress from "../Misc/EpochProgress";
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { useModel } from "../Services/Model/main.model";
import { messages } from "@/services/i18n";
import { useTonConnectModal } from "@tonconnect/ui-react";
import { InstantUnstakeSwitch } from "../Button/InstantUnstakeSwitch";
import { UnstakeType } from "@/types";

export const UnStake = () => {
    const model = useModel();
    const errorMessage = model.getErrorMessage();
    const [isUnStaking, setIsUnStaking] = React.useState(false);
    const { open } = useTonConnectModal();
    const [unstakeType, setUnstakeType] = React.useState<UnstakeType>('recommended');

    const onClickUnstake = () => {
        if (!model.address) return open();

        setIsUnStaking(true);
        model.sendTonTransaction()
            .finally(() => setIsUnStaking(false))
    }

    useEffect(() => { document.getElementById("unstake-amount")?.focus() });
    useEffect(() => { model.setUnstakeType(unstakeType) }, [unstakeType]);


    return (
        <>
            <CardSection>
                <div>
                    <CryptoInput
                        min={0}
                        type="text"
                        inputMode="decimal"
                        variant="top"
                        id="unstake-amount"
                        value={model.amount}
                        label={"You Unstake:"}
                        cryptoName={messages.en.mevTon}
                        cryptoIcon="/icons/mevton.svg"
                        error={errorMessage}
                        placeholder={formatCryptoAmount(0)}
                        onChange={model.setAmount}
                        invalid={!!errorMessage}
                        endLabel={<>
                            <span className={stakeStyles.StakeCurrentBalance}>
                                ~ <AnimatedNumber value={model.mtonBalanceFormatted()} formatValue={formatCryptoAmount} duration={300} /> {messages.en.mevTon}
                            </span>
                            <MiniButton
                                disabled={model.mtonBalanceInNano() <= 10000n}
                                onClick={model.setAmountToMax}
                            >Max</MiniButton>
                        </>}
                    />
                    <CryptoInput
                        min={0}
                        variant="bottom"
                        id="unstake-you-receive"
                        type="text"
                        value={model.youWillReceive()}
                        label={"You Receive:"}
                        cryptoName={messages.en.Ton}
                        cryptoIcon="/icons/ton.svg"
                        disabled
                    />
                </div>
                <InstantUnstakeSwitch onChange={setUnstakeType} />

            </CardSection>

            <Divider />
            <CardSection>
                <UnStakeStats />
            </CardSection>


            <CardSection>
                <RoundProgress />
            </CardSection>
            <CardSection>
                <StakeStats />
            </CardSection>
            <Divider />
            <CardSection>
                <MainButton
                    onClick={() => onClickUnstake()}
                    loading={isUnStaking}
                    disabled={(!model.amount || !!errorMessage || parseFloat(model.amount) === 0) && !!model.address}
                >
                    {unstakeButtonText(model.address?.toRawString(), unstakeType)}
                </MainButton>
            </CardSection>

        </>
    );
}

export default UnStake;

function unstakeButtonText(address: string | undefined, unstakeType: UnstakeType) {
    if (!address) {
        return messages.en.ConnectWallet
    }

    if (unstakeType === 'recommended') {
        return messages.en.unstakeRecommendedButton;
    }

    return messages.en.unstakeInstantButton;

}