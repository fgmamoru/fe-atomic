import { SearchInput } from "@/components/Forms/SearchInput";
import { ModalHeaderWithCloseButton, RegularModal } from "../MainModal"
import styles from './DepositTokenSelectorModal.module.css'
import { Currency } from "@/types";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/Button/IconButton";
import { useModel } from "@/components/Services/Model";
import { TokenButton } from "@/components/Button/TokenButton";
import { NativeJettonModel } from "@/models/NativeJetton.model";
import { DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";

export type TokenSelectorModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    onCurrencyClick?: (
        currency: Currency
    ) => void;
}


export const DepositTokenSelectorModal = (props: TokenSelectorModalProps) => {
    const [search, setSearch] = useState<string>('');
    const { jettons, tonBalanceInNano } = useModel();

    const [filteredJettons, setFilteredJettons] = useState<Array<NativeJettonModel>>(jettons);
    return (
        <RegularModal
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <ModalHeaderWithCloseButton onClose={props.onClose}>Search a Token</ModalHeaderWithCloseButton>
            <SearchInput placeholder="Search for a token" value={search} onChange={(ev) => {
                setSearch(ev.target.value);
            }} />
            <br />
            <div style={{ width: "100%" }}>
                <TokenButton
                    key={'ton'}
                    currency={DEFAULT_CURRENCIES_MAP.TON}
                    balance={tonBalanceInNano}
                    onClick={() => props.onCurrencyClick?.(DEFAULT_CURRENCIES_MAP.TON)}
                />
                {
                    Array.from(filteredJettons)
                        .map((jetton) =>
                            <TokenButton
                                key={jetton.symbol}
                                currency={jetton.currency}
                                balance={jetton.balance}
                                onClick={() => props.onCurrencyClick?.(jetton.currency)}
                            />)
                }
            </div>
        </RegularModal>
    )
} 