import { sha256, signVerify } from '@ton/crypto';

import { Address, Builder, Dictionary, OpenedContract, TonClient, TonClient4, beginCell, toNano } from "@ton/ton";
import { ATOMIC_DEX_CONTRACT_ADDRESS } from "../config.service";
import { AtomicDex, AtomicMemberRecord, AtomicPool, AtomicWallet, MultiSwapBackend, storeMultiSwapBackend, SwapOrder } from "../AtomicDex/AtomicDex.service";
import { AtomicPoolCurrencyMapItem, Currency, CurveTypes, ExpandedAtomicPool } from "@/types";
import { SandboxContract, TreasuryContract } from '@ton/sandbox';
import debug from 'debug';
import { TonConnectUI } from '@tonconnect/ui-react';
import { calculateExpectedOut } from '@/utils';
import { DEFAULT_CURRENCIES_MAP, DEFAULT_POOLS } from '../Defaults';
import { AtomicWalletModel } from '@/models/Wallet/AtomicWallet.model';

const debugLog = debug('app:swap')


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
            token0: DEFAULT_CURRENCIES_MAP[map[key].token0],
            token1: DEFAULT_CURRENCIES_MAP[map[key].token1],
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
    orbsClientContract: OpenedContract<AtomicDex>;

    constructor(private readonly orbsClient: TonClient4) {
        this.contractAddress = ATOMIC_DEX_CONTRACT_ADDRESS;
        console.log("Contract address", this.contractAddress);
        this.atomicDex = AtomicDex.fromAddress(Address.parse(this.contractAddress));
        const client = new TonClient({
            endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        });
        this.contract = client.open(this.atomicDex);
        this.orbsClientContract = orbsClient.open(this.atomicDex);


        // test hash 
        // const testSeq = 0n;
        // const testQueryId = 0n;
        // const testOrders = [
        //     {
        //         '$$type': 'SwapOrder' as const,
        //         atomicWallet0: 0n,
        //         atomicWallet1: 1n,
        //         expectedIn: 1000000000n,
        //         expectedOut: 99698n
        //     },
        //     {
        //         '$$type': 'SwapOrder' as const,
        //         atomicWallet0: 1n,
        //         atomicWallet1: 2n,
        //         expectedIn: 99698n,
        //         expectedOut: 9698n
        //     }
        // ]
        // const testValidUntil = 1734378563n;

        // this.calculateMultiSwapHash(0n, {
        //     orders: testOrders,
        //     validUntil: testValidUntil
        // }).then(async (hash) => {
        //     console.log("Test hash Hex", hash.toString('hex'));
        //     const signature = await this.signHash(hash);
        //     console.log("Test signature", signature.toString('hex'));
        //     const bagOfCell = beginCell().store(storeMultiSwapBackend({
        //         $$type: 'MultiSwapBackend' as const,
        //         orders: this.getMultiSwapOrdersSlice(testOrders),
        //         publicKey: 95507943845683944373555265613060783373093350692587861269939143848871139327873n,
        //         queryId: testQueryId,
        //         signature: new Builder().storeBuffer(signature, 64).endCell().asSlice(),
        //         validUntil: testValidUntil,
        //     })).endCell();

        //     console.log('bagOfCell', bagOfCell.toBoc().toString('hex'));

        // })
    }

    public async getPoolList(): Promise<Record<string, ExpandedAtomicPool>> {
        const log = debugLog.extend('#getPoolList')
        console.log("Getting pool list");
        // const map: Record<string, ExpandedAtomicPool> = {}
        // for (const pool in DEFAULT_POOLS) {
        //     map[pool] = {
        //         ...DEFAULT_POOLS[pool],
        //         $$type: "AtomicPool",
        //         contractId: (this.contractAddress),
        //     }
        // }

        // console.log("Pools", map);

        // this.pools = map;

        // return map;

        const pools: Dictionary<number, AtomicPool> = await this.orbsClientContract.getAtomicPools();

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
                contractId: (this.contractAddress),
            };
        });

        this.pools = map;

        console.log("Pools", map);

        return map;
    }

    public async getAtomicWallets(): Promise<Record<string, AtomicWalletModel>> {
        const log = debugLog.extend('#getAtomicWallets')


        const wallets = await this.contract.getAtomicWallets();
        const walletKeys = wallets.keys();

        const mappedWallets: Record<string, AtomicWalletModel> = {};

        walletKeys.forEach((key) => {
            const wallet = wallets.get(key);
            mappedWallets[key] = new AtomicWalletModel(wallet!);
        });

        console.log("Atomic wallets", mappedWallets,);

        return mappedWallets;
    }

    public async executeSwap(params: {
        from: Currency, to: Currency, inAmount: string, outAmount: string, poolId: number, publicKey: string,
        tonConnectUi: TonConnectUI,

    }): Promise<any> {
        console.log(`#Executing swap, from ${params.from.symbol} to ${params.to.symbol} inAmount ${params.inAmount} outAmount ${params.outAmount} poolId ${params.poolId} publicKey ${params.publicKey}`);
        const { from, to, inAmount, outAmount } = params;

        // get member

        const member = await this.getMember(params.publicKey);
        const queryId = this.getQueryId();
        console.log("Member", member);
        // if member is not found, create it in the swap operation, otherwise use the seq.
        const seq = member ? member.seq : 0n;

        // generate random queryId
        const po = this.getQueryId();
        const validUntil = this.getValidUntil();

        const orders = [{
            $$type: "SwapOrder" as const,
            atomicWallet0: BigInt(from.id),
            atomicWallet1: BigInt(to.id),
            expectedIn: toNano(inAmount),
            expectedOut: toNano(outAmount)
        }];

        console.log("Orders", orders);

        // get hash to sign
        const hashToSign = await this.getHashToSign(seq, {
            orders,
            validUntil,
        })
        console.log(seq, {

        })
        console.log("Hash to sign", hashToSign);
        console.log("Hash to sign length", hashToSign.length);

        // sign hash
        const signature = await this.signHash(hashToSign);
        console.log("Signature", signature);
        console.log("Signature length", signature.length);
        const isValid = this.verifySignature(signature, hashToSign);
        console.log("Is valid", isValid);

        // send swap operation
        console.log("Sending swap operation");
        console.log(`PUBLIC KEY ${params.publicKey}, ${BigInt(`0x${params.publicKey}`)}`);

        const op: MultiSwapBackend = {
            $$type: 'MultiSwapBackend' as const,
            queryId: queryId,
            // publicKey: BigInt(`${params.publicKey}`),
            publicKey: BigInt(`0x${params.publicKey}`),
            signature: new Builder()
                .storeBuffer(signature, 64).endCell().asSlice(),
            orders: this.getMultiSwapOrdersSlice(orders),
            validUntil: validUntil,
        }

        console.log("Operation", op);

        const r = await this.contract.sendExternal(
            op
        );
        console.log("Swap operation sent", r);

        return r;
    }

    public async getHashToSign(
        seq: bigint,
        swap: {
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        return await this.calculateMultiSwapHash(seq, swap);
    }

    private async calculateMultiSwapHash(
        seq: bigint,
        swap: {
            orders: Array<SwapOrder>,
            validUntil: bigint
        }
    ) {
        return sha256(this.calculateMultiSwapSlice(seq, swap));
    }

    private async signHash(hash: Buffer) {
        const request = await fetch("/api/sign-swap", {
            method: "POST",
            body: JSON.stringify({
                hash: hash.toString("hex")
            })
        })

        const response = await request.json();
        // create a 64  byte buffer from the signature

        return Buffer.from(response.signature, "hex");

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



    async sendPingOperation(
    ) {

        return this.contract.sendExternal(
            {
                $$type: 'Ping',
            }
        );
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

    public getMember(publicKey: string) {
        try {
            console.log("Getting member", `0x${publicKey}`);
            const publicKeyBigInt = BigInt(`0x${publicKey}`);
            console.log("Public key", publicKeyBigInt);
            // when using toncenter client it doesnt work...
            return this.orbsClientContract.getAtomicMemberRecord(
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
        console.log(`Calculating expected out of ${expectedIn} from ${fromWallet} to ${toWallet} pool ${poolId}`);
        const pool = this.getAtomicPool(poolId);
        return calculateExpectedOut(
            expectedIn,
            pool,
            fromWallet,
        )
    }


    private getAtomicPool(poolId: number): ExpandedAtomicPool {
        console.log("#getAtomicPool", poolId);
        return this.pools![poolId] || this.pools!["0"];
    }

    private verifySignature(signature: Buffer, hash: Buffer) {
        const publicKey = Buffer.from("97cc8dfc6c4344343fe902238604c418b9055229e89d2f07cfadc6df63f25da2", 'hex');
        return signVerify(hash, signature, publicKey);
    }
}

export const getSwapCurrencies = (map: Record<string, ExpandedAtomicPool>): Set<Currency> => {
    const currencies = new Set<Currency>();
    Object.values(map).forEach(pool => {
        currencies.add(pool.token0);
        currencies.add(pool.token1);
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