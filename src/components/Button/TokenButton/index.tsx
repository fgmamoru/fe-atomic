import { useModel } from "@/components/Services/Model";
import { Currency } from "@/types";
import { fromNano } from "@ton/core";
import { memo } from "react";
import styles from './TokenButton.module.css';

const TokenButtonComponent = (props: {
    currency: Currency,
    onClick: (currency: Currency) => void,
    balance?: bigint
}) => {
    const model = useModel();
    const member = model._memberRecord;

    const balance: bigint | undefined = props.balance ?? (member ? member.getCurrencyBalance(props.currency) : undefined);
    const formattedBalance = balance ? parseFloat(fromNano(balance)).toFixed(2) : "0";


    return <div className={styles.TokenSelectorModalItem}
        onClick={() => props.onClick(props.currency)}
    >
        <img src={props.currency?.icon} alt="icon" />
        <div className={styles.TokenSelectorModalItemColumn}>
            <span className={styles.TokenSelectorModalItemName}>{props.currency?.name}</span>
            <span className={styles.TokenSelectorModalItemSymbol}>{props.currency?.symbol}</span>
        </div>
        {
            balance && <div className={styles.FinalColumn}>
                <span className={styles.TokenSelectorModalItemBalance}>{formattedBalance}
                    <span className={styles.TokenSelectorModalItemSymbolSmall}>{props.currency.symbol}</span>

                </span>
                <span className={styles.TokenSelectorModalItemUSD}>{model.getInUsd(formattedBalance, props.currency)}
                    <span className={styles.TokenSelectorModalItemSymbolSmall}>USD</span>


                </span>
            </div>
        }
    </div>
}

export const TokenButton = memo(TokenButtonComponent);
