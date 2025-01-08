import { sha256, signVerify } from '@ton/crypto';

import { Address, Builder, Dictionary, OpenedContract, Sender, TonClient, TonClient4, toNano } from "@ton/ton";
import { ATOMIC_DEX_CONTRACT_ADDRESS, NETWORK } from "../config.service";
import { AtomicDex, AtomicPool, MultiSwapBackend, SwapOrder } from "../AtomicDex/AtomicDex.service";
import { Currency, CurveTypes } from "@/types";
import { SandboxContract } from '@ton/sandbox';
import debug from 'debug';
import { CHAIN, TonConnectUI } from '@tonconnect/ui-react';
import { DEFAULT_CURRENCIES_MAP, TON_TX_VALID_UNTIL } from '../Defaults';
import { AtomicWalletModel } from '@/models/Wallet/AtomicWallet.model';
import { AtomicMemberRecordModel } from '@/models/AtomicMember.model';
import { PoolModel } from '../Router';

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

// const atomicPoolCurrencyMapping: Record<string, {
//     token0: Currency,
//     token1: Currency
// }> = replaceCurrenciesInMap({
//     "1": {
//         token0: "TON",
//         token1: "USDT",
//     },
//     "2": {
//         token0: "TON",
//         token1: "USDT",
//     },
//     "3": {
//         token0: "USDT",
//         token1: "NOT",
//     },
//     "4": {
//         token0: "USDT",
//         token1: "DOGS",
//     },
//     "5": {
//         token0: "TON",
//         token1: "NOT",
//     },
//     "6": {
//         token0: "TON",
//         token1: "DOGS",
//     },
//     "7": {
//         token0: "TON",
//         token1: "CATS",
//     },
// })

export class SwapService {
    private readonly atomicDex: AtomicDex;
    private readonly contract: OpenedContract<AtomicDex>;
    private readonly contractAddress: string;
    private pools?: Record<string, PoolModel>;
    private orbsClientContract: OpenedContract<AtomicDex>;

    constructor(private readonly orbsClient: TonClient4, private readonly tonConnectUI: TonConnectUI) {
        this.contractAddress = ATOMIC_DEX_CONTRACT_ADDRESS;
        debugLog("Contract address", this.contractAddress);
        this.atomicDex = AtomicDex.fromAddress(Address.parse(this.contractAddress));
        const client = new TonClient({
            endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        });
        this.contract = client.open(this.atomicDex);
        this.orbsClientContract = orbsClient.open(this.atomicDex);
        this.tonConnectUI = tonConnectUI;
    }

    public async getPoolList(): Promise<Record<string, PoolModel>> {
        const log = debugLog.extend('#getPoolList')
        debugLog("Getting pool list");

        // @ts-ignore
        const pools: Dictionary<bigint, AtomicPool> = await this.orbsClientContract.getAtomicPools()


        const poolKeys = pools.keys();

        debugLog("Pool keys", poolKeys);

        const expandedPools = poolKeys.map((poolKey) => {
            const atomicPool = pools.get(poolKey);

            // const mappedPool = atomicPoolCurrencyMapping[poolKey.toString()];

            return {
                ...atomicPool!,
                // ...mappedPool,
                curveType: atomicPool?.curveType ? CurveTypes.Balanced : CurveTypes.Unbalanced,
                id: poolKey,
            };
        });

        const map: Record<string, PoolModel> = {};



        expandedPools.forEach((pool, index) => {
            map[index.toString()] = new PoolModel({
                ...pool,
                $$type: "AtomicPool",
                contractId: (this.contractAddress),
            });
        });

        this.pools = map;

        debugLog("Pools", map);

        return map;
    }

    public async getAtomicWallets(): Promise<Record<string, AtomicWalletModel>> {
        const log = debugLog.extend('#getAtomicWallets')


        const wallets = await this.contract.getAtomicWallets();
        const walletKeys = wallets.keys();

        const mappedWallets: Record<string, AtomicWalletModel> = {};

        walletKeys.forEach((key) => {
            const wallet = wallets.get(key);
            mappedWallets[key.toString()] = new AtomicWalletModel(wallet!);
        });

        debugLog("Atomic wallets", mappedWallets,);

        return mappedWallets;
    }

