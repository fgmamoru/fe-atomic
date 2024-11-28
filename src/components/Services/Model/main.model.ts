import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, fromNano, OpenedContract, toNano, TonClient4 } from '@ton/ton'
import { TonConnectUI } from '@tonconnect/ui'
import { maxAmountToStake } from '../ton-comms/Helpers'
import { Treasury, TreasuryConfig, Times } from '../ton-comms/Treasury'
import { Wallet } from '../ton-comms/Wallet'
import { create } from 'zustand';
import { AtomicPoolCurrencyMapItem, Currency, ExchangeRateKey, ExpandedAtomicPool, UnstakeType } from '@/types'
import { formatCryptoAmount, formatPercent } from '@/utils'
import { NETWORK, TREASURY_CONTRACT_ADDR } from '@/services/config.service'
import { AtomicDex, AtomicPool } from '@/services/AtomicDex/AtomicDex.service'
import { currencyMapping, getSwapCurrencies, SwapService } from '@/services/swap/swap.service'

type ActiveTab = 'stake' | 'unstake';
const atomicDex = AtomicDex.fromAddress(Address.parse("EQCANtHMd-perMjM3Tk2xKoDkD3BN_CiJaGu4kqKcHmm4sdP"))

type ModelType = {
    loadTonBalance(): unknown
    connectWallet: () => void
    onConnectWallet: (wallet: string) => void
    onDisconnectWallet: () => void
    TONToUSD: number,
    wallet: OpenedContract<Wallet> | undefined,
    inited: boolean,
    init: (client: TonConnectUI) => void,
    network: Network,
    tonClient?: TonClient4,
    address?: Address
    tonBalance?: bigint
    treasury?: OpenedContract<Treasury>
    treasuryState?: TreasuryConfig
    times?: Times
    activeTab: ActiveTab
    unstakeType: UnstakeType
    amount: string
    waitForTransaction: WaitForTransaction
    ongoingRequests: number
    errorMessage: string
    isInputInvalid: () => boolean
    _networkUrl?: string

    // unobserved state
    tonConnectUI?: TonConnectUI
    lastBlock: number
    timeoutConnectTonAccess?: ReturnType<typeof setTimeout>
    timeoutReadTimes?: ReturnType<typeof setTimeout>
    timeoutReadLastBlock?: ReturnType<typeof setTimeout>
    timeoutErrorMessage?: ReturnType<typeof setTimeout>

    readLastBlock: () => void
    beginRequest: () => void
    endRequest: () => void
    setActiveTab: (activeTab: ActiveTab) => void
    setUnstakeType: (unstakeType: UnstakeType) => void
    // setAmount: (amount: string) => void
    isStakeTabActive: () => boolean
    maxAmount: () => bigint
    maxAmountInTon: () => number
    isMainnet: () => boolean
    setAmount: (amount: string) => void
    setAmountToMax: () => void
    tonBalanceFormatted: () => string | undefined
    tonBalanceInUsd: () => number
    amountInNano: () => bigint | undefined
    isAmountValid: () => boolean
    isAmountPositive: () => boolean
    getErrorMessage: () => string

    youWillReceiveFormatted: () => string
    youWillReceive: () => string
    exchangeRate: () => number;
    exchangeRateFormatted: () => string
    exchangeRateInUsd: () => string
    apy: () => number | undefined
    apyFormatted: () => string | undefined
    currentlyStaked: () => string
    setWaitForTransaction: (wait: WaitForTransaction) => void
    checkIfBalanceChanged: (balance: bigint, walletStateBalance: bigint, retries: number) => void
    currentlyStakedInUsd: () => string
    getTonToUsd: () => void

    resultAmount: string;
    selectedFromCurrency: Currency;
    selectedToCurrency: Currency;
    currentExchangeRate: number;

    currencies: Set<Currency>;
    exchangeRateList: Record<ExchangeRateKey, number>;

    atomicDexContract?: OpenedContract<AtomicDex>;

    setFromCurrency: (currency: Currency) => void;
    setToCurrency: (currency: Currency) => void;
    switchCurrencies: () => void;
    isConnected: () => boolean
    executeSwapOrder: () => void
    readyToSwap: () => boolean
    pools: Record<string, ExpandedAtomicPool>,
    _swapService?: SwapService
};
type WaitForTransaction = 'no' | 'wait' | 'timeout' | 'done'



function NanoToTon(amount: bigint | number): number {
    return Number(amount) / 1000000000
}

