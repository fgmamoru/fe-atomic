import { DexDepositTab } from "@/app/components/Deposit";
import { RegularModal } from "../MainModal";
import { memo } from "react";
import { IconButton } from "@/components/Button/IconButton";
import { DexWithdrawTab } from "@/app/components/Withdraw";

export type WithdrawModal = {
    isOpen: boolean;
    onClose: () => void;
};

const WithdrawModalComponent = (props: WithdrawModal) => {
    return (
        <RegularModal
            isOpen={
                props.isOpen
            }
        >
            <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}
                ><h2>Withdraw</h2>
                    <IconButton
                        onClick={props.onClose}
                        icon="/icons/close.svg"
                        alt="close"
                    />
                </div>
                <DexWithdrawTab
                />
            </div>

        </RegularModal>
    )
}

export const WithdrawModal = memo(WithdrawModalComponent);
