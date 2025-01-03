import { DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";
import { Currency } from "@/types";
import { TonCenterJettonWallet, TonCenterJettonMetadata } from "@/types/toncenter";

export class NativeJettonModel {
    public address: string;
    public balance: bigint;
    public symbol: string;
    public description: string;
    public image: string;

    constructor(
        jettonWallet: TonCenterJettonWallet,
        jettonMetadata: TonCenterJettonMetadata,
        public readonly currency: Currency,
    ) {
        this.address = jettonWallet.address;
        this.balance = BigInt(jettonWallet.balance);
        this.symbol = jettonMetadata.token_info.symbol || "";
        this.description = jettonMetadata.token_info.description || "";
        this.image = jettonMetadata.token_info.image || "";
    }
}