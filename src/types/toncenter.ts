export type TonCenterJettonWallet = {
    address: string;
    balance: string;
    owner: string;
    jetton: string;
    last_transaction_lt: string;
    code_hash: string;
    data_hash: string;
}

export type TonCenterJettonMetadata = {
    is_indexed: boolean;
    token_info: {
        type: "jetton_masters",
        name?: string,
        symbol?: string,
        description?: string,
        image?: string,
        extra?: {
            "decimals": "9"
        }
    }
}

export type TonCenterJettonPairs = {
    jetton_wallets: TonCenterJettonWallet[];
    address_book: Record<string, { user_friendly: string, domain: null }>;
    metadata: Record<string, TonCenterJettonMetadata>;
}