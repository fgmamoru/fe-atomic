import { Address, TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import { ATOMIC_DEX_CONTRACT_ADDRESS } from "../config.service";
import { AtomicDex, AtomicPool } from "../AtomicDex/AtomicDex.service";
import { AtomicPoolCurrencyMapItem } from "@/types";

const atomicDex = AtomicDex.fromAddress(Address.parse(ATOMIC_DEX_CONTRACT_ADDRESS))

const client = new TonClient({
    endpoint: "http://49.12.86.187:8091/jsonRPC",
});

const atomicDexContract = client.open(atomicDex);

const atomicPoolMapping: Record<string, AtomicPoolCurrencyMapItem> = {
    "0": {
        token0: "TON",
        token1: "MTON",
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
}

export const getPoolList = async (): Promise<Record<string, AtomicPool & AtomicPoolCurrencyMapItem>> => {
    const rawPools: Record<string, AtomicPool> = {
        "0": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "1": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "2": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "3": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "4": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "5": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
        "6": {
            $$type: "AtomicPool",
            collectedFees0: 0n,
            collectedFees1: 0n,
            curveType: 0n,
            feeDenominator: 0n,
            feeNominator: 0n,
            lpTokenSupply: 0n,
            reserve0: 1000n,
            reserve1: 1000n,
        },
    }

    const pools = Object.entries(rawPools).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [key]: {
                ...value,
                token0: atomicPoolMapping[key].token0,
                token1: atomicPoolMapping[key].token1,
            }
        }
    }, {} as Record<string, AtomicPool & { token0: string, token1: string }>)

    return pools;
}


// export const getSwapMTonToTonTxParameters = async (params: SwapParams) => {
//     const _params = {
//         userWalletAddress: params.userWalletAddress,
//         offerJettonAddress: MTON_ADDRESS,
//         offerAmount: toNano(params.offerAmount),
//         minAskAmount: toNano(params.minAskAmount),
//         proxyTon,
//         queryId: 12345,
//     }

//     console.log(`params`, _params);

//     const txParams = await router.getSwapJettonToTonTxParams(_params);



//     return txParams;
// };

// export type SwapParams = {
//     userWalletAddress: string;
//     offerAmount: string;
//     minAskAmount: string;
// };