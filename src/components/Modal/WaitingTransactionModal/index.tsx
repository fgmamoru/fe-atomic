import { MainButton } from "@/components/Button/MainButton";
import { MainModal, RegularModal } from "../MainModal";
import { messages } from "@/services/i18n";
import { Loader } from "@/components/Misc/Loader";

export type WaitingTransactionModalProps = {
    isOpen?: boolean;
};

export const WaitingTransactionModal = (props: WaitingTransactionModalProps) => {
    return (
        <RegularModal
            isOpen={props.isOpen}
        >
            <Loader />
            <h1>Finalizing your transaction</h1>
            <p style={{ textAlign: "center" }}>We&apos;re waiting for your transaction to appear in the next block</p>
        </RegularModal>
    )
};