import { useModel } from "@/components/Services/Model";
import { ModalHeaderWithCloseButton, RegularModal } from "../MainModal";
import { SwapInput } from "@/components/Forms/SwapInput";
import { MainButton } from "@/components/Button/MainButton";
import style from './PreviewModal.module.css';
import { AVERAGE_NETWORK_FEE } from "@/services/Constants";
import { fromNano } from "@ton/core";

type PreviewModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onSwap?: () => void;
}


export const PreviewModal = (props: PreviewModalProps) => {
  const model = useModel();
  return (
    <RegularModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      className={style.PreviewModal}
    >
      <div style={{ width: "100%" }}>
        <ModalHeaderWithCloseButton onClose={props.onClose}>You are swapping</ModalHeaderWithCloseButton>

        <SwapInput
          id="stake-amount"
          type="text"
          variant="top"
          disabled
          value={model.swapAmount}
          inputMode="decimal"
          placeholder={"0.00"}
          selectorDisabled
          // label="Sell"
          selectedCurrency={model.selectedFromCurrency}
          invalid={!!model.swapErrorMessage}
          currencies={model.currencies}
        />
        <div style={{
          display: "flex",
          padding: "0 10px",
          backgroundColor: "var(--color-bg-graph)"

        }}>
          <img src="/icons/preview-arrow.svg" aria-hidden />
        </div>
        <SwapInput
          id="stake-amount"
          type="text"
          variant="bottom"
          disabled
          value={model.resultSwapAmount}
          inputMode="decimal"
          placeholder={"0.00"}
          selectorDisabled
          // label="Sell"
          selectedCurrency={model.selectedToCurrency}
          invalid={!!model.swapErrorMessage}
          currencies={model.currencies}
        />
        <div className={style.PreviewModalStats}>
          <div className={style.PreviewModalStatsRow}>
            <span>Fee</span>
            <span className={style.PreviewModalStatsRowValue}>${fromNano(model.resultSwapFee)} USD</span>
          </div>
          <div className={style.PreviewModalStatsRow}>
            <span>Network Cost</span>
            <span className={style.PreviewModalStatsRowValue}>~ {fromNano(model.estimatedGas)} TON</span>
          </div>
        </div>
      </div>
      <MainButton
        onClick={props.onSwap}
        fullWidth
        suppressHydrationWarning
      >Swap</MainButton>


    </RegularModal>
  )
} 