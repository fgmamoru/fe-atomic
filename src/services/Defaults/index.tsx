import { Currency } from "@/types";
import { CONFIG } from "../config.service";

export const DEFAULT_CURRENCIES: Currency[] = [{
    name: 'TonCoin',
    symbol: 'TON',
    icon: '/icons/ton.svg',
    id: 0n,
    balanceKey: 'balance0',
    jettonMasterAddress: CONFIG.TON_MASTER_CONTRACT_ADDRESS,
    display: false,
}, {
    display: true,
    name: 'USD Tether',
    symbol: 'USDT',
    icon: '/icons/tether.svg',
    id: 1n,
    balanceKey: 'balance1',
    jettonMasterAddress: CONFIG.USDT_MASTER_CONTRACT_ADDRESS
}, {
    display: false,
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/icons/bitcoin.svg',
    id: 2n,
    balanceKey: 'balance2',
    jettonMasterAddress: CONFIG.BTC_MASTER_CONTRACT_ADDRESS
}, {
    display: false,
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/ethereum.svg',
    id: 3n,
    balanceKey: 'balance3',
    jettonMasterAddress: CONFIG.ETH_MASTER_CONTRACT_ADDRESS
}, {
    display: true,
    name: 'DOGS',
    symbol: 'DOGS',
    icon: '/coins/dogs.png',
    id: 4n,
    balanceKey: 'balance2',
    jettonMasterAddress: CONFIG.DOGS_MASTER_CONTRACT_ADDRESS
}, {
    display: true,
    name: 'NOT',
    symbol: 'NOT',
    icon: '/coins/not.png',
    id: 5n,
    balanceKey: 'balance3',
    jettonMasterAddress: CONFIG.NOT_MASTER_CONTRACT_ADDRESS
}, {
    display: true,
    name: 'Ton Cats',
    symbol: 'CATS',
    icon: '/coins/cats.png',
    id: 6n,
    balanceKey: 'balance4',
    jettonMasterAddress: CONFIG.CATS_MASTER_CONTRACT_ADDRESS
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