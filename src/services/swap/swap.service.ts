import { KeyPair, sign, sha256 } from '@ton/crypto';
import { Address, Builder, Dictionary, OpenedContract, TonClient4, toNano } from "@ton/ton";
import { ATOMIC_DEX_CONTRACT_ADDRESS } from "../config.service";
import { AtomicDex, AtomicPool, AtomicWallet, SwapOrder } from "../AtomicDex/AtomicDex.service";
import { AtomicPoolCurrencyMapItem, Currency, CurveTypes, ExpandedAtomicPool } from "@/types";
import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import debug from 'debug';
import { TonConnectUI } from '@tonconnect/ui-react';

const log = debug('app:swap-service');
// localStorage.debug = 'app:swap-service';

export const currencyMapping: Record<string, Currency> = {
    TON: {
        symbol: "TON",
        icon: "/icons/ton.svg",
        name: "TON",
        id: 0n,
    },
    USDT: {
        symbol: "USDT",
        icon: "/icons/tether.svg",
        name: "Tether",
        id: 1n,
    },
}

const AMPLIFICATION_FACTOR: bigint = 100n;


const replaceCurrenciesInMap = (map: Record<string, { token0: string, token1: string }>): Record<string, {
    token0: Currency,
    token1: Currency
}> => {
    const newMap: Record<string, {
        token0: Currency,
        token1: Currency
    }> = {};

    Object.keys(map).forEach(key => {
        newMap[key] = {
            token0: currencyMapping[map[key].token0],
            token1: currencyMapping[map[key].token1],
        }
    });

    return newMap;
}

const atomicPoolCurrencyMapping: Record<string, {
    token0: Currency,
    token1: Currency
}> = replaceCurrenciesInMap({
    "1": {
        token0: "TON",
        token1: "USDT",
    },
    "2": {
        token0: "TON",
        token1: "USDT",
    },
    "3": {
        token0: "TON",
        token1: "ETH",
    },
    "4": {
        token0: "TON",
        token1: "BTC",
    },
    "5": {
        token0: "ETH",
        token1: "USDT",
    },
    "6": {
        token0: "ETH",
        token1: "BTC",
    },
})

export class SwapService {
    private readonly atomicDex: AtomicDex;
    private readonly contract: OpenedContract<AtomicDex>;
    private readonly contractAddress: string;
    private pools?: Record<string, ExpandedAtomicPool>;


    constructor(private readonly client: TonClient4) {
        this.contractAddress = ATOMIC_DEX_CONTRACT_ADDRESS;
        this.atomicDex = AtomicDex.fromAddress(Address.parse(this.contractAddress));
        this.contract = client.open(this.atomicDex);
    }

    public async getPoolList(): Promise<Record<string, ExpandedAtomicPool>> {
        const pools: Dictionary<number, AtomicPool> = await this.contract.getAtomicPools();

        const poolKeys = pools.keys();

        const expandedPools = poolKeys.map((poolKey) => {
            const atomicPool = pools.get(poolKey);

            const mappedPool = atomicPoolCurrencyMapping[poolKey];

            return {
                ...atomicPool!,
                ...mappedPool,
                curveType: atomicPool?.curveType ? CurveTypes.Balanced : CurveTypes.Unbalanced,
            };
        });

        const map: Record<string, ExpandedAtomicPool> = {};



        expandedPools.forEach((pool, index) => {
            map[index] = {
                ...pool,
                $$type: "AtomicPool",
            };
        });

        this.pools = map;

        return map;
    }

    public async getAtomicWallets(): Promise<Record<string, AtomicWallet>> {
        const wallets = await this.contract.getAtomicWallets();

        const walletKeys = wallets.keys();

        const mappedWallets: Record<string, AtomicWallet> = {};

        walletKeys.forEach((key) => {
            const wallet = wallets.get(key);
            mappedWallets[key] = wallet!;
        });

        return mappedWallets;
    }

