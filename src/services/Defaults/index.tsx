import { Currency, CurveTypes, ExpandedAtomicPool } from "@/types";

export const DEFAULT_CURRENCIES: Currency[] = [{
    name: 'TonCoin',
    symbol: 'TON',
    icon: '/icons/ton.svg',
    id: 0n,
    balanceKey: 'balance0',
    jettonMasterAddress: "0:226E80C4BFFA91ADC11DAD87706D52CD397047C128456ED2866D0549D8E2B163"
}, {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
    id: 1n,
    balanceKey: 'balance1',
    jettonMasterAddress: "0:5086F95408651E5658E82C77B157A4BD00D24B97565CDB50E88E497DE04F27C6"
}, {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/ton.svg',
    id: 2n,
    balanceKey: 'balance2',
    jettonMasterAddress: "0:79D7D0B72171600ABE2A2A3E90AED681F4F9B749AC2BF86A27968DCED1C28BFC"
}, {
    name: 'USDC',
    symbol: 'USDC',
    icon: '/icons/ton.svg',
    id: 3n,
    balanceKey: 'balance3',
    jettonMasterAddress: "0:CBBEC6689778EE672380546F2D5AC267B4EC5E11958469609B6D28D86A4429B9"
}, {
    name: 'USD Tether',
    symbol: 'USDT',
    icon: '/icons/tether.svg',
    id: 4n,
    balanceKey: 'balance4',
    jettonMasterAddress: "0:E677DAF3555647A2F7CD9502A4192C0D5B1A496CE1382B5275EEDFD964C6E72C"
}, {
    name: 'ATONNIC',
    symbol: 'ATNN',
    icon: '/icons/ton.svg',
    id: 5n,
    balanceKey: 'balance5',
    jettonMasterAddress: "0:F80C50B836B08684101145D6505F42F5825A9D1622CD8C203420E4A8777AB1DE"
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