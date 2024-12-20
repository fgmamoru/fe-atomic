import { SearchInput } from "@/components/Forms/SearchInput";
import { MainModal, RegularModal } from "../MainModal"
import styles from './TokenSelectorModal.module.css'
import { Currency } from "@/types";
import { memo, useEffect, useState } from "react";
import { CloseButton } from "@headlessui/react";
import { MiniButton } from "@/components/Button/MiniButton";
import { IconButton } from "@/components/Button/IconButton";
import { useModel } from "@/components/Services/Model";
import { fromNano } from "@ton/core";

export type TokenSelectorModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    currencies: Set<Currency>;
    onCurrencyClick?: (
        currency: Currency
    ) => void;
}

const Subtitle = (props: { children: string, icon: string }) =>
    <div className={styles.TokenSelectorModalSubtitle}>
        <img src={props.icon} alt="icon" />
        <span>{props.children}</span>
    </div>


const TokenButtonComponent = (props: {
    currency: Currency, onClick: (currency: Currency) => void
}) => {
    const model = useModel();
    const member = model._memberRecord;

    const balance: bigint | undefined = member ? member.getCurrencyBalance(props.currency) : undefined;
    const formattedBalance = balance ? parseFloat(fromNano(balance)).toFixed(2) : "0";
    console.log("Balance:", balance)


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

const TokenButton = memo(TokenButtonComponent);

export const TokenSelectorModal = (props: TokenSelectorModalProps) => {
    const [search, setSearch] = useState<string>('');
    const [filteredCurrencies, setFilteredCurrencies] = useState<Set<Currency>>(props.currencies);
    const model = useModel();
    const member = model._memberRecord;

    useEffect(() => {
        if (search === '') {
            setFilteredCurrencies(props.currencies);
            return;
        }
        const filtered = new Set(Array.from(props.currencies).filter((currency) =>
            currency.name.toLowerCase().includes(search.toLowerCase())
        ));
        setFilteredCurrencies(filtered);
    }, [search, props.currencies]);


    return (
        <RegularModal
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <div className={styles.TokenSelectorModalHeader}>
                <div className={styles.TokenSelectorModalHeaderText}>Search a Token</div>
                <IconButton
                    onClick={props.onClose}
                    icon="/icons/close.svg"
                    alt="close"
                />
            </div>
            <SearchInput placeholder="Search for a token" value={search} onChange={(ev) => {
                setSearch(ev.target.value);
            }} />
            <div style={{ width: "100%" }}>

                <Subtitle icon="/icons/coin.svg">Your Tokens</Subtitle>
                {
                    Array.from(filteredCurrencies)
                        .filter((currency) => {
                            const balance: bigint = member ? member.getCurrencyBalance(currency) : 0n;

                            return balance && balance > 0n;
                        })
                        .map((currency) =>
                            <TokenButton
                                key={currency.symbol}
                                currency={currency}
                                onClick={() => props.onCurrencyClick?.(currency)}
                            />)
                }
                <Subtitle icon="/icons/star.svg">Tokens</Subtitle>
                {
                    Array.from(filteredCurrencies)
                        .filter((currency) => {
                            const balance: bigint = member ? member.getCurrencyBalance(currency) : 0n;

                            return balance === 0n;
                        })
                        .map((currency) =>
                            <TokenButton
                                key={currency.symbol}
                                currency={currency}
                                onClick={() => props.onCurrencyClick?.(currency)}
                            />)
                }
            </div>
        </RegularModal>
    )
} 