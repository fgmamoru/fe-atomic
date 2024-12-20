import { AtomicDex, AtomicMemberRecord } from "@/services/AtomicDex/AtomicDex.service";
import { DEFAULT_CURRENCIES, DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";
import { Currency, CurrencyBalanceKeyName } from "@/types";
import { OpenedContract } from "@ton/core";

export class AtomicMemberRecordModel {
    $$type: "AtomicMemberRecord";
    id: bigint;
    seq: bigint;
    unused: bigint;
    private balances: Record<CurrencyBalanceKeyName, bigint> & { balance0: bigint; balance1: bigint; balance2: bigint; balance3: bigint; balance4: bigint; balance5: bigint; balance6: bigint; balance7: bigint; balance8: bigint; balance9: bigint; balance10: bigint; balance11: bigint; balance12: bigint; balance13: bigint; balance14: bigint; };

    constructor(
        member: AtomicMemberRecord,
        private readonly contract: OpenedContract<AtomicDex>,
        private readonly publicKey: bigint) {
        this.$$type = "AtomicMemberRecord";
        this.id = member.id;
        this.seq = member.seq;
        this.unused = member.unused;

        this.balances = {
            balance0: member.balance0,
            balance1: member.balance1,
            balance2: member.balance2,
            balance3: member.balance3,
            balance4: member.balance4,
            balance5: member.balance5,
            balance6: member.balance6,
            balance7: member.balance7,
            balance8: member.balance8,
            balance9: member.balance9,
            balance10: member.balance10,
            balance11: member.balance11,
            balance12: member.balance12,
            balance13: member.balance13,
            balance14: member.balance14,
        }
    }

    public getTonBalance(): bigint {
        return this.balances.balance0;
    }

    public getCurrencyBalance(currency: Currency): bigint {
        return this.balances[currency.balanceKey];
    }

    /**
     * Starts pooling for updates in balances until it founds a change
     */
    public poolForUpdates(): Promise<AtomicMemberRecordModel> {
        return new Promise((resolve, reject) => {
            const pool = () => {
                this.contract.getAtomicMemberRecord(this.publicKey).then((member) => {
                    if (this.seq !== member!.seq) {
                        this.reset(member!)
                        resolve(new AtomicMemberRecordModel(member!, this.contract, this.publicKey));
                    } else {
                        setTimeout(pool, 2000);
                    }
                }).catch(reject);
            }

            pool();
        });
    }

    public async executeDeposit(amount: bigint): Promise<AtomicMemberRecordModel> {
        console.log("Executing deposit of", amount);
        await delay(3000);
        this.changeBalance(DEFAULT_CURRENCIES_MAP["TON"], -amount);
        return this;
    }

    /**
     * Apply the changes of an swap to the balances.
     * Used for optimistic Updates
     */
    public applySwap(currencyIn: Currency, currencyOut: Currency, amountIn: bigint, amountOut: bigint) {
        this.changeBalance(currencyIn, -amountIn);
        this.changeBalance(currencyOut, amountOut);
    }

    private reset(
        member: AtomicMemberRecord
    ) {
        this.$$type = "AtomicMemberRecord";
        this.id = member.id;
        this.seq = member.seq;
        this.unused = member.unused;

        this.balances = {
            balance0: member.balance0,
            balance1: member.balance1,
            balance2: member.balance2,
            balance3: member.balance3,
            balance4: member.balance4,
            balance5: member.balance5,
            balance6: member.balance6,
            balance7: member.balance7,
            balance8: member.balance8,
            balance9: member.balance9,
            balance10: member.balance10,
            balance11: member.balance11,
            balance12: member.balance12,
            balance13: member.balance13,
            balance14: member.balance14,
        }
    }

    private changeBalance(currency: Currency, change: bigint) {
        this.balances[currency.balanceKey] += change;
    }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));