import { ModelType, useModel } from "@/components/Services/Model";
import { ModalHeaderWithCloseButton, RegularModal } from "../MainModal";
import { SwapInput } from "@/components/Forms/SwapInput";
import { MainButton } from "@/components/Button/MainButton";
import style from './PreviewModal.module.css';
import { AVERAGE_NETWORK_FEE } from "@/services/Constants";
import { fromNano } from "@ton/core";
import { RequestStatus } from "@/types";

type PreviewModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onSwap?: () => void;
}

enum ProgressStatus {
  Pending,
  InProgress,
  Success,
  Error,
  SignFailed,
}
enum ProgressStep {
  Send,
  Confirm,
  BalanceUpdate,
}

const PreviewModalIcon = ({ status, step }: { status: ProgressStatus, step: ProgressStep }) => {
  const circleFill = status === ProgressStatus.Success ? "#000000" : "#ffffff"
  const iconFill = status === ProgressStatus.Success ? "#FFFFFF" : "#363636"
  let icon: React.ReactNode = null
  switch (step) {
    case ProgressStep.Send:
      return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill={iconFill} />
        <path fill={circleFill} d="M27.7 20.9L22 26.6H19.7V24.3L25.4 18.6L27.7 20.9ZM31.1 20.1C31.1 20.4 30.8 20.7 30.5 21L28 23.5L27.1 22.6L29.7 20L29.1 19.4L28.4 20.1L26.1 17.8L28.3 15.7C28.5 15.5 28.9 15.5 29.2 15.7L30.6 17.1C30.8 17.3 30.8 17.7 30.6 18C30.4 18.2 30.2 18.4 30.2 18.6C30.2 18.8 30.4 19 30.6 19.2C30.9 19.5 31.2 19.8 31.1 20.1ZM11 28V12H18V17H23V18.5L25 16.5V16L19 10H11C9.9 10 9 10.9 9 12V28C9 29.1 9.9 30 11 30H23C24.1 30 25 29.1 25 28H11ZM19 25.1C18.8 25.1 18.6 25.2 18.5 25.2L18 23H16.5L14.4 24.7L15 22H13.5L12.5 27H14L16.9 24.4L17.5 26.7H18.5L19 26.6V25.1Z" />
      </svg>
    case ProgressStep.Confirm:
      return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill={iconFill} />
        <path fill={circleFill} d="M27 16L23 20H26C26 21.5913 25.3679 23.1174 24.2426 24.2426C23.1174 25.3679 21.5913 26 20 26C19 26 18.03 25.75 17.2 25.3L15.74 26.76C16.97 27.54 18.43 28 20 28C22.1217 28 24.1566 27.1571 25.6569 25.6569C27.1571 24.1566 28 22.1217 28 20H31M14 20C14 18.4087 14.6321 16.8826 15.7574 15.7574C16.8826 14.6321 18.4087 14 20 14C21 14 21.97 14.25 22.8 14.7L24.26 13.24C23.03 12.46 21.57 12 20 12C17.8783 12 15.8434 12.8429 14.3431 14.3431C12.8429 15.8434 12 17.8783 12 20H9L13 24L17 20" />
      </svg>
    case ProgressStep.BalanceUpdate:
      return <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill={iconFill} />
        <path fill={circleFill} d="M20 11C19.2044 11 18.4413 11.3161 17.8787 11.8787C17.3161 12.4413 17 13.2044 17 14C17 17 22 21 14 21C13.4696 21 12.9609 21.2107 12.5858 21.5858C12.2107 21.9609 12 22.4696 12 23V25H28V23C28 22.4696 27.7893 21.9609 27.4142 21.5858C27.0391 21.2107 26.5304 21 26 21C18 21 23 17 23 14C23 12 21.66 11 20 11ZM14 27V29H26V27H14Z" />
      </svg>
  }
}

