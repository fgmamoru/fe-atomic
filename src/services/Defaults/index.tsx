import { Currency } from "@/types";

export const DEFAULT_CURRENCIES: Currency[] = [{
    name: 'TonCoin',
    symbol: 'TON',
    icon: '/icons/ton.svg',
    id: 0n,
    balanceKey: 'balance0',
    jettonMasterAddress: "0:226E80C4BFFA91ADC11DAD87706D52CD397047C128456ED2866D0549D8E2B162",
    display: false,
}, {
    display: true,
    name: 'USD Tether',
    symbol: 'USDT',
    icon: '/icons/tether.svg',
    id: 1n,
    balanceKey: 'balance1',
    jettonMasterAddress: "0:d278951b820f3da13ce797ceb41f366fce3e37286efee163225d308b44148c94"
}, {
    display: false,
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/icons/bitcoin.svg',
    id: 2n,
    balanceKey: 'balance2',
    jettonMasterAddress: "0:d2d2129fa5d60d1f2f0cf9e73a1c09c5302ae1a1e90a3cca4f9ddd67786e124e"
}, {
    display: false,
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/ethereum.svg',
    id: 3n,
    balanceKey: 'balance3',
    jettonMasterAddress: "0:6b0097f6c44564fb200a2e91301a791cbe8d871eb7fa55a4bdac239c009c5b0a"
}, {
    display: true,
    name: 'DOGS',
    symbol: 'DOGS',
    icon: '/coins/dogs.png',
    id: 4n,
    balanceKey: 'balance2',
    jettonMasterAddress: "0:cb87f772e016542add4ccfe1ef84839c98b1099595e0d7687a472c256cb4bc42"
}, {
    display: true,
    name: 'NOT',
    symbol: 'NOT',
    icon: '/coins/not.png',
    id: 5n,
    balanceKey: 'balance3',
    jettonMasterAddress: "0:c3e72971d27be44ba80bcc44ca088ac11d80f9d720f6bb878b5ef5bd475f6c20"
}, {
    display: true,
    name: 'Ton Cats',
    symbol: 'CATS',
    icon: '/coins/cats.png',
    id: 6n,
    balanceKey: 'balance4',
    jettonMasterAddress: "0:884ebc287f7bec3d86673a495d38bc43678a5d396b0a1721589b87a6282ef451"
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