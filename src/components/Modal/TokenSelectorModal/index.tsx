import { SearchInput } from "@/components/Forms/SearchInput";
import { MainModal, RegularModal } from "../MainModal"
import styles from './TokenSelectorModal.module.css'
import { Currency } from "@/types";
import { useEffect, useState } from "react";
import { CloseButton } from "@headlessui/react";
import { MiniButton } from "@/components/Button/MiniButton";

export type TokenSelectorModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    currencies: Set<Currency>;
}

const Subtitle = (props: { children: string, icon: string }) =>
    <div className={styles.TokenSelectorModalSubtitle}>
        <img src={props.icon} alt="icon" />
        <span>{props.children}</span>
    </div>


const TokenItem = (props: { name: string, symbol: string, icon: string }) => {
    return <div className={styles.TokenSelectorModalItem}>
        <img src={props.icon} alt="icon" />
        <div className={styles.TokenSelectorModalItemColumn}>
            <span className={styles.TokenSelectorModalItemName}>{props.name}</span>
            <span className={styles.TokenSelectorModalItemSymbol}>{props.symbol}</span>
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
        console.log('filtered')
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
            <div>
                <div className={styles.TokenSelectorModalItem}>Search a Token</div>

            </div>
            <SearchInput placeholder="Search for a token" value={search} onChange={(ev) => {
                setSearch(ev.target.value);
            }} />
            <div>
                <Subtitle icon="/icons/coin.svg">Your Tokens</Subtitle>
                {
                    Array.from(filteredCurrencies)
                        .map((currency) =>
                            <TokenItem
                                key={currency.symbol}
                                name={currency.name}
                                symbol={currency.symbol}
                                icon={currency.icon} />)
                }
                <Subtitle icon="/icons/star.svg">Tokens</Subtitle>
            </div>
        </RegularModal>
    )
} 