function formatDate(date: Date): string {
    return date.toLocaleString(navigator.language, {
        weekday: 'short',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatNano(amount: bigint | number): string {
    return (Number(amount) / 1000000000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })
}

function tonToUsd(ton: number, exchangeRate: number) {
    return ton * exchangeRate
}



const _treasuryAddress = Address.parse(TREASURY_CONTRACT_ADDR)
// Set your referrer wallet address here to receive referral rewards.
const referrerAddress = '<REFERRER_WALLET_ADDRESS>'
const updateLastBlockDelay = 30 * 1000
const retryDelay = 6 * 1000
const checkBalanceChangeDelay = 6 * 1000
const txValidUntil = 5 * 60
const errorMessageTonAccess = 'Unable to access blockchain'
const errorMessageNetworkMismatch = 'Your wallet must be on '
const formattedZero = formatCryptoAmount(0);
export const useModel = create<ModelType>((set, get) => ({
    TONToUSD: 0,
    inited: false,
    network: NETWORK,
    _networkUrl: undefined,
    tonClient: undefined,
    address: undefined,
    tonBalance: undefined,
    treasury: undefined,
    treasuryState: undefined,
    times: undefined,
    walletAddress: undefined,
    walletFees: undefined,
    wallet: undefined,
    walletState: undefined,
    activeTab: 'stake',
    unstakeType: 'recommended',
    amount: '',
    waitForTransaction: 'no',
    ongoingRequests: 0,
    errorMessage: '',

    // unobserved state
    tonConnectUI: undefined,
    lastBlock: 0,
    timeoutConnectTonAccess: undefined,
    timeoutReadTimes: undefined,
    timeoutReadLastBlock: undefined,
    timeoutErrorMessage: undefined,
    _swapService: undefined,

    isInputInvalid: () => {
        return get().getErrorMessage() !== ""
    },

    getErrorMessage: () => {
        const amount = get().amount;

        if (!amount) {
            return ""
        }
        if (amount === "0") {
            return ""
        }

        if (!get().isAmountPositive()) {
            return "Amount must be positive"
        }
        if (!get().isAmountValid()) {
            return "Amount is invalid"
        }

        return ""
    },

    maxAmount() {
        // return maxAmountToStake(get().tonBalance ?? 0n)
        const isStakeTabActive = get().isStakeTabActive()
        const tonBalance = get().tonBalance
        return maxAmountToStake(tonBalance ?? 0n)

    },

    maxAmountInTon() {
        return Number(get().maxAmount()) / 1000000000
    },

    isMainnet() {
        return get().network === 'mainnet'
    },

    isStakeTabActive: () => {
        return get().activeTab === 'stake'
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

    setActiveTab: (activeTab: ActiveTab) => {
        if (get().activeTab !== activeTab) {
            set({ activeTab })
            set({ amount: '' })
        }
    },

    setUnstakeType: (unstakeType: UnstakeType) => {
        if (get().unstakeType !== unstakeType) {
            set({ unstakeType })
        }
    },

    setAmountToMax() {
        set({ amount: fromNano(get().maxAmount()) })
    },

    tonBalanceFormatted() {
        if (get().tonBalance != null) {
            return formatNano(get().tonBalance!) + ' TON'
        }
    },

    tonBalanceInUsd() {
        if (!get().tonBalance || !get().TONToUSD) {
            return 0
        }
        if (get().tonBalance != null) {
            const val = tonToUsd(Number(get().tonBalance!) / 1000000000, get().TONToUSD)
            return val
        }
        return 0
    },

    amountInNano() {
        const amount = get().amount.trim()
        try {
            return toNano(amount)
        } catch {
            return undefined
        }
    },

    isAmountValid(): boolean {
        const nano = get().amountInNano();
        return nano != null &&
            nano >= 0n &&
            (get().tonBalance == null || nano <= get().maxAmount())
    },

    isAmountPositive() {
        const nano = get().amountInNano();
        return nano != null && nano > 0n
    },

    youWillReceive(): string {
        const rate = get().exchangeRate();
        const nano = get().amountInNano();
        if (rate == null) {
            return formattedZero
        } else if (nano == null || !get().isAmountValid() || !get().isAmountPositive()) {
            return formattedZero
        } else {
            return formatNano(Number(nano) * rate)
        }
    },

    youWillReceiveFormatted() {
        const rate = get().exchangeRate();
        const nano = get().amountInNano();
        const isStakeTabActive = get().isStakeTabActive();
        if (rate == null) {
            return ''
        } else if (nano == null || !get().isAmountValid() || !get().isAmountPositive()) {
            return get().isStakeTabActive() ? 'mTON' : 'TON'
        } else {
            return `~ ${formatNano(Number(nano) * rate)} ${isStakeTabActive ? 'mTON' : 'TON'}`
        }
    },

    exchangeRate() {
        const state = get().treasuryState
        if (state != null) {
            if (get().isStakeTabActive()) {
                return Number(state.totalTokens) / Number(state.totalCoins) || 1
            } else {
                return Number(state.totalCoins) / Number(state.totalTokens) || 1
            }
        }

        return 0;
    },

    exchangeRateInUsd() {
        const state = get().treasuryState
        if (state != null) {
            const rate = get().exchangeRate()
            if (rate != 0) {
                const val = Number(state.totalCoins) / Number(state.totalTokens) || 1
                return tonToUsd(val, get().TONToUSD).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                })
            }
        }
        return ''
    },

    exchangeRateFormatted() {
        const state = get().treasuryState
        if (state != null) {
            const rate = Number(state.totalCoins) / Number(state.totalTokens) || 1
            return `~ ${rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} TON`
        }
        return ''
    },

    apy() {
        const times = get().times
        const lastStaked = get().treasuryState?.lastStaked
        const lastRecovered = get().treasuryState?.lastRecovered
        if (times != null && lastStaked != null && lastRecovered != null) {
            const duration = 2 * Number(times.nextRoundSince - times.currentRoundSince)
            const year = 365 * 24 * 60 * 60
            const compoundingFrequency = year / duration
            return Math.pow(Number(lastRecovered) / Number(lastStaked) || 1, compoundingFrequency) - 1
        }
    },

    apyFormatted() {
        if (get().apy != null) {
            return formatPercent(get().apy()! || 0)
        }

        return ''
    },

    currentlyStaked() {
        if (get().treasuryState != null) {
            return (
                (Number(get().treasuryState!.totalCoins) / 1000000000).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                }) + ' TON'
            )
        }

        return ''
    },

    currentlyStakedInUsd() {
        if (get().treasuryState != null) {
            const val = tonToUsd(Number(get().treasuryState!.totalCoins / 1000000000n), get().TONToUSD)

            return val.toLocaleString(undefined, {
                maximumFractionDigits: 0,
            })
        }

        return "0"
    },

    setWaitForTransaction: (wait: WaitForTransaction) => {
        set({ waitForTransaction: wait })
    },

    checkIfBalanceChanged: (balance: bigint, walletStateBalance: bigint, retries: number) => {
    },

    resultAmount: "",
    pools: {},

    selectedFromCurrency: currencyMapping.TON,
    selectedToCurrency: currencyMapping.USDT,
    currentExchangeRate: 1,
    currencies: new Set<Currency>(),
    exchangeRateList: {} as Record<ExchangeRateKey, number>,

    setAmount: (amount: string) => {
        // remove non-numeric characters and replace comma with dot
        const formatted = amount
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
            .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
            .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

        const amountInNano = toNano(formatted);

        const resultAmount = get()._swapService!.calculateExpectedOut(
            amountInNano,
            0,
            0n,
            1n
        )

        set({
            amount: formatted,
            resultAmount: NanoToTon(resultAmount).toFixed(2),
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

    switchCurrencies: () => {
        get().setFromCurrency(get().selectedToCurrency)
    },

    init: async (tonConnectUI: TonConnectUI) => {
        if (get().inited) return;
        set({ inited: true });
        const url = await getHttpV4Endpoint({
            network: get().network,
        });

        set({ _networkUrl: url })

        const tonClient = new TonClient4({ endpoint: url });
        const atomicDexContract = tonClient.open(atomicDex);
        const swapService = new SwapService(tonClient);

        get().getTonToUsd();

        set({
            tonConnectUI,
            tonClient,
            inited: true,
            atomicDexContract,
            _swapService: swapService,
        });

        swapService.getPoolList()
            .then((pools) => set({ pools }))
            .then(() => {
                const { pools } = get();
                const currencies = getSwapCurrencies(pools);
                set({ currencies: currencies });
            })

        get().connectWallet();
    },

    readLastBlock: async () => {
        const tonClient = get().tonClient!
        const address = get().address

        const lastBlockSeqNo = (await tonClient.getLastBlock()).last.seqno;
        const wallet = tonClient.openAt(lastBlockSeqNo, Wallet.createFromAddress(get().address as Address));

        address == null
            ? Promise.resolve(0n)
            : tonClient.getAccountLite(lastBlockSeqNo, address)
                .then((value) => {
                    set({ tonBalance: BigInt(value.account.balance.coins) })
                })


        set({
            wallet,
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
            const lastBlock = (await tonClient.getLastBlock()).last.seqno
            const value = await tonClient.getAccountLite(lastBlock, address)
            set({ tonBalance: BigInt(value.account.balance.coins) })
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

    isConnected() {
        return get().address != null
    },

    executeSwapOrder: async () => {
        // process
        get()._swapService!.executeSwap(
            {
                from: get().selectedFromCurrency,
                to: get().selectedToCurrency,
                value: get().amount,
                poolId: 0,
                publicKey: get().tonConnectUI?.account?.publicKey!,
                tonConnectUi: get().tonConnectUI!,
            }
        );

        // final state
        get().setAmount("");
    },

    getSignature: async () => {
        // const seq =
        //     get()._swapService!.getHashToSign(

        //     )
    },

    readyToSwap: () => {
        // if (!get().isConnected()) return false;
        if (parseFloat(get().amount) === 0) return false;
        if (Number.isNaN(parseFloat(get().amount))) return false;
        // if (get().tonBalance === undefined) return false;

        return true;
    },

    getSwapInputError: () => {
        if (get().amount === '') return '';
        if (!get().isConnected()) return 'Please connect your wallet';
        if (parseFloat(get().amount) === 0) return 'Amount must be greater than 0';
        if (Number.isNaN(parseFloat(get().amount))) return 'Amount must be a valid number';

        return '';
    },
}))