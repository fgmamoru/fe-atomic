import { SearchInput } from "@/components/Forms/SearchInput";
import { ModalHeaderWithCloseButton, RegularModal } from "../MainModal"
import styles from './SwapTokenSelectorModal.module.css'
import { Currency } from "@/types";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/Button/IconButton";
import { useModel } from "@/components/Services/Model";
import { TokenButton } from "@/components/Button/TokenButton";

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



export const SwapTokenSelectorModal = (props: TokenSelectorModalProps) => {
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
            <ModalHeaderWithCloseButton onClose={props.onClose}>Search a Token</ModalHeaderWithCloseButton>
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