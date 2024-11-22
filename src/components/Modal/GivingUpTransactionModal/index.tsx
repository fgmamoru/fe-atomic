import { MainButton } from "@/components/Button/MainButton";
import { MainModal, RegularModal } from "../MainModal";
import { messages } from "@/services/i18n";
import { Loader } from "@/components/Misc/Loader";

export type GivingUpTransactionModalProps = {
    isOpen?: boolean;
};

export const GivingUpTransactionModal = (props: GivingUpTransactionModalProps) => {
    return (
        <RegularModal
            isOpen={props.isOpen}
        >

            <h1>Ups!</h1>
            <p>we were not able to find the transaction result in Ton Blockchain</p>
            <p>Please reload the page</p>
        </RegularModal>
    )
};