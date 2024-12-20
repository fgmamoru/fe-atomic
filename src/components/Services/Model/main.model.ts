import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, fromNano, OpenedContract, toNano, TonClient4 } from '@ton/ton'
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui'
import { create } from 'zustand';
import { Currency, ExpandedAtomicPool, RouteSpeed, RequestStatus, UnstakeType, RequestType } from '@/types'
import { formatCryptoAmount, formatCryptoAmountAbbr, formatPercent } from '@/utils'
import { ATOMIC_DEX_CONTRACT_ADDRESS, NETWORK } from '@/services/config.service'
import { AtomicDex } from '@/services/AtomicDex/AtomicDex.service'
import { getSwapCurrencies, SwapService } from '@/services/swap/swap.service'
import debug from 'debug'
import { DEFAULT_CURRENCIES } from '@/services/Defaults'
import { Route, router } from '@/services/Router'
import { AtomicWalletModel } from '@/models/Wallet/AtomicWallet.model'
import { toast } from "react-toastify";
import * as axios from 'axios';
import { AtomicMemberRecordModel } from '@/models/AtomicMember.model'
import { bigIntClamp } from '@/utils/math'

type ActiveTab = 'swap' | 'deposit' | 'withdraw';
const atomicDex = AtomicDex.fromAddress(Address.parse(ATOMIC_DEX_CONTRACT_ADDRESS))
const debugLog = debug('app:model')

// check if localStorage is defined
if (typeof localStorage !== 'undefined') {
    localStorage.debug = 'app:*'
}

type ModelType = {
    requestType: RequestType,
    requestStatus: RequestStatus,
    loadTonBalance(): unknown
    onConnectWallet: (wallet: ConnectedWallet) => void
    onDisconnectWallet: () => void
    TONToUSD: number,
    inited: boolean,
    init: (client: TonConnectUI) => void,
    network: Network,
    tonClient?: TonClient4,
    address?: Address
    tonBalanceInNano: bigint
    activeTab: ActiveTab
    amount: string
    errorMessage: string
    _exchangeRates: Record<string, string>

    _potentialRoutes: Route[],
    _selectedRoute: Route | null,

    _networkUrl?: string
    _getRoutes: () => void

    // unobserved state
    tonConnectUI?: TonConnectUI

    readLastBlock: () => void
    setActiveTab: (activeTab: ActiveTab) => void
    _maxAmountInNano: () => bigint
    getMaxAmountOfSelectedCurrency: () => number | bigint
    setAmount: (amount: string) => void
    setAmountToMax: () => void
    tonBalanceFormatted: () => string | undefined
    tonBalanceInUsd: () => number
    amountInNano: () => bigint | undefined
    getExchange(amount: string, from: Currency, to: Currency): string
    getInUsd(amount: string, from: Currency): string


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
    executeDeposit: () => Promise<any>,

    readyToSwap: () => boolean
    isAtomicSpeedSwap: () => boolean
    pools: Record<string, ExpandedAtomicPool>,
    isSwapFromTonWallet: () => boolean
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
    _setResultAmount: (bigint: bigint) => void,
};

function NanoToTon(amount: bigint | number): number {
    return Number(amount) / 1000000000
}

function formatNano(amount: bigint | number): string {
    return (Number(amount) / 1000000000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })
}

function tonToUsd(ton: number, exchangeRate: number) {
    return ton * exchangeRate
}