    public async executeSwap(params: {
        from: Currency, to: Currency, inAmount: string, outAmount: string, poolId: number, publicKey: string,
        tonConnectUi: TonConnectUI,

    }): Promise<any> {
        debugLog(`#Executing swap, from ${params.from.symbol} to ${params.to.symbol} inAmount ${params.inAmount} outAmount ${params.outAmount} poolId ${params.poolId} publicKey ${params.publicKey}`);
        const { from, to, inAmount, outAmount } = params;

        // get member

        const member = await this.getMember(params.publicKey);
        const queryId = this.getQueryId();
        debugLog("Member", member);
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

        debugLog("Orders", orders);

        // get hash to sign
        const hashToSign = await this.getHashToSign(seq, {
            orders,
            validUntil,
        })
        debugLog(seq, {

        })
        debugLog("Hash to sign", hashToSign);
        debugLog("Hash to sign length", hashToSign.length);

        // sign hash
        const signature = await this.signHash(hashToSign);
        debugLog("Signature", signature);
        debugLog("Signature length", signature.length);
        const isValid = this.verifySignature(signature, hashToSign);
        debugLog("Is valid", isValid);

        // send swap operation
        debugLog("Sending swap operation");
        debugLog(`PUBLIC KEY ${params.publicKey}, ${BigInt(`0x${params.publicKey}`)}`);

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

        debugLog("Operation", op);

        await this.contract.sendExternal(op);
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

    }

    async sendDepositOperation(publicKey: string, tonAmount: bigint, walletId: bigint,) {
        const publicKeyBigInt = BigInt(`0x${publicKey}`);

        await this.contract.send(
            this.getSender(),
            {
                value: tonAmount,
            },
            {
                $$type: 'DepositNotification' as const,
                amount: tonAmount,
                atomicWalletId: walletId,
                publicKey: publicKeyBigInt,
            }
        )
    }

    async sendJoinOperation(publicKey: string, tonAmount: bigint, walletId: bigint,) {
        const publicKeyBigInt = BigInt(`0x${publicKey}`);

        await this.contract.send(
            this.getSender(),
            {
                value: tonAmount,
            },
            {
                $$type: 'JoinMember' as const,
                amount: tonAmount,
                atomicWalletId: walletId,
                publicKey: publicKeyBigInt,
                eviction: Dictionary.empty<number, bigint>(),
                queryId: this.getQueryId(),
                seq: 0n,
            }
        )
    }

    public async getMember(publicKey: string): Promise<AtomicMemberRecordModel | null> {
        try {
            debugLog("Getting member", `0x${publicKey}`);
            const publicKeyBigInt = BigInt(`0x${publicKey}`);
            debugLog("Public key", publicKeyBigInt);
            // when using toncenter client it doesnt work...
            const member = await this.orbsClientContract.getAtomicMemberRecord(
                publicKeyBigInt
            );

            if (!member) return null;

            return new AtomicMemberRecordModel(member, this.orbsClientContract, publicKeyBigInt);
        } catch (error) {
            console.error(error);
            return null;
        }
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



    private getValidUntil(): bigint {
        return BigInt(new Date().getTime()) / 1000n + 3600n;
    }

    private getQueryId(): bigint {
        return BigInt(Math.floor(Math.random() * 1000000));
    }

    private verifySignature(signature: Buffer, hash: Buffer) {
        const publicKey = Buffer.from("97cc8dfc6c4344343fe902238604c418b9055229e89d2f07cfadc6df63f25da2", 'hex');
        return signVerify(hash, signature, publicKey);
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

    private getSender(): Sender {

        return {
            address: Address.parse(this.tonConnectUI.account?.address || ""),
            send: async (message) => {
                await this.tonConnectUI.sendTransaction({
                    messages: [{
                        address: this.contractAddress,
                        amount: message.value.toString(),
                        payload: message.body?.toBoc().toString('base64'),
                    }],
                    validUntil: TON_TX_VALID_UNTIL,
                    from: this.tonConnectUI.account?.address || "",
                    network: NETWORK === "testnet" ? CHAIN.TESTNET : CHAIN.MAINNET,
                })
            }
        }
    }
}

export const getSwapCurrencies = (map: Record<string, PoolModel>): Set<Currency> => {
    const currencies = new Set<Currency>();
    Object.values(map).forEach(pool => {
        currencies.add(pool.token0);
        currencies.add(pool.token1);
    });

    return currencies;
}
