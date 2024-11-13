import { MainButton } from "@/components/Button/MainButton";
import { MainModal, MiniModal } from "../MainModal";
import { messages } from "@/services/i18n";
import { Loader } from "@/components/Misc/Loader";

export type WaitingTransactionModalProps = {
  isOpen?: boolean;
};

export const WaitingTransactionModal = (props: WaitingTransactionModalProps) => {
  return (
    <MiniModal
      isOpen={props.isOpen}
    >
      <Loader />
      <h1>Finalizing your transaction</h1>
      <p>We&apos;re waiting for your transaction to appear in the next block</p>
    </MiniModal>
  )
};