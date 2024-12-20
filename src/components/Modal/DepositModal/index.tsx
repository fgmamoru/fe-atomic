import { DexDepositTab } from "@/app/components/Deposit";
import { RegularModal } from "../MainModal";
import { memo } from "react";
import { IconButton } from "@/components/Button/IconButton";

export type DepositModal = {
    isOpen: boolean;
    onClose: () => void;
};

const DepositModalComponent = (props: DepositModal) => {
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
                ><h2>Deposit</h2>

                    <IconButton
                        onClick={props.onClose}
                        icon="/icons/close.svg"
                        alt="close"
                    />
                </div>
                <DexDepositTab />
            </div>

        </RegularModal>
    )
}

export const DepositModal = memo(DepositModalComponent);
