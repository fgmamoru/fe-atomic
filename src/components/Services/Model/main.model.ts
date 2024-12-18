import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, fromNano, OpenedContract, toNano, TonClient4 } from '@ton/ton'
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui'
import { maxAmountToStake } from '../ton-comms/Helpers'
import { Treasury, TreasuryConfig, Times } from '../ton-comms/Treasury'
import { Wallet } from '../ton-comms/Wallet'
import { create } from 'zustand';
import { Currency, ExpandedAtomicPool, RouteSpeed, UnstakeType } from '@/types'
import { formatCryptoAmount, formatCryptoAmountAbbr, formatPercent } from '@/utils'
import { ATOMIC_DEX_CONTRACT_ADDRESS, NETWORK, TREASURY_CONTRACT_ADDR } from '@/services/config.service'
import { AtomicDex } from '@/services/AtomicDex/AtomicDex.service'
import { getSwapCurrencies, SwapService } from '@/services/swap/swap.service'
import debug from 'debug'
import { DEFAULT_CURRENCIES } from '@/services/Defaults'
import { Route, router } from '@/services/Router'
import { AtomicWalletModel } from '@/models/Wallet/AtomicWallet.model'
import { toast } from "react-toastify";
import * as axios from 'axios';
import { AtomicMemberRecordModel } from '@/models/AtomicMember.model'

type ActiveTab = 'swap' | 'deposit' | 'withdraw';
const atomicDex = AtomicDex.fromAddress(Address.parse(ATOMIC_DEX_CONTRACT_ADDRESS))
const debugLog = debug('app:model')

// check if localStorage is defined
if (typeof localStorage !== 'undefined') {
    localStorage.debug = 'app:*'
}

