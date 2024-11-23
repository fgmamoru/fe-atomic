import { create } from 'zustand';
import { AtomicPoolCurrencyMapItem, Currency } from "@/types";
import { NETWORK } from "@/services/config.service";
import { Network } from "@orbs-network/ton-access";
import { Address, OpenedContract, TonClient4 } from "@ton/ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import { Wallet, WalletFees, WalletState } from "@/components/Services/ton-comms/Wallet";
import { AtomicDex, AtomicPool } from "@/services/AtomicDex/AtomicDex.service";
import { currencyMapping, getPoolList, getResultAmount, getSwapCurrencies } from "@/services/swap/swap.service";
import { getLastBlockSeqNo } from "@/services/ton.service";
import { parse } from 'path';


type ExchangeRateKey = `${string}-${string}`;
const NETWORK_MISMATCH_ERROR_MESSAGE = 'Your wallet must be on '

type Model = {
    amount: string;
    resultAmount: string;
    selectedFromCurrency: Currency;
    selectedToCurrency: Currency;
    currentExchangeRate: number;
    errorMessage: string;
    tonBalance: bigint | undefined;
    address?: Address

    currencies: Set<Currency>;
    exchangeRateList: Record<ExchangeRateKey, number>;
    TONToUSD: number;

    atomicDexContract?: OpenedContract<AtomicDex>;

    tonClient?: TonClient4,
    timeoutConnectTonAccess?: ReturnType<typeof setTimeout>
    timeoutReadTimes?: ReturnType<typeof setTimeout>
    timeoutReadLastBlock?: ReturnType<typeof setTimeout>
    timeoutErrorMessage?: ReturnType<typeof setTimeout>
    tonConnectUI?: TonConnectUI
    ongoingRequests: number
    network: Network,
    inited: boolean,
    walletAddress?: Address
    wallet?: OpenedContract<Wallet>
    walletState?: WalletState
    walletFees?: WalletFees

    setAmount: (amount: string) => void;
    setFromCurrency: (currency: Currency) => void;
    setToCurrency: (currency: Currency) => void;
    maxAmountInTon: () => string;
    setAmountToMax: () => void;
    switchCurrencies: () => void;
    init: (tonConnectUI: any) => void;
    connectWallet: () => void
    onConnectWallet: (wallet: string) => void
    onDisconnectWallet: () => void
    readLastBlock: () => void
    getTonToUsd: () => void
    loadTonBalance: () => void
    isMainnet: () => boolean
    isConnected: () => boolean
    executeSwapOrder: () => void
    readyToSwap: () => boolean
    pools: Record<string, AtomicPool & AtomicPoolCurrencyMapItem>,

}

const atomicDex = AtomicDex.fromAddress(Address.parse("EQCANtHMd-perMjM3Tk2xKoDkD3BN_CiJaGu4kqKcHmm4sdP"))

