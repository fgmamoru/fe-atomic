import { AtomicDex, AtomicMemberRecord } from "@/services/AtomicDex/AtomicDex.service";
import { DEFAULT_CURRENCIES, DEFAULT_CURRENCIES_MAP } from "@/services/Defaults";
import { Currency, CurrencyBalanceKeyName } from "@/types";
import { TimeoutError } from "@/types/errors";
import { OpenedContract } from "@ton/core";
import debug from "debug";

type BalanceMap = Record<CurrencyBalanceKeyName, bigint> & { balance0: bigint; balance1: bigint; balance2: bigint; balance3: bigint; balance4: bigint; balance5: bigint; balance6: bigint; balance7: bigint; balance8: bigint; balance9: bigint; balance10: bigint; balance11: bigint; balance12: bigint; balance13: bigint; balance14: bigint; };

export class AtomicMemberRecordModel {
    $$type: "AtomicMemberRecord";
    id: bigint;
    seq: bigint;
    unused: bigint;
    private balances: BalanceMap;
    private positiveBalances: Map<Currency, bigint> = new Map();
    private readonly debugLog: debug.Debugger;

    constructor(
        member: AtomicMemberRecord,
        private readonly contract: OpenedContract<AtomicDex>,
        private readonly publicKey: bigint) {
        this.debugLog = debug("app:AtomicMemberRecordModel");
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

        for (const currency of DEFAULT_CURRENCIES) {
            const balance = this.balances[currency.balanceKey];
            if (balance > 0n) {
                this.positiveBalances.set(currency, balance);
            }
        }
    }

    static createPlaceholder(
        contract: OpenedContract<AtomicDex>,
        publicKey: bigint
    ) {
        return new AtomicMemberRecordModel({
            $$type: "AtomicMemberRecord",
            balance0: 0n,
            balance1: 0n,
            balance2: 0n,
            balance3: 0n,
            balance4: 0n,
            balance5: 0n,
            balance6: 0n,
            balance7: 0n,
            balance8: 0n,
            balance9: 0n,
            balance10: 0n,
            balance11: 0n,
            balance12: 0n,
            balance13: 0n,
            balance14: 0n,
            id: 0n,
            seq: 0n,
            unused: 0n,
        },
            contract,
            publicKey);
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
    public poolForUpdates(checkBalance = false, timeoutMs: number = 100000): Promise<AtomicMemberRecordModel> {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const pool = () => {
                this.contract.getAtomicMemberRecord(this.publicKey).then((member) => {

                    if (Date.now() - start > timeoutMs) {
                        this.debugLog("Timeout reached");
                        reject(
                            new TimeoutError("Timeout reached")
                        );
                        return;
                    }

                    if (!member) {
                        this.debugLog("Member not found, retrying");
                        setTimeout(pool, 2000);
                        return;
                    }

                    this.debugLog("Pooling for updates in balances", member);

                    if (this.seq !== member!.seq) {
                        this.debugLog("Seq changed, updating balances");
                        this.reset(member!)
                        resolve(new AtomicMemberRecordModel(member!, this.contract, this.publicKey));
                    } else if (checkBalance && this.balanceChanged(member!)) {
                        this.debugLog("Balance changed, updating balances");
                        this.reset(member!);
                        resolve(new AtomicMemberRecordModel(member!, this.contract, this.publicKey));
                    } else {
                        setTimeout(pool, 2000);
                    }
                }).catch(reject);
            }

            pool();
        });
    }

    public applyDeposit(amount: bigint, currency: Currency): AtomicMemberRecordModel {
        this.changeBalance(currency, amount);
        return this.clone(this);
    }

    public getPositiveBalances(): Array<[Currency, bigint]> {
        return Array.from(this.positiveBalances.entries()).filter(([currency, balance]) => balance > 0n);
    }

    public havePositiveBalances(): boolean {
        return this.positiveBalances.size > 0;
    }

    public getPortfolioValueInUsd(exchangeRates: Record<string, string>): number {
        let total = 0;

        for (const [currency, balance] of this.positiveBalances) {
            const rate = exchangeRates[`${currency.symbol}USDT`];
            if (!balance) {
                continue;
            }
            if (currency === DEFAULT_CURRENCIES_MAP.USDT) {
                total += parseFloat(balance.toString()) / 1e9;
            }

            if (rate) {
                total += parseFloat(rate) * parseFloat(balance.toString()) / 1e9;
            }
        }
        return total;
    }

    /**
     * Apply the changes of an swap to the balances.
     * Used for optimistic Updates
     */
    public applySwap(currencyIn: Currency, currencyOut: Currency, amountIn: bigint, amountOut: bigint) {
        this.changeBalance(currencyIn, -amountIn);
        this.changeBalance(currencyOut, amountOut);

        return this.clone(this);
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

    private clone(
        member: AtomicMemberRecordModel,
    ): AtomicMemberRecordModel {
        const rebuildMember: AtomicMemberRecord = {
            $$type: "AtomicMemberRecord",
            balance0: member.balances.balance0,
            balance1: member.balances.balance1,
            balance2: member.balances.balance2,
            balance3: member.balances.balance3,
            balance4: member.balances.balance4,
            balance5: member.balances.balance5,
            balance6: member.balances.balance6,
            balance7: member.balances.balance7,
            balance8: member.balances.balance8,
            balance9: member.balances.balance9,
            balance10: member.balances.balance10,
            balance11: member.balances.balance11,
            balance12: member.balances.balance12,
            balance13: member.balances.balance13,
            balance14: member.balances.balance14,
            id: member.id,
            seq: member.seq,
            unused: member.unused,
        }

        return new AtomicMemberRecordModel(
            rebuildMember,
            this.contract,
            this.publicKey,
        );
    }

    private balanceChanged(
        balance: BalanceMap,
    ): boolean {
        for (const currency of DEFAULT_CURRENCIES) {
            this.debugLog("Checking balance", currency.balanceKey, balance[currency.balanceKey], this.balances[currency.balanceKey]);
            if (balance[currency.balanceKey] !== this.balances[currency.balanceKey]) {
                return true;
            }
        }

        return false;
    }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));