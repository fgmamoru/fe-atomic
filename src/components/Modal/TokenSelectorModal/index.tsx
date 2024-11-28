import { SearchInput } from "@/components/Forms/SearchInput";
import { MainModal, RegularModal } from "../MainModal"
import styles from './TokenSelectorModal.module.css'
import { Currency } from "@/types";
import { useEffect, useState } from "react";
import { CloseButton } from "@headlessui/react";
import { MiniButton } from "@/components/Button/MiniButton";
import { IconButton } from "@/components/Button/IconButton";

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


const TokenButton = (props: {
    currency: Currency, onClick: (currency: Currency) => void

}) => {
    return <div className={styles.TokenSelectorModalItem}
        onClick={() => props.onClick(props.currency)}
    >
        <img src={props.currency?.icon} alt="icon" />
        <div className={styles.TokenSelectorModalItemColumn}>
            <span className={styles.TokenSelectorModalItemName}>{props.currency?.name}</span>
            <span className={styles.TokenSelectorModalItemSymbol}>{props.currency?.symbol}</span>
        </div>
    </div>
}

export const TokenSelectorModal = (props: TokenSelectorModalProps) => {
    const [search, setSearch] = useState<string>('');
    const [filteredCurrencies, setFilteredCurrencies] = useState<Set<Currency>>(props.currencies);

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
                <div className={styles.TokenSelectorModalItem}>Search a Token</div>
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
                        .map((currency) =>
                            <TokenButton
                                key={currency.symbol}
                                currency={currency}
                                onClick={() => props.onCurrencyClick?.(currency)}
                            />)
                }
                <Subtitle icon="/icons/star.svg">Tokens</Subtitle>
            </div>
        </RegularModal>
    )
} 