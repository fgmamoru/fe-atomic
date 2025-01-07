import { Currency } from "@/types";

export const DEFAULT_CURRENCIES: Currency[] = [{
    name: 'TonCoin',
    symbol: 'TON',
    icon: '/icons/ton.svg',
    id: 0n,
    balanceKey: 'balance0',
    jettonMasterAddress: "0:226E80C4BFFA91ADC11DAD87706D52CD397047C128456ED2866D0549D8E2B162"
}, {
    name: 'USD Tether',
    symbol: 'USDT',
    icon: '/icons/tether.svg',
    id: 1n,
    balanceKey: 'balance1',
    jettonMasterAddress: "0:5086F95408651E5658E82C77B157A4BD00D24B97565CDB50E88E497DE04F27C6"
}, {
    name: 'DOGS',
    symbol: 'DOGS',
    icon: '/coins/dogs.png',
    id: 2n,
    balanceKey: 'balance2',
    jettonMasterAddress: "0:79D7D0B72171600ABE2A2A3E90AED681F4F9B749AC2BF86A27968DCED1C28BFC"
}, {
    name: 'NOT',
    symbol: 'NOT',
    icon: '/coins/not.png',
    id: 3n,
    balanceKey: 'balance3',
    jettonMasterAddress: "0:CBBEC6689778EE672380546F2D5AC267B4EC5E11958469609B6D28D86A4429B9"
}, {
    name: 'Ton Cats',
    symbol: 'CATS',
    icon: '/coins/cats.png',
    id: 4n,
    balanceKey: 'balance4',
    jettonMasterAddress: "0:E677DAF3555647A2F7CD9502A4192C0D5B1A496CE1382B5275EEDFD964C6E72C"
},
]

export const DEFAULT_CURRENCIES_MAP: Record<string, Currency> = DEFAULT_CURRENCIES.reduce((acc: Record<string, Currency>, currency: Currency) => {
    acc[currency.symbol] = currency;
    return acc;
}, {})

export const DEFAULT_CURRENCIES_MAP_BY_ID: Record<string, Currency> = DEFAULT_CURRENCIES.reduce((acc: Record<string, Currency>, currency: Currency) => {
    acc[currency.id.toString()] = currency;
    return acc;
}, {})

export const TON_TX_VALID_UNTIL = 5 * 60;