export const useModel = create<ModelType>(((set, get) => ({
    requestStatus: RequestStatus.None,
    requestType: RequestType.None,
    TONToUSD: 0,
    inited: false,
    network: NETWORK,
    _networkUrl: undefined,
    tonClient: undefined,
    address: undefined,
    tonBalanceInNano: 0n,
    treasury: undefined,
    treasuryState: undefined,
    times: undefined,
    walletAddress: undefined,
    walletFees: undefined,
    wallet: undefined,
    walletState: undefined,
    activeTab: 'swap',
    amount: '',
    waitForTransaction: 'no',
    errorMessage: '',
    _exchangeRates: {},
    _memberRecord: null,
    _selectedRoute: null,


    // unobserved state
    tonConnectUI: undefined,
    _swapService: undefined,
    _potentialRoutes: [],
    _atomicWallets: {},
    resultAmount: "",
    pools: {},

    selectedFromCurrency: DEFAULT_CURRENCIES[0],
    selectedToCurrency: DEFAULT_CURRENCIES[1],
    currentExchangeRate: 1,
    currencies: new Set<Currency>(),

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

    setActiveTab: (activeTab: ActiveTab) => {
        if (get().activeTab !== activeTab) {
            set({ activeTab })
            set({ amount: '' })
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
        if (get().tonBalanceInNano) {
            return formatNano(get().tonBalanceInNano!) + ' TON'
        }
    },

    tonBalanceInUsd() {
        if (!get().tonBalanceInNano || !get().TONToUSD) {
            return 0
        }
        if (get().tonBalanceInNano != 0n) {

            const val = tonToUsd(Number(get().tonBalanceInNano!) / 1_000_000_000, get().TONToUSD)
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
                amount: formatted,
            })
            get()._setResultAmount(0n)
            return
        }

        const resultAmount = selectedRoute.getPrice(get().amountInNano()!);

        debug(`setAmount, amount: ${amount}, formatted: ${formatted}, amountInNano: ${amountInNano}, resultAmount: ${resultAmount}`)
        get()._setResultAmount(resultAmount)
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
            const swapService = new SwapService(tonClient, tonConnectUI);

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

        address == null
            ? Promise.resolve(0n)
            : tonClient.getAccountLite(lastBlockSeqNo, address)
                .then((value) => {
                    set({ tonBalanceInNano: BigInt(value.account.balance.coins) })
                })
    },

    loadTonBalance: async () => {
        console.log('loadTonBalance')
        const tonClient = get().tonClient
        const address = get().address
        if (tonClient == null || address == null) {
            set({ tonBalanceInNano: 0n })
            return
        }

        try {
            const lastBlock = (await tonClient.getLastBlock()).last.seqno
            const value = await tonClient.getAccountLite(lastBlock, address)
            set({ tonBalanceInNano: BigInt(value.account.balance.coins) })
        } catch (err) {
            set({ tonBalanceInNano: 0n });
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
            tonBalanceInNano: 0n,
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
        debugLog('executeSwapOrder')
        try {

            if (!get().readyToSwap()) return;
            set({ requestStatus: RequestStatus.Requested, requestType: RequestType.Swap })
            // get().setWaitForTransaction('wait')
            // get().beginRequest()
            debugLog('executeSwapOrder, ready to swap', get()._swapService!.executeSwap)
            debugLog(`amount: ${get().amount}, ${get().resultAmount}`)
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

            set({
                requestStatus: RequestStatus.WaitingForConfirmation,
            })

            const member = await get()._memberRecord!;
            member.applySwap(
                get().selectedFromCurrency,
                get().selectedToCurrency,
                get().amountInNano()!,
                toNano(get().resultAmount),
            )

            set({
                _memberRecord: member,
            })
            get().setAmount("");


            const newMember = await get()._memberRecord?.poolForUpdates();

            set({
                requestStatus: RequestStatus.Confirmed,
                _memberRecord: newMember,
            })

            console.log('executeSwapOrder, swap executed')
            toast.success('Swap executed successfully')
        }
        catch (error) {
            get().setAmount("");

            console.error(error)
            if (get().requestStatus === RequestStatus.WaitingForConfirmation) {
                // set({
                //     errorMessage: 'Swap Confirmation could not be performed',
                // });
                return;
            }
            else {
                set({
                    errorMessage: 'Swap failed, please try again',
                });
            }

            set({ requestStatus: RequestStatus.Failed })

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
            set({ requestStatus: RequestStatus.None, requestType: RequestType.None })
        }


        // final state
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
        return formatCryptoAmountAbbr(parseFloat(amount) * parseFloat(rate))
    },

    _maxAmountOfTonBalanceInNano() {
        const tonBalance = get().tonBalanceInNano
        return maxAmountToStake(tonBalance)
    },

    maxAmountOfTonBalanceInTon() {
        return Number(get()._maxAmountOfTonBalanceInNano()) / 1000000000
    },

    _setResultAmount: (amount: bigint) => {
        if (amount === 0n) return '';
        if (!amount) return '';


        set({
            resultAmount: formatCryptoAmount(NanoToTon(bigIntClamp(amount, 0n)))
        })
    },

    isSwapFromTonWallet: () => {
        return true;
    },

    executeDeposit: async () => {
        try {
            if (!get().isConnected()) return toast.error('Please connect your wallet');
            if (!get().amount) return toast.error('Please enter an amount to deposit');
            if (parseFloat(get().amount) === 0) return toast.error('Amount must be greater than 0');

            set({ requestStatus: RequestStatus.Requested, requestType: RequestType.Deposit })

            const member = get()._memberRecord;
            if (member == null) return;

            const amount = toNano(get().amount);
            const updatedMember = await member.executeDeposit(amount);

            set({ _memberRecord: updatedMember });

            get().setAmount('');

            toast.success('Deposit successful');
        } catch (error) {
            console.error(error)
            toast.error('Deposit failed, please try again')
        } finally {
            set({ requestStatus: RequestStatus.None, requestType: RequestType.None })
        }
    }
})))
export const minimumTonBalanceReserve = 200000000n

export function maxAmountToStake(tonBalance: bigint): bigint {
    tonBalance -= minimumTonBalanceReserve
    return tonBalance > 0n ? tonBalance : 0n
}