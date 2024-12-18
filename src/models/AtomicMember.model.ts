import { AtomicMemberRecord } from "@/services/AtomicDex/AtomicDex.service";
import { Currency, CurrencyBalanceKeyName } from "@/types";

export class AtomicMemberRecordModel implements AtomicMemberRecord {
    $$type: "AtomicMemberRecord";
    id: bigint;
    seq: bigint;
    balance0: bigint;
    balance1: bigint;
    balance2: bigint;
    balance3: bigint;
    balance4: bigint;
    balance5: bigint;
    balance6: bigint;
    balance7: bigint;
    balance8: bigint;
    balance9: bigint;
    balance10: bigint;
    balance11: bigint;
    balance12: bigint;
    balance13: bigint;
    balance14: bigint;
    unused: bigint;
    private balances: Record<CurrencyBalanceKeyName, bigint> & { balance0: bigint; balance1: bigint; balance2: bigint; balance3: bigint; balance4: bigint; balance5: bigint; balance6: bigint; balance7: bigint; balance8: bigint; balance9: bigint; balance10: bigint; balance11: bigint; balance12: bigint; balance13: bigint; balance14: bigint; };

    constructor(member: AtomicMemberRecord) {
        this.$$type = "AtomicMemberRecord";
        this.id = member.id;
        this.seq = member.seq;
        this.balance0 = member.balance0;
        this.balance1 = member.balance1;
        this.balance2 = member.balance2;
        this.balance3 = member.balance3;
        this.balance4 = member.balance4;
        this.balance5 = member.balance5;
        this.balance6 = member.balance6;
        this.balance7 = member.balance7;
        this.balance8 = member.balance8;
        this.balance9 = member.balance9;
        this.balance10 = member.balance10;
        this.balance11 = member.balance11;
        this.balance12 = member.balance12;
        this.balance13 = member.balance13;
        this.balance14 = member.balance14;
        this.unused = member.unused;

        this.balances = {
            balance0: this.balance0,
            balance1: this.balance1,
            balance2: this.balance2,
            balance3: this.balance3,
            balance4: this.balance4,
            balance5: this.balance5,
            balance6: this.balance6,
            balance7: this.balance7,
            balance8: this.balance8,
            balance9: this.balance9,
            balance10: this.balance10,
            balance11: this.balance11,
            balance12: this.balance12,
            balance13: this.balance13,
            balance14: this.balance14,
        }
    }

    getTonBalance(): bigint {
        return this.balance0;
    }

    getCurrencyBalance(currency: Currency): bigint {
        return this.balances[currency.balanceKey];
    }
}