    public async executeSwap(params: {
        from: Currency, to: Currency, value: string, poolId: number, publicKey: string,
        tonConnectUi: TonConnectUI,

    }): Promise<any> {
        log("Executing swap");
        const { from, to, value, poolId } = params;

        // get member

        const member = await this.getMember(params.publicKey);
        log("Member", member);
        // if member is not found, create it in the swap operation, otherwise use the seq.
        const seq = member ? member.seq : 0n;

        // generate random queryId
        const queryId = this.getQueryId();
        const validUntil = this.getValidUntil();

        // get hash to sign
        const hashToSign = await this.getHashToSign(seq, {
            queryId,
            orders: [
                {
                    $$type: "SwapOrder",
                    atomicWallet0: BigInt(from.id),
                    atomicWallet1: BigInt(to.id),
                    expectedIn: BigInt(toNano(value)),
                    expectedOut: BigInt(0)
                }
            ],
            validUntil,
        })
        log("Hash to sign", hashToSign);

        params.tonConnectUi.account



    }

    public async getHashToSign(
        seq: bigint,
        swap: {
            queryId: bigint,
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        return await this.calculateMultiSwapHash(seq, swap);
    }

    private async calculateMultiSwapHash(
        seq: bigint,
        swap: {
            queryId: bigint,
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        return sha256(this.calculateMultiSwapSlice(seq, swap));
    }


    async sendMultiSwapOperation(
        publicKey: Buffer,
        atomicDex: SandboxContract<AtomicDex>,
        seq: bigint,
        swap: {
            queryId: bigint,
            publicKey: bigint,
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        // const signature = sign(

        //     publicKey,
        // );

        // return atomicDex.sendExternal(
        //     {
        //         $$type: 'MultiSwap',
        //         queryId: swap.queryId,
        //         publicKey: swap.publicKey,
        //         signature: new Builder().storeBuffer(signature, 64).endCell().asSlice(),
        //         orders: this.getMultiSwapOrdersSlice(swap.orders),
        //         validUntil: swap.validUntil,
        //     }
        // );
    }

    private calculateMultiSwapSlice(
        seq: bigint,
        swap: {
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        let slice = new Builder()
            .storeUint(seq, 32)
            .storeSlice(this.getMultiSwapOrdersSlice(swap.orders))
            .storeUint(swap.validUntil, 64)
            .asSlice();

        return slice.loadBuffer(12 + swap.orders.length * 17);
    }

    private getMultiSwapOrdersSlice(orders: Array<SwapOrder>) {
        if (orders.length > 6) {
            throw new Error("Cant hash more than 7 orders");
        }

        let builder = new Builder();

        for (const order of orders) {
            builder
                .storeUint(order.atomicWallet0, 4)
                .storeUint(order.atomicWallet1, 4)
                .storeUint(order.expectedIn, 64)
                .storeUint(order.expectedOut, 64)
        }

        return builder.asSlice();
    }

    private getMember(publicKey: string) {
        try {
            log("Getting member", `0x${publicKey}`);
            const publicKeyBigInt = BigInt(`0x${publicKey}`);
            log("Public key", publicKeyBigInt);
            return this.contract.getAtomicMemberRecord(
                publicKeyBigInt
            );
        } catch (error) {
            console.error(error);
        }

    }

    private getValidUntil(): bigint {
        return BigInt(new Date().getTime()) / 1000n + 3600n;
    }

    private getQueryId(): bigint {
        return BigInt(Math.floor(Math.random() * 1000000));
    }

    public calculateExpectedOut(
        expectedIn: bigint,
        poolId: number,
        fromWallet: bigint,
        toWallet: bigint,
    ): bigint {
        log("Calculating expected out of", expectedIn, "from", fromWallet, "to", toWallet, "pool", poolId);
        const pool = this.getAtomicPool(poolId);
        const poolReserve0 = pool.reserve0;
        const poolReserve1 = pool.reserve1;
        let origAtomicWallet0 = fromWallet;
        let origAtomicWallet1 = toWallet;
        let atomicWallet0 = origAtomicWallet0;
        let atomicWallet1 = origAtomicWallet1;

        // if (atomicWallet0 > atomicWallet1) {
        //     atomicWallet0 = atomicWallet1;
        //     atomicWallet1 = atomicWallet0;
        // }

        // let poolId = atomicWallet0 << 4 | atomicWallet1;

        // let pool = self.atomicPools.get(poolId);

        let atomicWallet0balance: bigint = pool.reserve0;
        let atomicWallet1balance: bigint = pool.reserve1;

        // if (atomicWallet0balance < expectedIn) {
        //     throw new Error("Not enough balance");
        // }

        let newReserve0 = 0n;
        let newReserve1 = 0n;
        let fees0 = 0n;
        let fees1 = 0n;
        let outputAmount = 0n;



        if (pool.curveType == CurveTypes.Unbalanced) {
            let amountWithFee = expectedIn * pool.feeNominator / pool.feeDenominator; // Deduct fee

            if (origAtomicWallet0 == atomicWallet0) {
                fees0 = expectedIn - amountWithFee;
                newReserve0 = pool.reserve0 + expectedIn;
                newReserve1 = pool.reserve1 - (pool.reserve1 * amountWithFee) / (pool.reserve0 + amountWithFee);

                outputAmount = pool.reserve1 - newReserve1;
            } else {
                fees1 = expectedIn - amountWithFee;
                newReserve1 = pool.reserve1 + expectedIn;
                newReserve0 = pool.reserve0 - (pool.reserve0 * amountWithFee) / (pool.reserve1 + amountWithFee);

                outputAmount = pool.reserve0 - newReserve0;
            }
        } else {
            let amountWithFee = expectedIn * pool.feeNominator / pool.feeDenominator;

            if (origAtomicWallet0 == atomicWallet0) {
                fees0 = expectedIn - amountWithFee;

                newReserve0 = pool.reserve0 + amountWithFee;

                let sumReserves = newReserve0 + pool.reserve1;
                let invariantD = this.calculateInvariantD(newReserve0, pool.reserve1);
                newReserve1 = sumReserves / 2n + AMPLIFICATION_FACTOR * invariantD / (4n * newReserve0);

                outputAmount = pool.reserve1 - newReserve1;
            } else {
                fees1 = expectedIn - amountWithFee;
                newReserve1 = pool.reserve1 + amountWithFee;
                newReserve0 = pool.reserve0 - (pool.reserve0 - pool.reserve1) / (pool.reserve1 + amountWithFee);
            }
        }
        log("Expected out", outputAmount);
        return outputAmount;
    }
    private calculateInvariantD(x: bigint, y: bigint): bigint {
        let sumXY = x + y;
        let productXY = x * y;

        // Apply amplification factor
        let D = (AMPLIFICATION_FACTOR * sumXY) + (productXY / AMPLIFICATION_FACTOR);

        return D;
    }

    private getAtomicPool(poolId: number): ExpandedAtomicPool {
        return this.pools![poolId] || this.pools!["0"];
    }
}



export const getSwapCurrencies = (map: Record<string, ExpandedAtomicPool>): Set<Currency> => {
    const currencies = new Set<Currency>();
    Object.values(map).forEach(pool => {
        if (currencyMapping[pool.token0.symbol]) {
            currencies.add(currencyMapping[pool.token0.symbol]);
        }
        if (currencyMapping[pool.token1.symbol]) {
            currencies.add(currencyMapping[pool.token1.symbol]);
        }
    });

    return currencies;
}

//     const txParams = await router.getSwapJettonToTonTxParams(_params);



//     return txParams;
// };

// export type SwapParams = {
//     userWalletAddress: string;
//     offerAmount: string;
//     minAskAmount: string;
// };