type ModelType = {
    loadTonBalance(): unknown
    onConnectWallet: (wallet: ConnectedWallet) => void
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
    _exchangeRates: Record<string, string>

    _potentialRoutes: Route[],
    _selectedRoute: Route | null,

    _networkUrl?: string
    _getRoutes: () => void

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
    _maxAmountInNano: () => bigint
    getMaxAmountOfSelectedCurrency: () => number | bigint
    isMainnet: () => boolean
    setAmount: (amount: string) => void
    setAmountToMax: () => void
    tonBalanceFormatted: () => string | undefined
    tonBalanceInUsd: () => number
    amountInNano: () => bigint | undefined
    isAmountValid: () => boolean
    isAmountPositive: () => boolean
    getErrorMessage: () => string
    getExchange(amount: string, from: Currency, to: Currency): string
    getInUsd(amount: string, from: Currency): string

    apy: () => number | undefined
    apyFormatted: () => string | undefined
    currentlyStaked: () => string
    setWaitForTransaction: (wait: WaitForTransaction) => void
    checkIfBalanceChanged: (balance: bigint, walletStateBalance: bigint, retries: number) => void
    currentlyStakedInUsd: () => string

    resultAmount: string;
    selectedFromCurrency: Currency;
    selectedToCurrency: Currency;
    currentExchangeRate: number;

    currencies: Set<Currency>;
    _atomicDexContract?: OpenedContract<AtomicDex>;

    setFromCurrency: (currency: Currency) => void;
    setToCurrency: (currency: Currency) => void;
    switchCurrencies: () => void;
    isConnected: () => boolean
    executeSwapOrder: () => void
    readyToSwap: () => boolean
    isAtomicSpeedSwap: () => boolean
    pools: Record<string, ExpandedAtomicPool>,
    _swapService?: SwapService
    _fetchTonProofPayloadFromBackend: () => Promise<string>
    _initTonProofPayloadFromBackend: () => Promise<void>
    _initWallet: () => void
    _initRouting: () => void
    _atomicWallets: Record<string, AtomicWalletModel>,
    _initAtomicWallets: () => void,
    _memberRecord: AtomicMemberRecordModel | null,
    _initMemberRecord: () => void,
    _initExchangeRates: () => void,
    _maxAmountOfTonBalanceInNano: () => bigint,
    maxAmountOfTonBalanceInTon: () => number,

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
// @ts-ignore
export const useModel = create<ModelType>(((set, get) => ({
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
    activeTab: 'swap',
    unstakeType: 'recommended',
    amount: '',
    waitForTransaction: 'no',
    ongoingRequests: 0,
    errorMessage: '',
    _exchangeRates: {},

    // unobserved state
    tonConnectUI: undefined,
    lastBlock: 0,
    timeoutConnectTonAccess: undefined,
    timeoutReadTimes: undefined,
    timeoutReadLastBlock: undefined,
    timeoutErrorMessage: undefined,
    _swapService: undefined,
    _potentialRoutes: [],
    _atomicWallets: {},

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

    _maxAmountInNano(): bigint {
        if (get().activeTab === 'deposit') {
            return get()._maxAmountOfTonBalanceInNano()
        }
        const member = get()._memberRecord;

        if (member == null) {
            return 0n
        }

        const currency = get().selectedFromCurrency;

        if (currency == null) {
            return 0n
        }

        // @ts-ignore
        const balance = member.getCurrencyBalance(currency);

        if (!balance) {
            return 0n
        }

        return balance

    },

    getMaxAmountOfSelectedCurrency() {
        try {
            const member = get()._memberRecord;

            if (member == null) {
                return 0
            }

            const currency = get().selectedFromCurrency;

            if (currency == null) {
                return 0
            }

            // @ts-ignore
            const balance = member.getCurrencyBalance(currency)

            if (!balance) {
                return 0
            }

            return balance / 1000000000n
        } catch (error) {
            console.error(error)
            return 0
        }

    },


    isMainnet() {
        return get().network === 'mainnet'
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
        if (get().activeTab === 'deposit') {
            set({ amount: get().maxAmountOfTonBalanceInTon().toString() })
            return;
        }
        set({ amount: fromNano(get()._maxAmountInNano()) })
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
            (get().tonBalance == null || nano <= get()._maxAmountInNano())
    },

    isAmountPositive() {
        const nano = get().amountInNano();
        return nano != null && nano > 0n
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

    selectedFromCurrency: DEFAULT_CURRENCIES[0],
    selectedToCurrency: DEFAULT_CURRENCIES[1],
    currentExchangeRate: 1,
    currencies: new Set<Currency>(),

    setAmount: (amount: string) => {
        console.log('setAmount')
        const { _swapService, _maxAmountInNano } = get()
        // remove non-numeric characters and replace comma with dot
        const formatted = amount
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
            .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
            .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

        const amountInNano = toNano(formatted);

        if (amountInNano > _maxAmountInNano()) {
            set({
                errorMessage: `Not enough balance.`,
            })
        } else {
            set({
                errorMessage: '',
            })
        }
        set({ amount: formatted })

        const selectedRoute = router.getBestRouteFromRoutes(get()._potentialRoutes, get().amountInNano()!);
        console.log(`setAmount, potentialRoutes: ${get()._potentialRoutes}, selectedRoute: ${selectedRoute}`)
        set({ _selectedRoute: selectedRoute })

        if (selectedRoute == null) {
            set({
                errorMessage: 'No route found',
                resultAmount: '',
                amount: formatted,
            })
            return
        }

        const resultAmount = selectedRoute.getPrice(get().amountInNano()!);

        debug(`setAmount, amount: ${amount}, formatted: ${formatted}, amountInNano: ${amountInNano}, resultAmount: ${resultAmount}`)
        set({
            resultAmount: NanoToTon(resultAmount).toFixed(2),
        })
    },

    setFromCurrency: (currency: Currency) => {
        try {
            if (currency === get().selectedToCurrency) {
                set({ selectedToCurrency: get().selectedFromCurrency })
            }
            set({ selectedFromCurrency: currency })

            get().setAmount(get().amount)
            get()._getRoutes()
        } catch (error) {
            console.error(error)
        }


    },

    setToCurrency: (currency: Currency) => {
        try {
            if (currency === get().selectedFromCurrency) {
                set({ selectedFromCurrency: get().selectedToCurrency })
            }
            set({ selectedToCurrency: currency })
            get().setAmount(get().amount)
            get()._getRoutes()
        } catch (error) {
            console.error(error)
        }
    },

    _getRoutes: () => {
        console.log('_getRoutes')
        const { selectedFromCurrency, selectedToCurrency, amount } = get()
        const routes = router.getAllRoutes(selectedFromCurrency, selectedToCurrency);

        console.log(`_getRoutes, routes, ${routes.map((route) => route.toString() + '\n')}`)
        set({ _potentialRoutes: routes })
        const selectedRoute = router.getBestRouteFromRoutes(routes, get().amountInNano()!);
        set({ _selectedRoute: selectedRoute })
    },

    switchCurrencies: () => {
        get().setFromCurrency(get().selectedToCurrency)
    },

    init: async (tonConnectUI: TonConnectUI) => {
        get()._initExchangeRates()

        try {
            if (get().inited) return;
            console.log('init')

            set({ inited: true });
            const url = await getHttpV4Endpoint({
                network: get().network,
            });

            set({ _networkUrl: url })

            const tonClient = new TonClient4({ endpoint: url });
            const atomicDexContract = tonClient.open(atomicDex);
            const swapService = new SwapService(tonClient);

            set({
                tonConnectUI,
                tonClient,
                inited: true,
                _atomicDexContract: atomicDexContract,
                _swapService: swapService,
            });

            swapService.getPoolList()
                .then((pools) => set({ pools }))
                .then(() => {
                    const { pools } = get();
                    const currencies = getSwapCurrencies(pools);
                    set({ currencies: currencies });
                })

            get()._initWallet();
            get()._initTonProofPayloadFromBackend();
            get()._initRouting();
            get()._initAtomicWallets();
        } catch (error) {
            console.error(error)
        }

    },

    readLastBlock: async () => {
        console.log('readLastBlock')
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
        console.log('loadTonBalance')
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
            set({ tonBalance: undefined });
        }
    },

    _initWallet: () => {
        const { tonConnectUI, _initMemberRecord } = get();
        if (tonConnectUI?.wallet) {
            set({
                address: Address.parseRaw(get().tonConnectUI!.wallet!.account.address),
                errorMessage: '',
            });
            get().onConnectWallet(get().tonConnectUI!.wallet! as ConnectedWallet);
            _initMemberRecord();
        }
        tonConnectUI!.onStatusChange((wallet) => {
            if (wallet) get().onConnectWallet(wallet);
            else get().onDisconnectWallet();
        })
    },

    onConnectWallet: (wallet: ConnectedWallet) => {
        if (
            wallet.connectItems?.tonProof &&
            "proof" in wallet.connectItems.tonProof
        ) {
            console.log('onConnectWallet, handling proof', wallet.connectItems.tonProof.proof)
            get()._initMemberRecord();

            fetch('/api/check-proof', {
                body: JSON.stringify({
                    address: wallet.account.address,
                    network: get().network === 'mainnet' ? '-239' : 'c-3',
                    proof: {
                        ...wallet.connectItems.tonProof.proof,
                        state_init: "..."
                    }
                }),
                method: 'POST',
            })
                .then((response) => response.json())
        }

        try {
            set({
                address: Address.parseRaw(wallet.account.address),
            })
            get().readLastBlock();
            get().loadTonBalance();
            get()._initMemberRecord();
        } catch (error) {
            console.error(error)
        }


    },

    onDisconnectWallet: () => {
        console.log('onDisconnectWallet')
        set({
            address: undefined,
            tonBalance: undefined,
            // wallet: undefined,
            amount: '',
            // walletState: undefined,
            errorMessage: '',
        })
    },

    isConnected() {
        return get().address != null

    },

    executeSwapOrder: async () => {
        console.log('executeSwapOrder')
        try {
            if (!get().readyToSwap()) return;
            get().setWaitForTransaction('wait')
            get().beginRequest()
            console.log('executeSwapOrder, ready to swap', get()._swapService!.executeSwap)
            console.log(`amount: ${get().amount}, ${get().resultAmount}`)
            // process
            await get()._swapService!.executeSwap(
                {
                    from: get().selectedFromCurrency,
                    to: get().selectedToCurrency,
                    inAmount: get().amount,
                    outAmount: get().resultAmount,
                    publicKey: get().tonConnectUI?.account?.publicKey!,
                    tonConnectUi: get().tonConnectUI!,
                    poolId: 0,
                }
            );
            console.log('executeSwapOrder, swap executed')
            toast.success('Swap executed successfully')
        }
        catch (error) {
            console.error(error)

            set({
                errorMessage: 'Swap failed, please try again',
            });

            if (axios.isAxiosError(error)) {
                if ((error.response?.data?.error as string)?.includes("unhandled out-of-gas exception")) {

                    toast.error("Network out of gas, please try later", {
                        autoClose: 15000
                    });

                    return;
                }
            }

            toast.error('Swap failed, please try again', {
                autoClose: 15000
            })
        }
        finally {
            get().setWaitForTransaction('done')
            get().endRequest()
            get().setAmount("");
        }


        // final state
    },

    getSignature: async () => {
        // const seq =
        //     get()._swapService!.getHashToSign(

        //     )
    },

    readyToSwap: () => {
        // console.log('---readyToSwap')
        if (!get().isConnected()) return false;
        // console.log('readyToSwap, connected')
        if (Number.isNaN(parseFloat(get().amount))) return false;
        // console.log('readyToSwap, amount not Nan')
        if (parseFloat(get().amount) === 0) return false;
        // console.log('readyToSwap, amount positive')

        // if (get().tonBalance === undefined) return false;

        return true;
    },

    isAtomicSpeedSwap: () => {
        if (get().activeTab !== 'swap') return false;
        return get().readyToSwap() && get()._selectedRoute?.speed === RouteSpeed.Fast
    },

    getSwapInputError: () => {
        if (get().amount === '') return '';
        if (!get().isConnected()) return 'Please connect your wallet';
        if (parseFloat(get().amount) === 0) return 'Amount must be greater than 0';
        if (Number.isNaN(parseFloat(get().amount))) return 'Amount must be a valid number';

        return '';
    },

    _fetchTonProofPayloadFromBackend: async () => {

        const url = '/api/generate-payload';

        return fetch(url)
            .then((response) => response.json())
            .then((data) => data.payload)
            .catch((error) => console.error('Error:', error))
    },

    _initTonProofPayloadFromBackend: async () => {
        console.log('_initTonProofPayloadFromBackend')
        try {

            get().tonConnectUI!.setConnectRequestParameters({
                state: "loading"
            })
            const proof = await get()._fetchTonProofPayloadFromBackend();

            console.log("_initTonProofPayloadFromBackend, proof", proof)
            get().tonConnectUI!.setConnectRequestParameters({
                state: "ready",
                value: { tonProof: proof },
            })
        } catch (error) {
            console.error(error)
            get().tonConnectUI!.setConnectRequestParameters(null)
        }
    },

    _initRouting: () => {
        get()._getRoutes()
    },

    _initAtomicWallets: async () => {
        try {
            const { _swapService } = get();

            const atomicWallets = await _swapService!.getAtomicWallets();

            set({
                _atomicWallets: atomicWallets,
            });
        } catch (error) {

        }
    },

    _initMemberRecord: async () => {
        try {
            console.log('_initMemberRecord: getting member record')
            const { _swapService } = get();
            const _memberRecord = await _swapService!.getMember(get().tonConnectUI?.account?.publicKey!);

            console.log('memberRecord', _memberRecord);

            set({
                _memberRecord,
            });
        } catch (error) {
            console.error(error)
        }

    },

    _initExchangeRates: async () => {
        try {
            const url = "https://api.binance.com/api/v3/ticker/price"
            const response = await fetch(url);
            const data = await response.json();
            const price: { price: string, symbol: string }[] = data;

            const map: Record<string, string> = {}

            price.forEach((item) => {
                map[item.symbol] = item.price
            });

            set({
                _exchangeRates: map,
                TONToUSD: parseFloat(map['TONUSDT'])
            })
        } catch (error) {
            console.error(error)
        }
    },

    getExchange(amount: string, from: Currency, to: Currency): string {
        const rate = get()._exchangeRates[`${from.symbol}${to.symbol}`];

        return (parseFloat(amount) * parseFloat(rate)).toFixed(2)
    },

    getInUsd(amount: string, from: Currency): string {
        const rate = get()._exchangeRates[`${from.symbol}USDT`];
        console.log('rate', rate)
        console.log(get()._exchangeRates)
        return formatCryptoAmountAbbr(parseFloat(amount) * parseFloat(rate))
    },

    _maxAmountOfTonBalanceInNano() {
        const tonBalance = get().tonBalance
        return maxAmountToStake(tonBalance ?? 0n)
    },

    maxAmountOfTonBalanceInTon() {
        return Number(get()._maxAmountOfTonBalanceInNano()) / 1000000000
    },
})))

function isAxiosError(error: unknown) {
    throw new Error('Function not implemented.')
}
