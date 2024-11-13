import { formatCryptoAmount } from "@/utils";
import React, { useEffect } from "react";
import { CryptoInput } from "../Forms/CryptoInput";
import { CardSection } from "../Card";
import { MiniButton } from "../Button/MiniButton";
import styles from './index.module.css';
import { Divider } from "../Misc/Divider";
import { StakeStats } from "../Misc/StakeStats";
import { MainButton } from "../Button/MainButton";
import { StakingTermsModal } from "../Modal/StakingTermsModal";
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { toast } from "react-toastify";
import { useModel } from "../Services/Model/main.model";
import { useTonConnectModal } from "@tonconnect/ui-react";
import { useTermsAndConditions } from "@/services/termsAndConditions.service";
import { messages } from "@/services/i18n";

const Stake = () => {
    const model = useModel();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isStaking, setIsStaking] = React.useState(false);
    const { open } = useTonConnectModal();
    const { accept, accepted } = useTermsAndConditions();
    const errorMessage = model.getErrorMessage()
    const onClickStake = () => {
        if (!model.address) {
            open();
            return;
        }

        if (!accepted) {
            setIsModalOpen(true);
            return;
        }


        setIsStaking(true);
        model.sendTonTransaction().then(() => {
            setIsStaking(false);
        }).catch((e) => {
            setIsStaking(false);
            toast.error(e.message);
        });
    };
    useEffect(() => {
        document.getElementById('stake-amount')?.focus();
    })


    return (
        <>
            <CardSection>
                <div>
                    <CryptoInput
                        min={0}
                        variant="top"
                        id="stake-amount"
                        type="text"
                        value={model.amount}
                        onChange={model.setAmount}
                        inputMode="decimal"
                        placeholder={formatCryptoAmount(0)}
                        cryptoName="Ton"
                        cryptoIcon="/icons/ton.svg"
                        invalid={!!errorMessage}
                        error={errorMessage}
                        endLabel={<>
                            <span className={styles.StakeCurrentBalance}>
                                ~ <AnimatedNumber value={model.maxAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                            <MiniButton
                                disabled={model.maxAmountInTon() === 0}
                                onClick={() => model.setAmountToMax()}>Max</MiniButton>
                        </>}
                    />
                    <CryptoInput
                        min={0}
                        variant="bottom"
                        id="stake-you-receive"
                        value={model.youWillReceive()}
                        cryptoName={messages.en.mevTon}
                        cryptoIcon="/icons/mevton.svg"
                        disabled
                        type="text"
                    />
                </div>
            </CardSection>
            <Divider />
            <CardSection>
                <StakeStats />
            </CardSection>
            <Divider />
            <CardSection>
                <MainButton
                    testId="stake-button"
                    loading={isStaking}
                    onClick={onClickStake}
                    disabled={(!!errorMessage || !model.amount || parseFloat(model.amount) === 0) && !!model.address}
                >
                    {
                        model.address ? 'Stake' : 'Connect Wallet'
                    }
                </MainButton>
            </CardSection>
            <StakingTermsModal
                isOpen={isModalOpen}
                onAccept={() => {
                    onClickStake();
                    accept();
                }}
                onClose={() => {
                    setIsModalOpen(false);
                }} />
            {/* <pre>
      {JSON.stringify({
        address: model.address?.toRawString(),
        maxAmount: model.maxAmount().toString(),
        lastBlock: model.lastBlock,
        tonBalance: model.tonBalance?.toString(),
      }, null, 2)}
    </pre> */}
            {/* <DebugStats /> */}
        </>
    );
};

export default Stake;