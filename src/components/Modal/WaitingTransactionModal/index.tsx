import { RegularModal } from "../MainModal";
import { Loader } from "@/components/Misc/Loader";
import { RequestStatus, RequestType } from "@/types";

export type WaitingTransactionModalProps = {
    status: RequestStatus;
    type: RequestType;
};

export const WaitingTransactionModal = (props: WaitingTransactionModalProps) => {
    return (
        <RegularModal
            isOpen={
                (props.status === RequestStatus.Requested
                    || props.status === RequestStatus.WaitingForConfirmation) && props.type === RequestType.Deposit
            }
        >
            <Loader />
            <h1>{getTitleMessage(props.status)}</h1>
            <p style={{ textAlign: "center" }}>{getDescriptionMessage(props.status)}</p>
        </RegularModal>
    )
};

const getTitleMessage = (status: RequestStatus) => {
    switch (status) {
        case RequestStatus.Requested:
            return "Executing your transaction";
        case RequestStatus.WaitingForConfirmation:
            return "Transaction Executed"
        default:
            return "Finalizing your transaction";
    }
}

const getDescriptionMessage = (status: RequestStatus) => {
    switch (status) {
        case RequestStatus.Requested:
            return "Please wait";
        case RequestStatus.WaitingForConfirmation:
            return "We're waiting for your transaction to be reflected in your balances"
        default:
            return "We're waiting for your transaction to appear in the next block";
    }
}