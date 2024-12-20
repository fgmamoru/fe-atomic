import { Currency, CurveTypes, ExpandedAtomicPool } from "@/types";

export const DEFAULT_CURRENCIES: Currency[] = [{
    name: 'TonCoin',
    symbol: 'TON',
    icon: '/icons/ton.svg',
    id: 0n,
    balanceKey: 'balance0'
}, {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
    id: 1n,
    balanceKey: 'balance1'
}, {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/ton.svg',
    id: 2n,
    balanceKey: 'balance2'
}, {
    name: 'USDC',
    symbol: 'USDC',
    icon: '/icons/ton.svg',
    id: 3n,
    balanceKey: 'balance3'
}, {
    name: 'USD Tether',
    symbol: 'USDT',
    icon: '/icons/tether.svg',
    id: 4n,
    balanceKey: 'balance4'
}, {
    name: 'ATONNIC',
    symbol: 'ATNN',
    icon: '/icons/ton.svg',
    id: 5n,
    balanceKey: 'balance5'
}]

export const DEFAULT_CURRENCIES_MAP: Record<string, Currency> = DEFAULT_CURRENCIES.reduce((acc: Record<string, Currency>, currency: Currency) => {
    acc[currency.symbol] = currency;
    return acc;
}, {})


export const DEFAULT_POOLS: Array<ExpandedAtomicPool> = [{
    $$type: 'AtomicPool',
    collectedFees0: 0n,
    collectedFees1: 0n,
    curveType: CurveTypes.Unbalanced,
    feeDenominator: 1n,
    feeNominator: 1n,
    lpTokenSupply: 0n,
    reserve0: 10_000_000n * 1000000000n,
    reserve1: 10_000_000n * 1000000000n,
    token0: DEFAULT_CURRENCIES[0],
    token1: DEFAULT_CURRENCIES[1],
    contractId: '1',
}, {
    $$type: 'AtomicPool',
    collectedFees0: 0n,
    collectedFees1: 0n,
    curveType: CurveTypes.Unbalanced,
    feeDenominator: 1n,
    feeNominator: 1n,
    lpTokenSupply: 0n,
    reserve0: 10_000_000n * 1000000000n,
    reserve1: 10_000_000n * 1000000000n,
    token0: DEFAULT_CURRENCIES[0],
    token1: DEFAULT_CURRENCIES[2],
    contractId: '1',
}, {
    $$type: 'AtomicPool',
    collectedFees0: 0n,
    collectedFees1: 0n,
    curveType: CurveTypes.Unbalanced,
    feeDenominator: 1n,
    feeNominator: 1n,
    lpTokenSupply: 0n,
    reserve0: 10_000_000n * 1000000000n,
    reserve1: 10_000_000n * 1000000000n,
    token0: DEFAULT_CURRENCIES[0],
    token1: DEFAULT_CURRENCIES[3],
    contractId: '1',
}, {
    $$type: 'AtomicPool',
    collectedFees0: 0n,
    collectedFees1: 0n,
    curveType: CurveTypes.Unbalanced,
    feeDenominator: 1n,
    feeNominator: 1n,
    lpTokenSupply: 0n,
    reserve0: 10_000_000n * 1000000000n,
    reserve1: 10_000_000n * 1000000000n,
    token0: DEFAULT_CURRENCIES[0],
    token1: DEFAULT_CURRENCIES[4],
    contractId: '2',
}, {
    $$type: 'AtomicPool',
    collectedFees0: 0n,
    collectedFees1: 0n,
    curveType: CurveTypes.Unbalanced,
    feeDenominator: 1n,
    feeNominator: 1n,
    lpTokenSupply: 0n,
    reserve0: 10_000_000n * 1000000000n,
    reserve1: 10_000_000n * 1000000000n,
    token0: DEFAULT_CURRENCIES[0],
    token1: DEFAULT_CURRENCIES[5],
    contractId: '2',
}]

export const TON_TX_VALID_UNTIL = 5 * 60;