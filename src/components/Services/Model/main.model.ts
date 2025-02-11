import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, fromNano, OpenedContract, toNano, TonClient4 } from '@ton/ton'
import { ConnectedWallet, TonConnectUI } from '@tonconnect/ui'
import { create } from 'zustand';
import { Currency, RouteSpeed, RequestStatus, RequestType } from '@/types'
import { formatCryptoAmount, formatCryptoAmountAbbr, formatExchangeRate, removeThousandsSeparator } from '@/utils'
import { ATOMIC_DEX_CONTRACT_ADDRESS, NETWORK } from '@/services/config.service'
import { AtomicDex } from '@/services/AtomicDex/AtomicDex.service'
import { getSwapCurrencies, SwapService } from '@/services/swap/swap.service'
import debug from 'debug'
import { DEFAULT_CURRENCIES, DEFAULT_CURRENCIES_MAP } from '@/services/Defaults'
import { PoolModel, Route, router } from '@/services/Router'
import { AtomicWalletModel } from '@/models/Wallet/AtomicWallet.model'
import { toast } from "react-toastify";
import * as axios from 'axios';
import { AtomicMemberRecordModel } from '@/models/AtomicMember.model'
import { bigIntClamp } from '@/utils/math'
import { NativeJettonModel } from '@/models/NativeJetton.model';
import { getListOfJettonWallets } from '../atomic-api';
import { formatInputAmount, getJwtExpiration, isJwtExpired } from './utils';
import { LOADING_ROUTES, PLEASE_CONNECT_WALLET } from '@/services/Constants';
import { useTonAddress } from '@tonconnect/ui-react';
import { TimeoutError } from '@/types/errors';

