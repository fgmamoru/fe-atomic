import { DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";
import { Currency } from "@/types";
import { TonCenterJettonWallet, TonCenterJettonMetadata } from "@/types/toncenter";
import { Address } from "@ton/ton";

export class NativeJettonModel {
    public address: Address;
    public balance: bigint;
    public symbol: string;
    public description: string;
    public image: string;
    public masterAddress: Address;

    constructor(
        jettonWallet: TonCenterJettonWallet,
        jettonMetadata: TonCenterJettonMetadata,
        public readonly currency: Currency,
    ) {
        this.address = Address.parse(jettonWallet.address);
        this.masterAddress = Address.parse(currency.jettonMasterAddress);
        this.balance = BigInt(jettonWallet.balance);
        this.symbol = jettonMetadata.token_info.symbol || "";
        this.description = jettonMetadata.token_info.description || "";
        this.image = jettonMetadata.token_info.image || "";
    }

    static fromEmpty(address: string, currency: Currency): NativeJettonModel {
        const wallet: TonCenterJettonWallet = {
            address: address,
            balance: "0",
            owner: "",
            jetton: "",
            last_transaction_lt: "",
            code_hash: "",
            data_hash: ""
        }
        const metadata: TonCenterJettonMetadata = {
            is_indexed: false,
            token_info: {
                type: "jetton_masters",
                name: currency.name,
                symbol: currency.symbol,
                description: "",
                image: currency.icon,
                extra: undefined
            }
        };

        return new NativeJettonModel(wallet, metadata, currency);
    }
}