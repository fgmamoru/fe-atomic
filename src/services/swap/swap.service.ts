import { Address, TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import { ATOMIC_DEX_CONTRACT_ADDRESS } from "../config.service";
import { AtomicDex, AtomicPool } from "../AtomicDex/AtomicDex.service";
import { AtomicPoolCurrencyMapItem, Currency, ExpandedAtomicPool } from "@/types";

const atomicDex = AtomicDex.fromAddress(Address.parse(ATOMIC_DEX_CONTRACT_ADDRESS))

const client = new TonClient({
    endpoint: "http://49.12.86.187:8091/jsonRPC",
});

const atomicDexContract = client.open(atomicDex);

const atomicPoolMapping: Record<string, AtomicPoolCurrencyMapItem> = {
    "0": {
        token0: "TON",
        token1: "RED",
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

export const currencyMapping: Record<string, Currency> = {
    TON: {
        symbol: "TON",
        icon: "/icons/ton.svg",
        name: "TON Crystal",
    },
    RED: {
        symbol: "RED",
        icon: "/icons/ton.svg",
        name: "ton",
    },
    USDT: {
        symbol: "USDT",
        icon: "/icons/ton.svg",
        name: "Tether USD",
    },
    ETH: {
        symbol: "ETH",
        icon: "/icons/ton.svg",
        name: "Ethereum",
    },
    BTC: {
        symbol: "BTC",
        icon: "/icons/ton.svg",
        name: "Bitcoin",
    },
}

export const getPoolList = async (): Promise<Record<string, ExpandedAtomicPool>> => {
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
            reserve1: 800n,
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
                token0: atomicPoolMapping[key]?.token0,
                token1: atomicPoolMapping[key]?.token1,
            }
        }
    }, {} as Record<string, AtomicPool & { token0: string, token1: string }>)

    return pools;
}

export const getSwapCurrencies = (map: Record<string, ExpandedAtomicPool>): Set<Currency> => {
    const currencies = new Set<Currency>();

    Object.values(map).forEach(pool => {
        if (currencyMapping[pool.token0]) {
            currencies.add(currencyMapping[pool.token0]);
        }
        if (currencyMapping[pool.token1]) {
            currencies.add(currencyMapping[pool.token1]);
        }
    });

    return currencies;
}

export const getResultAmount = (from: Currency, to: Currency, pools: Record<string, ExpandedAtomicPool>, value: string): string => {
    const pool = Object.values(pools).find(pool => {
        return (pool.token0 === from.symbol && pool.token1 === to.symbol) || (pool.token1 === from.symbol && pool.token0 === to.symbol);
    });
    console.log(`pools`, pools);

    console.log(`pool`, pool);

    if (!pool) return "0.0";

    const parsedValue = parseFloat(value);
    let resultValue = 0;

    if (pool.token0 === from.symbol) {
        resultValue = (parsedValue * Number(pool.reserve1) / Number(pool.reserve0));
    }

    if (pool.token1 === from.symbol) {
        resultValue = (parsedValue * Number(pool.reserve0) / Number(pool.reserve1));
    }

    if (Number.isNaN(resultValue)) return "0.0";


    return resultValue.toFixed(2);
}
//     console.log(`params`, _params);

//     const txParams = await router.getSwapJettonToTonTxParams(_params);



//     return txParams;
// };

// export type SwapParams = {
//     userWalletAddress: string;
//     offerAmount: string;
//     minAskAmount: string;
// };