const atomicDex = AtomicDex.fromAddress(Address.parse(ATOMIC_DEX_CONTRACT_ADDRESS))
const debugLog = debug('app:model')
const DEPOSIT_TIMEOUT = 40 * 1000;

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
    jettons: NativeJettonModel[]
    address?: Address
    tonBalanceInNano: bigint
    swapAmount: string
    swapErrorMessage: string
    estimatedGas: bigint,

    depositAmount: string
    depositAmountInNano: () => bigint | undefined
    setDepositAmount: (amount: string) => void
    isDepositModalOpen: boolean,
    setDepositModalOpen: (isOpen: boolean) => void
    setDepositAmountToMax: () => void
    maxDepositAmount: () => string,
    setDepositCurrency: (currency: Currency) => void
    depositErrorMessage: string
    selectedDepositCurrency: Currency

    /**
     * Returns true if only native Jetton available in user wallet is Ton
     * @returns {boolean}
     */
    isOnlyNativeTonJettonAvailable: () => boolean

    _exchangeRates: Record<string, string>

    _potentialRoutes: Route[],
    _selectedRoute: Route | null,

    _networkUrl?: string
    _getRoutes: () => void

    // unobserved state
    tonConnectUI?: TonConnectUI

    readLastBlock: () => void
    _maxAmountInNano: () => bigint
    getMaxAmountOfSelectedCurrency: () => number | bigint
    setSwapAmount: (amount: string) => void
    reloadSwapAmount: () => void
    setSwapAmountToMax: () => void
    tonBalanceFormatted: () => string | undefined
    tonBalanceInUsd: () => number
    swapAmountInNano: () => bigint | undefined
    _resultSwapAmountInNano: bigint | undefined

    getExchange(amount: string, from: Currency, to: Currency): string
    getInUsd(amount: string, from: Currency): string
    getEstimatedGas: () => void
    getResultExchangeRateFormatted: () => string


    resultSwapAmount: string;
    resultSwapFee: bigint;
    fromCurrency: Currency;
    toCurrency: Currency;
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
    pools: Record<string, PoolModel>,
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
    _initJettonWallet: () => void,
    _initListeners: () => void,
    _initAuthTokenChecker: () => void,
    _initRefreshPools: () => void,
    _maxAmountOfTonBalanceInNano: () => bigint,
    maxAmountOfTonBalanceInTon: () => number,
    _setResultAmount: (bigint: bigint) => void,
    _authToken: string | null,

    isSidebarOpen: boolean,
    setSidebarOpen: (isOpen: boolean) => void,
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
    tonClient: undefined,
    address: undefined,
    tonBalanceInNano: 0n,
    treasury: undefined,
    treasuryState: undefined,
    times: undefined,
    walletAddress: undefined,
    wallet: undefined,
    walletState: undefined,
    estimatedGas: 0n,
    swapAmount: '',
    depositAmount: '',
    swapErrorMessage: '',
    _exchangeRates: {},
    _memberRecord: null,
    _selectedRoute: null,
    _swapService: undefined,
    _potentialRoutes: [],
    _atomicWallets: {},
    _networkUrl: undefined,
    isSidebarOpen: false,
    setSidebarOpen: (isOpen: boolean) => {
        set({ isSidebarOpen: isOpen })
    },
    jettons: [],
    isDepositModalOpen: false,
    _authToken: null,
    depositAmountInNano() {
        const amount = get().depositAmount.trim()
        try {
            return toNano(amount)
        } catch {
            return undefined
        }
    },
    setDepositModalOpen: (isOpen: boolean) => {
        set({
            isDepositModalOpen: isOpen,
        })
    },


    setDepositAmount: (amount: string) => {
        const { _maxAmountOfTonBalanceInNano } = get()
        // remove non-numeric characters and replace comma with dot
        const formatted = formatInputAmount(amount);
        const amountInNano = toNano(formatted);

        if (amountInNano > _maxAmountOfTonBalanceInNano()) {
            set({ depositErrorMessage: `Not enough balance.` })
        } else {
            set({ depositErrorMessage: '' })
        }
        set({ depositAmount: formatted })


    },
    setDepositAmountToMax: () => {
        const { maxAmountOfTonBalanceInTon, selectedDepositCurrency, maxDepositAmount } = get()

        if (selectedDepositCurrency === DEFAULT_CURRENCIES_MAP.TON) {
            set({ depositAmount: maxAmountOfTonBalanceInTon().toString() })
        } else {
            set({ depositAmount: maxDepositAmount() })
        }
    },
    depositErrorMessage: '',
    selectedDepositCurrency: DEFAULT_CURRENCIES_MAP['TON'],

    executeDeposit: async () => {
        debugLog('executeDeposit')
        try {
            const {
                _memberRecord,
                isConnected,
                setDepositAmount: setAmount,
                depositAmountInNano: amountInNano,
                depositAmount: amount,
                selectedDepositCurrency,
                _swapService } = get();

            if (!isConnected()) return toast.error('Please connect your wallet');
            if (!amount) return toast.error('Please enter an amount to deposit');
            if (parseFloat(amount) === 0) return toast.error('Amount must be greater than 0');

            set({ requestStatus: RequestStatus.Requested, requestType: RequestType.Deposit })

            const member = _memberRecord;
            if (member == null) {
                toast.info('Member record not found, Joining to the network and adding your deposit!');
                await _swapService!.sendJoinOperation(
                    get().tonConnectUI?.account?.publicKey!,
                    amountInNano()!,
                    selectedDepositCurrency.id,
                );

            } else {
                await _swapService!.sendDepositOperation(
                    get().tonConnectUI?.account?.publicKey!,
                    amountInNano()!,
                    selectedDepositCurrency.id,

                );
            }

            // wait until the deposit is signed

            while (get().requestStatus === RequestStatus.Requested) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }



            if (get().requestStatus === RequestStatus.Failed) {
                toast.error('Deposit failed, please try again');
                return;
            }

            if (get().requestStatus === RequestStatus.SignFailed) {
                toast.error('Deposit signing failed, please try again');
                return;
            }

            set({ requestStatus: RequestStatus.WaitingForConfirmation })
            if (member) {
                const updatedPool = await member.poolForUpdates(true, DEPOSIT_TIMEOUT);
                set({ _memberRecord: updatedPool });

            } else {
                const placeholderMember = AtomicMemberRecordModel.createPlaceholder(
                    get()._atomicDexContract!,
                    BigInt(`0x${get().tonConnectUI?.account?.publicKey!}`)
                );
                const updatedPool = await placeholderMember.poolForUpdates(true, DEPOSIT_TIMEOUT);
                set({ _memberRecord: updatedPool });
            }
            set({ requestStatus: RequestStatus.Confirmed })



            setAmount('');
            toast.success('Deposit successful');

        } catch (error) {
            if (error instanceof TimeoutError) {
                toast.error('Deposit confirmation timed out, please reload and try again');
                return;
            }

            // if type is UserRejectsError then the user rejected the transaction
            debugLog(error, (error as Error)?.name)
            if ((error as Error)?.message.includes('UserRejectsError')) {
                toast.info('User rejected the transaction');
                return;
            }

            console.error(error)
            toast.error('Deposit failed, please try again')
        } finally {
            set({ requestStatus: RequestStatus.None, requestType: RequestType.None })
        }
    },

    setDepositCurrency: (currency: Currency) => {
        debugLog('setDepositCurrency')
        set({ selectedDepositCurrency: currency })
    },

    maxDepositAmount() {
        const { selectedDepositCurrency, jettons } = get();

        if (selectedDepositCurrency == null) return '0';

        if (selectedDepositCurrency.symbol === DEFAULT_CURRENCIES_MAP.TON.symbol) {
            return get().maxAmountOfTonBalanceInTon().toString()
        }


        const jetton = jettons.find((jetton) => jetton.currency.symbol === selectedDepositCurrency.symbol)
        debugLog('maxDepositAmount, jettons', jetton?.symbol, selectedDepositCurrency)

        return formatNano(jetton?.balance ?? 0n)
    },

    isOnlyNativeTonJettonAvailable: () => {
        const { jettons } = get();
        if (!jettons) return true;
        if (jettons.length === 0) return true;
        return jettons.length === 1 && jettons[0].symbol === 'TON'
    },

    // unobserved state
    tonConnectUI: undefined,

    resultSwapAmount: "",
    _resultSwapAmountInNano: undefined,
    resultSwapFee: 0n,
    pools: {},

    fromCurrency: DEFAULT_CURRENCIES[0],
    toCurrency: DEFAULT_CURRENCIES[1],
    currentExchangeRate: 1,
    currencies: new Set<Currency>(),
    getEstimatedGas: () => {
        get()._swapService?.estimateSwapFee({
            amountIn: get().swapAmountInNano()!,
            route: get()._selectedRoute!,
            publicKey: get().tonConnectUI?.account?.publicKey!,
            tonConnectUi: get().tonConnectUI!,
            poolId: 0,
            authToken: get()._authToken!,
        }).then((fee) => {
            set({ estimatedGas: fee })
        })
    },
    getResultExchangeRateFormatted: () => {
        const r = Number(get()._resultSwapAmountInNano) / Number(get().swapAmountInNano());

        return formatExchangeRate(r)
    },

    _maxAmountInNano(): bigint {
        const member = get()._memberRecord;

        if (member == null) {
            return 0n
        }

        const currency = get().fromCurrency;

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

            const currency = get().fromCurrency;

            if (currency == null) {
                return 0
            }

            // @ts-ignore
            const balance = member.getCurrencyBalance(currency)

            if (!balance) {
                return 0
            }

            const balance100x = balance / 10000000n

            return Number(balance100x) / 100
        } catch (error) {
            console.error(error)
            return 0
        }

    },

    setSwapAmountToMax() {
        set({ swapAmount: fromNano(get()._maxAmountInNano()) })
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

    swapAmountInNano() {
        const amount = get().swapAmount.trim()
        try {
            return toNano(amount)
        } catch {
            return undefined
        }
    },

    reloadSwapAmount() {
        const amount = get().swapAmount
        set({ swapAmount: '' })
        // wait 0.2 seconds for the input to update
        setTimeout(() => get().setSwapAmount(amount), 100);

    },

    setSwapAmount: (amount: string) => {
        debugLog('setAmount')
        const { _swapService, _maxAmountInNano, tonConnectUI, _memberRecord } = get()
        // remove non-numeric characters and replace comma with dot
        const formatted = amount
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
            .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
            .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places

        const amountInNano = toNano(formatted);

        if (amountInNano > _maxAmountInNano() && tonConnectUI?.account?.address && _memberRecord) {
            set({
                swapErrorMessage: `Not enough balance.`,
            })
        } else if (amountInNano > _maxAmountInNano() && !tonConnectUI?.account?.address) {
            set({
                swapErrorMessage: PLEASE_CONNECT_WALLET,
            })
        } else {
            set({
                swapErrorMessage: '',
            })
        }
        set({ swapAmount: formatted })

        const selectedRoute = router.getBestRouteFromRoutes(get()._potentialRoutes, get().swapAmountInNano()!);
        debugLog(`setAmount, potentialRoutes: ${get()._potentialRoutes}, selectedRoute: ${selectedRoute}`)
        set({ _selectedRoute: selectedRoute })

        if (selectedRoute == null && get().swapAmountInNano() !== 0n && Object.values(get().pools).length > 0) {
            set({
                swapErrorMessage: 'No route found',
                swapAmount: formatted,
            })
            get()._setResultAmount(0n)
            return
        }
        if (selectedRoute == null && get().swapAmountInNano() !== 0n && Object.values(get().pools).length === 0) {
            set({
                swapErrorMessage: LOADING_ROUTES,
            })
            get()._setResultAmount(0n);
            return;
        }
        try {
            const result = selectedRoute!.getPriceAndFeeInUSDT(get().swapAmountInNano()!,
                get()._exchangeRates
            );

            debugLog(`setAmount, amount: ${amount}, formatted: ${formatted}, amountInNano: ${amountInNano}, resultFee: ${result.feeInUSDT}`)
            get()._setResultAmount(result.price)
            set({
                resultSwapFee: result.feeInUSDT,
            })
        } catch (error) {
            console.error(error)
        }

    },

    setFromCurrency: (currency: Currency) => {
        try {
            if (currency === get().toCurrency) {
                set({ toCurrency: get().fromCurrency })
            }
            set({ fromCurrency: currency })

            get().setSwapAmount(get().swapAmount)
            get()._getRoutes()
            get().reloadSwapAmount()
        } catch (error) {
            console.error(error)
        }


    },

    setToCurrency: (currency: Currency) => {
        try {
            if (currency === get().fromCurrency) {
                set({ fromCurrency: get().toCurrency })
            }
            set({ toCurrency: currency })
            get().setSwapAmount(get().swapAmount)
            get()._getRoutes()
            get().reloadSwapAmount()
        } catch (error) {
            console.error(error)
        }
    },

    _getRoutes: () => {
        const { fromCurrency: selectedFromCurrency, toCurrency: selectedToCurrency, swapAmount: amount } = get()
        debugLog('_getRoutes from ', selectedFromCurrency?.symbol, ' to ', selectedToCurrency?.symbol, ' amount ', amount)

        const routes = router.getAllRoutes(selectedFromCurrency, selectedToCurrency);

        debugLog(`_getRoutes, routes, ${routes.map((route) => route.toString() + '\n')}`)
        set({ _potentialRoutes: routes })
        const selectedRoute = router.getBestRouteFromRoutes(routes, get().swapAmountInNano()!);
        debugLog(`_getRoutes, selectedRoute, ${selectedRoute} ${selectedRoute?.getPrice(get().swapAmountInNano()!)}`)
        set({ _selectedRoute: selectedRoute })
    },

    switchCurrencies: () => {
        get().setFromCurrency(get().toCurrency)
    },

    init: async (tonConnectUI: TonConnectUI) => {
        get()._initExchangeRates()

        try {
            if (get().inited) return;
            debugLog('init')

            set({ inited: true });
            const url = await getHttpV4Endpoint({
                network: get().network,
            });

            set({ _networkUrl: url })

            const tonClient = new TonClient4({ endpoint: url });
            const atomicDexContract = tonClient.open(atomicDex);
            if (tonConnectUI.wallet) {
                get().setSidebarOpen(true)
            }

            set({
                tonConnectUI,
                tonClient,
                inited: true,
                _atomicDexContract: atomicDexContract,
            });

            // wait 3 seconds for the contract to be opened
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const swapService = new SwapService(tonClient, tonConnectUI);
            set({ _swapService: swapService });


            get()._initRefreshPools();
            get()._initWallet();
            get()._initTonProofPayloadFromBackend();
            // reload proof every 20 minutes
            setInterval(() => get()._initTonProofPayloadFromBackend(), 60 * 1000);

            get()._initAtomicWallets();
            get()._initListeners();
        } catch (error) {
            console.error(error)
        }

    },

    readLastBlock: async () => {
        debugLog('readLastBlock')
        const tonClient = get().tonClient!
        const address = get().address

        const lastBlockSeqNo = (await tonClient.getLastBlock()).last.seqno;

        address == null
            ? Promise.resolve(0n)
            : tonClient.getAccount(lastBlockSeqNo, address)
                .then((value) => {
                    set({ tonBalanceInNano: BigInt(value.account.balance.coins) })
                })
    },

    loadTonBalance: async () => {
        debugLog('loadTonBalance')
        const tonClient = get().tonClient
        const address = get().address
        if (tonClient == null || address == null) {
            set({ tonBalanceInNano: 0n })
            return
        }

        try {
            const lastBlock = (await tonClient.getLastBlock()).last.seqno
            const value = await tonClient.getAccount(lastBlock, address)

            set({ tonBalanceInNano: BigInt(value.account.balance.coins) })
        } catch (err) {
            set({ tonBalanceInNano: 0n });
        }
    },


    onConnectWallet: (wallet: ConnectedWallet) => {
        try {
            set({
                address: Address.parseRaw(wallet.account.address),
            })
            get()._initAuthTokenChecker();
            get().readLastBlock();
            get().loadTonBalance();
            get()._initMemberRecord();
            get()._initJettonWallet();
            get().reloadSwapAmount();
        } catch (error) {
            console.error(error)
        }

        if (
            !(wallet.connectItems?.tonProof &&
                "proof" in wallet.connectItems.tonProof)
        ) {
            const { token } = loadAuthToken();
            set({ _authToken: token })
            return;
        }


        debugLog('onConnectWallet, handling proof', wallet.connectItems.tonProof!.proof)
        const proof = wallet.connectItems.tonProof.proof;
        get().setSidebarOpen(true);

        const request = axios.default.post('/api/check-proof', {
            network: "-3", // -3 testnet, -239 for mainnet
            address: wallet.account.address,
            proof: {
                state_init: "",
                ...proof,
            },
        }).then(
            (res) => {
                debugLog('onConnectWallet, check-proof response', res.data)
                const data: { token: string } = res.data;
                set({ _authToken: data.token })
                saveAuthToken(data.token)
            }
        ).catch(
            error => {
                toast.error("Authentication Error, please try again")
                // disconnect tonUi
                get().tonConnectUI?.disconnect();
            }
        )
    },

    onDisconnectWallet: () => {
        get().setSidebarOpen(false);
        set({
            address: undefined,
            tonBalanceInNano: 0n,
            swapErrorMessage: '',
            _memberRecord: null,
            _authToken: null,
        })
        saveAuthToken(null)
    },

    isConnected() {
        return get().address != null

    },

    executeSwapOrder: async () => {
        debugLog('executeSwapOrder')
        const getPools = () => {
            return get()._swapService?.getPoolList()
                .then((pools) => {
                    set({ pools })
                    const currencies = getSwapCurrencies(pools);
                    set({ currencies: currencies });
                    get()._initRouting();
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        try {
            await getPools();
            if (!get().readyToSwap()) return;
            set({ requestStatus: RequestStatus.Requested, requestType: RequestType.Swap })
            // get().setWaitForTransaction('wait')
            // get().beginRequest()
            debugLog(`amount: ${get().swapAmount}, ${get().resultSwapAmount}`);
            // process
            await get()._swapService!.executeSwap(
                {
                    amountIn: get().swapAmountInNano()!,
                    route: get()._selectedRoute!,
                    publicKey: get().tonConnectUI?.account?.publicKey!,
                    tonConnectUi: get().tonConnectUI!,
                    poolId: 0,
                    authToken: get()._authToken!,
                }
            );

            set({
                requestStatus: RequestStatus.WaitingForConfirmation,
            })

            const member = await get()._memberRecord!;
            const cloned = member.applySwap(
                get().fromCurrency,
                get().toCurrency,
                get().swapAmountInNano()!,
                get()._resultSwapAmountInNano!,
            )

            set({
                _memberRecord: cloned,
            })
            get().setSwapAmount("");


            const newMember = await get()._memberRecord?.poolForUpdates();

            set({
                requestStatus: RequestStatus.Confirmed,
                _memberRecord: newMember,
            })

            toast.success('Swap executed successfully')
        }
        catch (error) {
            get().setSwapAmount("");

            console.error(error)
            if (get().requestStatus === RequestStatus.WaitingForConfirmation) {
                // set({
                //     errorMessage: 'Swap Confirmation could not be performed',
                // });
                return;
            }
            else {
                set({
                    swapErrorMessage: 'Swap failed, please try again',
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
        // debugLog('---readyToSwap')
        if (!get().isConnected()) return false;
        // debugLog('readyToSwap, connected')
        if (Number.isNaN(parseFloat(get().swapAmount))) return false;
        // debugLog('readyToSwap, amount not Nan')
        if (parseFloat(get().swapAmount) === 0) return false;
        // debugLog('readyToSwap, amount positive')
        if (get().swapErrorMessage !== '') return false;
        // if (get().tonBalance === undefined) return false;

        return true;
    },

    isAtomicSpeedSwap: () => {
        return get().readyToSwap() && get()._selectedRoute?.speed === RouteSpeed.Fast && !!get()._memberRecord?.havePositiveBalances()
    },

    getSwapInputError: () => {
        if (get().swapAmount === '') return '';
        if (!get().isConnected()) return 'Please connect your wallet';
        if (parseFloat(get().swapAmount) === 0) return 'Amount must be greater than 0';
        if (Number.isNaN(parseFloat(get().swapAmount))) return 'Amount must be a valid number';

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
        debugLog('_initTonProofPayloadFromBackend')
        try {
            get().tonConnectUI!.setConnectRequestParameters({
                state: "loading"
            })
            const proof = await get()._fetchTonProofPayloadFromBackend();

            debugLog("_initTonProofPayloadFromBackend, proof", proof)
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
        const { pools } = get();

        Object.values(pools).map((pool) => router.upsertPools(pool));

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
            debugLog('_initMemberRecord: getting member record')
            const { _swapService } = get();
            const _memberRecord = await _swapService!.getMember(get().tonConnectUI?.account?.publicKey!);

            debugLog('memberRecord', _memberRecord);

            set({
                _memberRecord,
            });
            get().reloadSwapAmount();
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

    _initWallet: () => {
        const { tonConnectUI, _initMemberRecord } = get();
        if (tonConnectUI?.wallet) {
            set({
                address: Address.parseRaw(get().tonConnectUI!.wallet!.account.address),
                swapErrorMessage: '',
            });
            get().onConnectWallet(get().tonConnectUI!.wallet! as ConnectedWallet);
            _initMemberRecord();
        }
        tonConnectUI!.onStatusChange((wallet) => {



            if (wallet) get().onConnectWallet(wallet);
            else get().onDisconnectWallet();
        })
    },

    _initJettonWallet: async () => {
        const list = await getListOfJettonWallets(get().address!.toString());

        set({ jettons: list });
    },

    _initListeners: () => {
        const log = debug('app:model:listeners')
        window.addEventListener(
            "ton-connect-ui-transaction-sent-for-signature",
            (event) => {
                // @ts-ignore
                log("Transaction init", event.detail);
            }
        );
        window.addEventListener(
            "ton-connect-ui-transaction-signing-failed",
            (event) => {
                // @ts-ignore
                log("Transaction signing failed", event.detail);
                set({ requestStatus: RequestStatus.SignFailed, requestType: RequestType.None })
            }
        );
        window.addEventListener("ton-connect-ui-transaction-signed", (event) => {
            // @ts-ignore
            log("Transaction signed", event.detail);
            set({ requestStatus: RequestStatus.WaitingForConfirmation })
        });

    },

    getExchange(amount: string, from: Currency, to: Currency): string {
        const rate = get()._exchangeRates[`${from.symbol}${to.symbol}`];

        return (parseFloat(amount) * parseFloat(rate)).toFixed(2)
    },

    getInUsd(amount: string, from: Currency): string {
        if (!amount) return '0.00';
        if (from.symbol === 'USDT') return amount;
        if (from.symbol === 'CATS') return 0.00.toFixed(2);

        const rate = get()._exchangeRates[`${from.symbol}USDT`];

        const converted = parseFloat(removeThousandsSeparator(amount)) * parseFloat(rate);

        const r = formatCryptoAmountAbbr(converted)
        console.log(`getInUsd, amount: ${amount}, rate: ${rate}, from: ${from.symbol}, converted: ${converted}, r: ${r}`)
        return r;
    },

    _maxAmountOfTonBalanceInNano() {
        const tonBalance = get().tonBalanceInNano
        return maxAmountToStake(tonBalance)
    },

    maxAmountOfTonBalanceInTon() {
        return Number(get()._maxAmountOfTonBalanceInNano()) / 1000000000
    },

    _setResultAmount: (amount: bigint) => {
        // if (amount === 0n) return '';
        // if (!amount) return '';


        set({
            resultSwapAmount: formatCryptoAmount(NanoToTon(bigIntClamp(amount, 0n))),
            _resultSwapAmountInNano: amount | 0n,
        })
    },

    isSwapFromTonWallet: () => {
        return true;
    },

    _initAuthTokenChecker: () => {
        const log = debug('app:model:authTokenChecker')
        const checkerFn = () => {

            const { _authToken, tonConnectUI } = get();
            if (!_authToken) return;
            const isExpired = isJwtExpired(_authToken);

            if (isExpired) {
                saveAuthToken(null);
                set({ _authToken: null });
                tonConnectUI?.disconnect();
                log('Auth token expired, disconnecting wallet')
            } else {
                log(`Auth token is still valid ${new Date(getJwtExpiration(_authToken) * 1000)}`)
            }
        }
        setInterval(checkerFn, 1000 * 30)
        checkerFn();
    },

    _initRefreshPools: () => {
        const getPools = () => {
            get()._swapService?.getPoolList()
                .then((pools) => {
                    set({ pools })
                    const currencies = getSwapCurrencies(pools);
                    set({ currencies: currencies });
                    get()._initRouting();
                })
                .catch((error) => {
                    console.error(error)
                })
        }
        setInterval(getPools, 1000 * 60)
        getPools();
    },
})))
export const minimumTonBalanceReserve = 200000000n

export const useIsConnected = (): boolean => !!useTonAddress()


function maxAmountToStake(tonBalance: bigint): bigint {
    tonBalance -= minimumTonBalanceReserve
    return tonBalance > 0n ? tonBalance : 0n
}

function loadAuthToken(): { token: string | null } {
    const token = localStorage.getItem('authToken');

    return {
        token,
    }
}

function saveAuthToken(token: string | null) {
    if (token == null) {
        localStorage.removeItem('authToken');
        return;
    }
    localStorage.setItem('authToken', token!);
}