const StatusModalIcon = ({ status }: { status: ProgressStatus }) => {
  switch (status) {
    case ProgressStatus.Success:
      return <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z" fill="#00EABB" />
      </svg>
    case ProgressStatus.InProgress:
      return <svg style={{
        animation: "spin 1s linear infinite",
      }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.346 2.02142C11.9396 1.98251 12.5327 1.99681 13.1185 2.06275C14.4802 2.21602 15.8024 2.6483 17 3.33975L15.0005 6.80299C14.1179 6.2923 13.0931 6 12 6C8.68629 6 6 8.6863 6 12C6 12.5372 6.07059 13.0579 6.20301 13.5533L2.34074 14.5882C1.98282 13.2524 1.90748 11.8634 2.11186 10.5084C2.19978 9.92553 2.33947 9.34895 2.5307 8.78561C3.16645 6.91276 4.34328 5.27049 5.91239 4.06647C7.48149 2.86246 9.37239 2.15077 11.346 2.02142Z" fill="white" />
        <g opacity="0.4">
          <path d="M11.9476 2C11.7473 2.00105 11.5466 2.00812 11.3459 2.02128C9.37235 2.15063 7.48145 2.86232 5.91235 4.06633C4.34324 5.27035 3.16641 6.91262 2.53066 8.78547C2.33944 9.34881 2.19975 9.92539 2.11183 10.5083C2.03864 10.9935 2.00132 11.483 2 11.9729C2.01451 6.4799 6.45783 2.02814 11.9476 2Z" fill="white" />
          <path d="M12.0597 2.00004C12.4143 2.00216 12.7677 2.02313 13.1184 2.06261C14.4801 2.21588 15.8023 2.64816 17 3.33961L15.0005 6.80285C16.7936 7.84035 18 9.77923 18 11.9999C18 15.3136 15.3137 17.9999 12 17.9999C9.22343 17.9999 6.88739 16.1139 6.20297 13.5532L2.34071 14.5881C2.11608 13.7497 2.00275 12.8905 2.00001 12.0318C2.01722 17.5399 6.48776 21.9999 12 21.9999C17.5228 21.9999 22 17.5227 22 11.9999C22 6.49695 17.5551 2.0322 12.0597 2.00004Z" fill="white" />
        </g>
      </svg>


  }

  return <></>
}

const PreviewModalProgressItem = ({ title, status, icon }: {
  title: string,
  status: ProgressStatus,
  icon: React.ReactNode,
}) => {
  return (
    <div className={style.PreviewModalProgressItem}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <span>{title}</span>
      </div>
      <StatusModalIcon status={status} />
    </div>
  )
}



const PreviewModalProgress = () => {
  const model = useModel();
  const status = model.requestStatus;
  // const status = RequestStatus.Failed;

  if (status === RequestStatus.None) {
    return <></>;
  }

  if (status === RequestStatus.SignFailed) {
    return <></>
  }

  if (status === RequestStatus.Failed) {
    return <></>
  }

  const sendTransactionStatuses = {
    [RequestStatus.None]: ProgressStatus.Pending,
    [RequestStatus.Requested]: ProgressStatus.InProgress,
    [RequestStatus.WaitingForConfirmation]: ProgressStatus.Success,
    [RequestStatus.Confirmed]: ProgressStatus.Success,
    [RequestStatus.DataUpdated]: ProgressStatus.Success,
    [RequestStatus.Failed]: ProgressStatus.Success,
    [RequestStatus.SignFailed]: ProgressStatus.SignFailed,
  }

  const confirmTransactionStatuses = {
    ...sendTransactionStatuses,
    [RequestStatus.Requested]: ProgressStatus.Pending,
    [RequestStatus.WaitingForConfirmation]: ProgressStatus.InProgress,
    [RequestStatus.Confirmed]: ProgressStatus.Success,
  }

  const balanceUpdateStatuses = {
    ...confirmTransactionStatuses,
    [RequestStatus.WaitingForConfirmation]: ProgressStatus.Pending,
    [RequestStatus.Confirmed]: ProgressStatus.InProgress,
    [RequestStatus.DataUpdated]: ProgressStatus.Success,
  }

  return (
    <div className={style.PreviewModalProgress}>
      <PreviewModalProgressItem
        title="Send Transaction"
        status={sendTransactionStatuses[status]}
        icon={<PreviewModalIcon status={sendTransactionStatuses[status]} step={ProgressStep.Send} />}
      />
      <PreviewModalProgressItem
        title="Confirm Transaction"
        status={confirmTransactionStatuses[status]}
        icon={<PreviewModalIcon status={confirmTransactionStatuses[status]} step={ProgressStep.Confirm} />}
      />
      <PreviewModalProgressItem
        title="Update Balance"
        status={balanceUpdateStatuses[status]}
        icon={<PreviewModalIcon status={balanceUpdateStatuses[status]} step={ProgressStep.BalanceUpdate} />}
      />
    </div>
  )
}

const PreviewModalStats = ({ model }: { model: ModelType }) => {
  return (
    <div className={style.PreviewModalStats}>
      <div className={style.PreviewModalStatsRow}>
        <span>Rate</span>
        <span className={style.PreviewModalStatsRowValue}>1{model.fromCurrency.symbol} = {model.getResultExchangeRateFormatted()}{model.toCurrency.symbol}</span>
      </div>

      <div className={style.PreviewModalStatsRow}>
        <span>Fee</span>
        <span className={style.PreviewModalStatsRowValue}>${fromNano(model.resultSwapFee)} USD</span>
      </div>

      <div className={style.PreviewModalStatsRow}>
        <span>Network Cost</span>
        <span className={style.PreviewModalStatsRowValue}>~ {fromNano(model.estimatedGas)} TON</span>
      </div>

      <div className={style.PreviewModalStatsRow}>
        <span>Max. Slippage</span>
        <span className={style.PreviewModalStatsRowValue}>0.8%</span>
      </div>
    </div>
  )
}

export const PreviewModal = (props: PreviewModalProps) => {
  const model = useModel();
  const status: RequestStatus = model.requestStatus;
  const shouldDisplaySwapButton =
    status === RequestStatus.None ||
    status === RequestStatus.Failed ||
    status === RequestStatus.SignFailed;
  const shouldDisplayCloseButton =
    status === RequestStatus.Failed ||
    status === RequestStatus.DataUpdated
  status === RequestStatus.DataUpdated;

  const titleMap = {
    [RequestStatus.None]: "You are swapping",
    [RequestStatus.Requested]: "Sending transaction",
    [RequestStatus.WaitingForConfirmation]: "Confirming transaction",
    [RequestStatus.Confirmed]: "Updating balance",
    [RequestStatus.DataUpdated]: "Swap Completed!",
    [RequestStatus.Failed]: "Swap failed",
    [RequestStatus.SignFailed]: "Sign failed",
  }

  return (
    <RegularModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      className={style.PreviewModal}
    >
      <div style={{ width: "100%" }}>
        <ModalHeaderWithCloseButton
          disableClose={!shouldDisplayCloseButton && !shouldDisplaySwapButton}
          onClose={props.onClose}>{titleMap[status]}</ModalHeaderWithCloseButton>

        <SwapInput
          id="stake-amount"
          type="text"
          variant="top"
          disabled
          value={model.swapAmount}
          inputMode="decimal"
          placeholder={"0.00"}
          selectorDisabled
          selectedCurrency={model.fromCurrency}
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
          selectedCurrency={model.toCurrency}
          invalid={!!model.swapErrorMessage}
          currencies={model.currencies}
        />
        <PreviewModalStats model={model} />
      </div>

      <PreviewModalProgress />

      {shouldDisplaySwapButton && <MainButton
        onClick={props.onSwap}
        fullWidth
        suppressHydrationWarning
      >Swap</MainButton>}

      {
        shouldDisplayCloseButton && <MainButton
          onClick={props.onClose}
          fullWidth
          suppressHydrationWarning
        >Close</MainButton>
      }


    </RegularModal>
  )
} 