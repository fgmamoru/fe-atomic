import { AtomicVault } from "@/services/Wrappers/AtomicDex.wrapper";
import { DEFAULT_CURRENCIES_MAP_BY_ID } from "@/services/Defaults";
import { Currency } from "@/types";
import { Address } from "@ton/core";

export class AtomicVaultModel implements AtomicVault {
    $$type: "AtomicVault";
    address: Address;
    activeMembers: bigint;
    liquidable: bigint;
    readonly currency: Currency;

    constructor(readonly id: bigint, wallet: AtomicVault) {
        this.$$type = "AtomicVault";
        this.address = wallet.address;
        this.activeMembers = wallet.activeMembers;
        this.liquidable = wallet.liquidable;
        this.currency = DEFAULT_CURRENCIES_MAP_BY_ID[id.toString()]
    }

    toString() {
        `VaultModel {
        address: ${this.address},
        activeMembers: ${this.activeMembers},
        liquidable: ${this.liquidable}
    }`;
    }

}