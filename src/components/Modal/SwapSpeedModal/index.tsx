import { MainButton } from "@/components/Button/MainButton";
import { RegularModal } from "../MainModal";
import { memo } from "react";

type SwapSpeedModal = {
    isOpen: boolean;
    onDepositClick: () => void;
    onSwapClick: () => void;
};

const SwapSpeedModalComponent = (props: SwapSpeedModal) => {
    return (
        <RegularModal
            isOpen={
                props.isOpen
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <h2 style={{ textAlign: 'left', width: '100%' }}>Hey</h2>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>You can swap <span
                    style={{ color: 'var(--color-text-secondary-bold)', fontWeight: 600 }}
                >from 10 to 30 times quicker</span> if you deposit tokens first.</p>
                <MainButton
                    fullWidth
                    onClick={props.onDepositClick}
                >Deposit and Swap wih high speeds</MainButton>
                <MainButton
                    fullWidth
                    variant="secondary"
                    onClick={props.onSwapClick}
                >Swap with slow speed</MainButton>
            </div>

        </RegularModal>
    )
}

export const SwapSpeedModal = memo(SwapSpeedModalComponent);
