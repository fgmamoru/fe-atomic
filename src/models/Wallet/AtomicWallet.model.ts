import { AtomicWallet } from "@/services/AtomicDex/AtomicDex.service";
import { Address } from "@ton/core";

export class AtomicWalletModel implements AtomicWallet {
    $$type: "AtomicWallet";
    address: Address;
    activeMembers: bigint;
    liquidable: bigint;

    constructor(wallet: AtomicWallet) {
        this.$$type = "AtomicWallet";
        this.address = wallet.address;
        this.activeMembers = wallet.activeMembers;
        this.liquidable = wallet.liquidable;
    }

    toString() {
        `WalletModel {
    address: ${this.address},
    activeMembers: ${this.activeMembers},
    liquidable: ${this.liquidable}
}`;
    }

}