export const useSwapModel = create<Model>((set, get) => ({
    amount: "",
    resultAmount: "",
    tonClient: undefined,
    tonBalance: 0n,
    network: NETWORK,
    TONToUSD: 0,
    pools: {},

    errorMessage: "",
    selectedFromCurrency: currencyMapping.TON,
    selectedToCurrency: currencyMapping.USDT,
    currentExchangeRate: 1,
    currencies: new Set<Currency>(),
    exchangeRateList: {} as Record<ExchangeRateKey, number>,
    ongoingRequests: 0,
    inited: false,

    setAmount: (amount: string) => {
        // remove non-numeric characters and replace comma with dot
        const formatted = amount
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
            .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
            .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

        const resultAmount = getResultAmount(
            get().selectedFromCurrency,
            get().selectedToCurrency,
            get().pools,
            formatted,
            get().TONToUSD
        )

        set({
            amount: formatted,
            resultAmount: resultAmount,
        })
    },

    setFromCurrency: (currency: Currency) => {
        if (currency === get().selectedToCurrency) {
            set({ selectedToCurrency: get().selectedFromCurrency })
        }
        set({ selectedFromCurrency: currency })

        get().setAmount(get().amount)
    },
    setToCurrency: (currency: Currency) => {
        if (currency === get().selectedFromCurrency) {
            set({ selectedFromCurrency: get().selectedToCurrency })
        }
        set({ selectedToCurrency: currency })
        get().setAmount(get().amount)

    },
    maxAmountInTon: () => { return "0.0" },
    setAmountToMax: () => { },

    switchCurrencies: () => {
        get().setFromCurrency(get().selectedToCurrency)
    },

    init: async (tonConnectUI: TonConnectUI) => {
        if (get().inited) return;
        const tonClient = new TonClient4({ endpoint: 'http://49.12.86.187:8091/jsonRPC' });
        const atomicDexContract = tonClient.open(atomicDex);
        get().getTonToUsd();
        set({
            tonConnectUI,
            tonClient,
            inited: true,
            atomicDexContract,
        });
        // get().connectWallet();
        getPoolList()
            .then((pools) => set({ pools }))
            .then(() => {
                const { pools } = get();
                const currencies = getSwapCurrencies(pools);
                set({ currencies: currencies });
            })
            .then(() => {
                console.log('pool', get().pools)
                console.log('currencies', get().currencies)
            })
    },

    beginRequest: () => {
        set((state) => ({
            ongoingRequests: state.ongoingRequests + 1
        }))
    },

    endRequest: () => {
        set((state) => ({
            ongoingRequests: state.ongoingRequests - 1
        }))
    },

    readLastBlock: async () => {
        const tonClient = get().tonClient!
        const address = get().address

        const lastBlockSeqNo = await getLastBlockSeqNo();
        const wallet = tonClient.openAt(lastBlockSeqNo, Wallet.createFromAddress(get().address as Address));
        const walletStateP = wallet.getWalletState().catch(() => get().walletState);
        const walletFeesP = wallet.getWalletFees().catch(() => get().walletFees);
        9
        address == null
            ? Promise.resolve(0n)
            : tonClient.getAccountLite(lastBlockSeqNo, address)
                .then((value) => {
                    console.log('Setting up ton balance')
                    set({ tonBalance: BigInt(value.account.balance.coins) })
                })

        const [walletState, walletFees] = await Promise.all([walletStateP, walletFeesP])

        set({
            wallet,
            walletState,
            walletFees,
        })

    },

    loadTonBalance: async () => {
        const tonClient = get().tonClient
        const address = get().address
        if (tonClient == null || address == null) {
            set({ tonBalance: undefined })
            return
        }

        try {
            console.log('loadTonBalance')
            const lastBlock = (await tonClient.getLastBlock()).last.seqno
            const value = await tonClient.getAccountLite(lastBlock, address)
            set({ tonBalance: BigInt(value.account.balance.coins) })
            console.log('loadTonBalance done', value.account.balance.coins)
        } catch (err) {
            console.error(err)
            set({ tonBalance: undefined })
        }
    },

    connectWallet: () => {
        const { tonConnectUI } = get();
        if (tonConnectUI?.wallet) {
            set({
                address: Address.parseRaw(get().tonConnectUI!.wallet!.account.address),
                errorMessage: '',
            });
            get().onConnectWallet(get().tonConnectUI!.wallet!.account.address);
        }
        tonConnectUI!.onStatusChange((wallet) => {
            if (wallet) get().onConnectWallet(wallet.account.address);
            else get().onDisconnectWallet();
        })
    },

    onConnectWallet: (address: string) => {
        set({
            address: Address.parseRaw(address),
        })

        get().readLastBlock();
        get().getTonToUsd();
        get().loadTonBalance();

    },

    onDisconnectWallet: () => {
        set({
            address: undefined,
            tonBalance: undefined,
            // wallet: undefined,
            amount: '',
            // walletState: undefined,
            errorMessage: '',
        })
    },

    getTonToUsd: async () => {
        const url = "https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT"
        await fetch(url)
            .then((response) => response.json())
            .then((data) => data.price)
            .then((price) => set({ TONToUSD: parseFloat(price) }))
            .catch((error) => console.error('Error:', error))
    },
    isMainnet() {
        1
        return get().network === 'mainnet'
    },

    isConnected() {
        return get().address != null
    },

    executeSwapOrder: async () => {
        // const { amount, selectedFromCurrency, selectedToCurrency, atomicDexContract } = get();
        // const bIntAmount = BigInt(parseFloat(amount) * 1e9);
        // const order: SwapOrder = {
        //     $$type: 'SwapOrder',
        //     expectedIn: bIntAmount,
        //     expectedOut: bIntAmount,
        // };
        // const amountInNano = BigInt(parseFloat(amount) * 1e9);
        // const amountOutNano = await atomicDexContract!.sendExternal({
        //     $$type: 'MultiSwap',
        //     orders
        // })
        // console.log('Swapped', amountInNano, 'for', amountOutNano)
    },

    readyToSwap: () => {
        // if (!get().isConnected()) return false;
        if (parseFloat(get().amount) === 0) return false;
        if (Number.isNaN(parseFloat(get().amount))) return false;
        // if (get().tonBalance === undefined) return false;

        return true;
    },
}))