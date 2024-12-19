import { RegularModal } from "../MainModal";
import { Loader } from "@/components/Misc/Loader";
import { SwapRequestStatus } from "@/types";

export type WaitingTransactionModalProps = {
    status: SwapRequestStatus;
};

export const WaitingTransactionModal = (props: WaitingTransactionModalProps) => {
    return (
        <RegularModal
            isOpen={
                props.status === SwapRequestStatus.Requested || props.status === SwapRequestStatus.WaitingForConfirmation
            }
        >
            <Loader />
            <h1>{getTitleMessage(props.status)}</h1>
            <p style={{ textAlign: "center" }}>{getDescriptionMessage(props.status)}</p>
        </RegularModal>
    )
};

const getTitleMessage = (status: SwapRequestStatus) => {
    switch (status) {
        case SwapRequestStatus.Requested:
            return "Executing your transaction";
        case SwapRequestStatus.WaitingForConfirmation:
            return "Transaction Executed"
        default:
            return "Finalizing your transaction";
    }
}

const getDescriptionMessage = (status: SwapRequestStatus) => {
    switch (status) {
        case SwapRequestStatus.Requested:
            return "Please wait";
        case SwapRequestStatus.WaitingForConfirmation:
            return "We're waiting for your transaction to be reflected in your balances"
        default:
            return "We're waiting for your transaction to appear in the next block";
    }
}