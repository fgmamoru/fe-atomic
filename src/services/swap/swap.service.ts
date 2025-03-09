import { sha256, signVerify } from '@ton/crypto';

import { Address, beginCell, Builder, Dictionary, OpenedContract, Sender, toNano, TonClient, TonClient4 } from "@ton/ton";
import { ATOMIC_DEX_CONTRACT_ADDRESS, NETWORK, TON_CENTER_API_URL } from "../config.service";
import { AtomicDex, AtomicPool, MultiSwapBackend, storeMultiSwapBackend, SwapOrder } from "../Wrappers/AtomicDex.wrapper";
import { Currency, CurveTypes } from "@/types";
import { SandboxContract } from '@ton/sandbox';
import debug from 'debug';
import { CHAIN, TonConnectUI } from '@tonconnect/ui-react';
import { DEFAULT_CURRENCIES_MAP, TON_TX_VALID_UNTIL } from '../Defaults';
import { AtomicVaultModel } from '@/models/Wallet/AtomicVault.model';
import { AtomicMemberRecordModel } from '@/models/AtomicMember.model';
import { PoolModel, Route } from '../Router';
import { JettonDefaultWalletContract } from '../Wrappers';
import { JettonTransfer } from '../Wrappers/tact_JettonDefaultWallet';
import { SampleJettonWallet } from '../Wrappers/tact_SampleJettonWallet';

const debugLog = debug('app:swap');

export class SwapService {
    private readonly atomicDex: AtomicDex;
    private readonly dexContract: OpenedContract<AtomicDex>;
    private readonly contractAddress: string;
    private orbsDexClientContract: OpenedContract<AtomicDex>;
    tonClient: TonClient;

    constructor(private readonly orbsClient: TonClient4, private readonly tonConnectUI: TonConnectUI) {
        this.contractAddress = ATOMIC_DEX_CONTRACT_ADDRESS;
        debugLog("Contract address", this.contractAddress);
        this.atomicDex = AtomicDex.fromAddress(Address.parse(this.contractAddress));
        const client = new TonClient({
            endpoint: `${TON_CENTER_API_URL}/api/v2/jsonRPC`,
        });
        this.tonClient = client;
        this.dexContract = client.open(this.atomicDex);
        this.orbsDexClientContract = orbsClient.open(this.atomicDex);
        this.tonConnectUI = tonConnectUI;
    }

    public async getPoolList(): Promise<Record<string, PoolModel>> {
        const log = debugLog.extend('#getPoolList')
        debugLog("Getting pool list");

        // @ts-ignore
        const pools: Dictionary<bigint, AtomicPool> = await this.orbsDexClientContract.getAtomicPools()


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

        debugLog("Pools", map);

        return map;
    }

    public async getAtomicVaults(): Promise<Record<string, AtomicVaultModel>> {
        const log = debugLog.extend('#getAtomicWallets')
        const wallets = await this.dexContract.getAtomicVaults();
        const walletKeys = wallets.keys();

        const mappedWallets: Record<string, AtomicVaultModel> = {};

        walletKeys.forEach((key, index) => {
            const wallet = wallets.get(key);
            mappedWallets[key.toString()] = new AtomicVaultModel(BigInt(index), wallet!);
        });

        debugLog("Atomic wallets", mappedWallets,);

        return mappedWallets;
    }

    public async executeSwap(params: {
        route: Route,
        amountIn: bigint,
        poolId: number,
        publicKey: string,
        tonConnectUi: TonConnectUI,
        authToken: string,
    }): Promise<void> {
        debugLog(`#Executing swap, from ${params.route.toString()}`);
        const orders = params.route.getSwapOrders(params.amountIn);

        // get member

        const member = await this.getMember(params.publicKey);
        const queryId = this.getQueryId();
        debugLog("Member", member);
        // if member is not found, create it in the swap operation, otherwise use the seq.
        const seq = member ? member.seq : 0n;

        // generate random queryId
        const po = this.getQueryId();
        const validUntil = this.getValidUntil();


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
        const signature = await this.signHash(hashToSign, params.authToken);
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

        await this.dexContract.sendExternal(op);
    }

    public async estimateSwapFee(params: {
        route: Route,
        amountIn: bigint,
        poolId: number,
        publicKey: string,
        tonConnectUi: TonConnectUI,
        authToken: string,
    }) {
        try {
            debugLog(`#Executing swap, from ${params.route.toString()}`);
            const orders = params.route.getSwapOrders(params.amountIn);

            // get member

            const member = await this.getMember(params.publicKey);
            const queryId = this.getQueryId();
            debugLog("Member", member);
            // if member is not found, create it in the swap operation, otherwise use the seq.
            const seq = member ? member.seq : 0n;

            // generate random queryId
            const po = this.getQueryId();
            const validUntil = this.getValidUntil();

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
            const signature = await this.signHash(hashToSign, params.authToken);
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

            const r = await this.tonClient.estimateExternalMessageFee(Address.parse(this.contractAddress), {
                body: beginCell().store(storeMultiSwapBackend(op)).endCell(),
                initCode: null,
                initData: null,
                ignoreSignature: false
            });

            return BigInt(r?.source_fees?.gas_fee || 0 + r?.source_fees?.fwd_fee || 0 + r?.source_fees?.storage_fee || 0);
        } catch (error) {
            // from testing...
            return 739200n + 2495029n + 12704400n;
        }

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

    async sendDepositOperation(args: {
        publicKey: string,
        jettonAmount: bigint,
        jettonMasterAddress: Address,
        jettonVaultAddress: Address,
        userJettonWalletAddress: Address,
        userAddress: Address,
    }) {
        const { jettonAmount, publicKey, jettonMasterAddress, jettonVaultAddress, userAddress, userJettonWalletAddress } = args
        const contract = this.tonClient.open(await SampleJettonWallet.fromInit(jettonMasterAddress, userAddress));
        const tx: JettonTransfer = {
            $$type: 'JettonTransfer',
            queryId: 0n,
            amount: jettonAmount,
            destination: jettonVaultAddress,
            responseDestination: userJettonWalletAddress,
            customPayload: null,
            forwardTonAmount: toNano("0.1"),
            forwardPayload: getPublicKeyAsSlice(publicKey),
        }

        await contract.send(
            this.getSender(),
            {
                value: toNano("0.5"),
                bounce: true,
            }, tx)
    }

    public async getMember(publicKey: string): Promise<AtomicMemberRecordModel | null> {
        try {
            debugLog("Getting member", `0x${publicKey}`);
            const publicKeyBigInt = BigInt(`0x${publicKey}`);
            debugLog("Public key", publicKeyBigInt);
            // when using toncenter client it doesnt work...
            const member = await this.orbsDexClientContract.getAtomicMemberRecord(
                publicKeyBigInt
            );

            if (!member) return null;

            return new AtomicMemberRecordModel(member, this.orbsDexClientContract, publicKeyBigInt);
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
                .storeUint(order.atomicVault0, 4)
                .storeUint(order.atomicVault1, 4)
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

    private async signHash(hash: Buffer, authToken: string) {
        const request = await fetch("/api/sign-swap", {
            method: "POST",
            body: JSON.stringify({
                hash: hash.toString("hex"),
                jwt: authToken,
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



function getPublicKeyAsSlice(pubKey: string) {
    return new Builder()
        .storeBuffer(Buffer.from(pubKey, 'hex'))
        .endCell()
        .asSlice()
}
