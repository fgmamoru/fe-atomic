import { MainButton } from "@/components/Button/MainButton";
import { RegularModal } from "../MainModal";
import { memo, useState } from "react";
import { IconButton } from "@/components/Button/IconButton";
import styles from './SwapSpeedModal.module.css';
import { Grid2 } from "@/components/Layout/Grid";
import { DEFAULT_CURRENCIES } from "@/services/Defaults";

type SwapSpeedModal = {
    isOpen: boolean;
    onDepositClick: () => void;
    onSwapClick: () => void;
};

const SwapSpeedModalComponent = (props: SwapSpeedModal) => {
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    return (
        <>
            <RegularModal
                isOpen={
                    props.isOpen
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <h2 style={{ textAlign: 'left', width: '100%' }}>Hey</h2>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>You can swap <span
                        style={{ color: 'var(--color-text-secondary-bold)', fontWeight: 600 }}
                    >from 10 to 30 times quicker</span> if you deposit <span
                        onClick={() => setIsSubModalOpen(true)}
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}>tokens</span> first.</p>
                    <MainButton
                        fullWidth
                        onClick={props.onDepositClick}
                    >Deposit and Swap wih high speeds</MainButton>
                    {/* <MainButton
                        fullWidth
                        variant="secondary"
                        onClick={props.onSwapClick}
                    >Swap with slow speed (soon)</MainButton> */}
                </div>

            </RegularModal>
            <RegularModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                className={styles.SubModal}
            >
                <div className={styles.TokenSelectorModalHeader}>
                    <div className={styles.TokenSelectorModalHeaderText}>Search a Token</div>
                    <IconButton
                        onClick={
                            () => setIsSubModalOpen(false)
                        }
                        icon="/icons/close.svg"
                        alt="close"
                    />
                </div>
                <Grid2>
                    {
                        DEFAULT_CURRENCIES.map((currency) => {
                            return (
                                <div key={currency.symbol} className={styles.SubModalItem}>
                                    <img className={styles.SubModalImage} src={currency.icon} alt={currency.symbol} />
                                    <div>
                                        <div className={styles.SubModalItemName}>{currency.name}</div>
                                        <div className={styles.SubModalItemSymbol}>{currency.symbol}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Grid2>
            </RegularModal>
        </>
    )
}

export const SwapSpeedModal = memo(SwapSpeedModalComponent);
