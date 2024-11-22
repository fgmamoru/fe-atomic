import { getHttpV4Endpoint, Network } from '@orbs-network/ton-access'
import { Address, Dictionary, fromNano, internal, OpenedContract, toNano, TonClient4 } from '@ton/ton'
import { CHAIN, SendTransactionRequest, TonConnectUI } from '@tonconnect/ui'
import { maxAmountToStake, createDepositMessage, createUnstakeMessage } from '../ton-comms/Helpers'
import { Parent } from '../ton-comms/Parent'
import { Treasury, TreasuryConfig, Times, ParticipationState } from '../ton-comms/Treasury'
import { WalletState, Wallet, WalletFees } from '../ton-comms/Wallet'
import { create } from 'zustand';
import { ITicket, UnstakeType } from '@/types'
import { formatCryptoAmount, formatPercent } from '@/utils'
import { NETWORK, TREASURY_CONTRACT_ADDR } from '@/services/config.service'
import { ConnectedWallet } from '@tonconnect/ui-react'

type ActiveTab = 'stake' | 'unstake';

type ModelType = {
    loadTonBalance(): unknown
    onDisconnectWallet(): unknown
    onConnectWallet(wallet: ConnectedWallet): unknown
    TONToUSD: number
    inited: boolean,
    init: any,
    network: Network,
    tonClient?: TonClient4,
    address?: Address
    tonBalance?: bigint
    treasury?: OpenedContract<Treasury>
    treasuryState?: TreasuryConfig
    times?: Times
    walletAddress?: Address
    wallet?: OpenedContract<Wallet>
    walletState?: WalletState
    walletFees?: WalletFees
    activeTab: ActiveTab
    unstakeType: UnstakeType
    amount: string
    waitForTransaction: WaitForTransaction
    ongoingRequests: number
    errorMessage: string
    isInputInvalid: () => boolean

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
    connectWallet: () => void
    maxAmount: () => bigint
    maxAmountInTon: () => number
    isMainnet: () => boolean
    setAmount: (amount: string) => void
    setAmountToMax: () => void
    tonBalanceFormatted: () => string | undefined
    tonBalanceInUsd: () => number
    unstakingInProgressFormatted: () => string
    unstakingInProgressDetails: () => any
    stakingInProgressFormatted: () => string
    stakingInProgressDetails: () => any
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
    sendTonTransaction: () => Promise<void>
    currentlyStakedInUsd: () => string
    getTonToUsd: () => void
    getUnstakeFeeFormatted: () => string
    getUnstakeFeeFormattedAsUsd: () => string

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
const formattedZero = formatCryptoAmount(0)
export const useModel = create<ModelType>((set, get) => ({
    TONToUSD: 0,
    inited: false,
    network: NETWORK,
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
        const walletState = get().walletState
        if (isStakeTabActive) {
            // reserve enough TON for user's ton wallet storage fee + enough funds for future unstake
            return maxAmountToStake(tonBalance ?? 0n)
        } else {
            return walletState?.tokens ?? 0n
        }
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

    init: async (tonConnectUI: any) => {
        const readTimes = () => {
            const tonClient = get().tonClient
            const timeoutReadTimes = get().timeoutReadTimes;

            const treasuryAddress = _treasuryAddress;
            clearTimeout(timeoutReadTimes)

            if (tonClient == null || treasuryAddress == null) {
                set({ times: undefined })
                return
            }

            tonClient
                .open(Treasury.createFromAddress(treasuryAddress))
                .getTimes()
                .then((times) => set({ times }))
                .catch(() => {
                    clearTimeout(timeoutReadTimes)
                    const newTimeoutReadTimes = setTimeout(readTimes, retryDelay)
                    set({ timeoutReadTimes: newTimeoutReadTimes })
                })
        }

        set({ tonConnectUI });

        if (get().inited) return;
        const endpoint = await getHttpV4Endpoint({ network: get().network })
        console.log('!!! EDNPOINT', endpoint)
        set({
            inited: true,
            network: NETWORK,
            tonClient: new TonClient4({ endpoint })
        });

        readTimes();
        get().connectWallet();

        get().readLastBlock();
        get().getTonToUsd();
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
        const tonClient = get().tonClient
        const address = get().address
        const treasuryAddress = _treasuryAddress;
        clearTimeout(get().timeoutReadLastBlock)
        set({ timeoutReadLastBlock: setTimeout(() => void get().readLastBlock(), updateLastBlockDelay) })
        const getWalletAddress = async (tonClient: TonClient4, lastBlock: number, address: Address) => {
            return (get().walletAddress != null
                ? Promise.resolve(get().walletAddress)
                : tonClient
                    .openAt(lastBlock, Parent.createFromAddress(get().treasuryState?.parent as Address))
                    .getWalletAddress(address))
        }

        if (tonClient == null || treasuryAddress == null) {
            set({
                tonBalance: undefined,
                treasury: undefined,
                treasuryState: undefined,
                walletAddress: undefined,
                wallet: undefined,
                walletState: undefined,
            })
            return;
        }

        try {
            get().beginRequest()
            const lastBlock = (await tonClient.getLastBlock()).last.seqno

            if (lastBlock < get().lastBlock) {
                throw new Error('older block')
            }

            const treasury = tonClient.openAt(lastBlock, Treasury.createFromAddress(treasuryAddress))

            const readTreasuryState = treasury.getTreasuryState()

            const readTonBalance =
                address == null
                    ? Promise.resolve(0n)
                    : tonClient.getAccountLite(lastBlock, address)
                        .then((value) => {
                            return value
                        })
                        .then((value) => BigInt(value.account.balance.coins))

            const cannotReadWallet = address == null || get().treasuryState?.parent == null
            const readWallet: Promise<[Address, OpenedContract<Wallet>, WalletState, WalletFees] | undefined> =
                cannotReadWallet
                    ? Promise.resolve(undefined)
                    : getWalletAddress(tonClient, lastBlock, address)
                        .then(async (walletAddress) => {
                            const wallet = tonClient.openAt(lastBlock, Wallet.createFromAddress(walletAddress as Address))
                            // Wallet may not exist or tonClient may throw an exception,
                            // so return previous get().walletState which is good for both cases.
                            const walletStateP = wallet.getWalletState().catch(() => get().walletState)
                            const walletFeesP = wallet.getWalletFees().catch(() => get().walletFees)

                            const [walletState, walletFees] = await Promise.all([walletStateP, walletFeesP])

                            return [walletAddress!, wallet!, walletState!, walletFees!]
                        })

            const parallel: [
                Promise<TreasuryConfig>,
                Promise<bigint | undefined>,
                Promise<[Address, OpenedContract<Wallet>, ModelType["walletState"], WalletFees] | undefined>,
            ] = [readTreasuryState, readTonBalance, readWallet]
            const [treasuryState, tonBalance, mton] = await Promise.all(parallel)
            let [walletAddress, wallet, walletState, walletFees] = mton ?? []

            if (walletAddress == null && address != null && treasuryState.parent != null) {
                ;[walletAddress, wallet, walletState] = await tonClient
                    .openAt(lastBlock, Parent.createFromAddress(treasuryState.parent))
                    .getWalletAddress(address)
                    .then(async (walletAddress) => {
                        const wallet = tonClient.openAt(lastBlock, Wallet.createFromAddress(walletAddress))
                        const walletState = await wallet.getWalletState().catch(() => undefined)
                        return [walletAddress, wallet, walletState]
                    })
            }
            set({
                tonBalance: tonBalance,
                treasury: treasury,
                treasuryState: treasuryState,
                walletAddress: walletAddress,
                wallet: wallet,
                walletState: walletState,
                lastBlock: lastBlock,
                walletFees: walletFees
            })

        } catch (err) {
            console.error(err)
            set({
                errorMessage: errorMessageTonAccess,
                timeoutReadLastBlock: setTimeout(() => void get().readLastBlock(), retryDelay)
            })
            clearTimeout(get().timeoutReadLastBlock)
        } finally {
            get().endRequest()
        }
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

    connectWallet: () => {
        if (get().tonConnectUI?.wallet) {
            set({ address: Address.parseRaw(get().tonConnectUI!.wallet!.account.address) })
        }
        get().tonConnectUI!.onStatusChange((wallet) => {
            if (wallet) get().onConnectWallet(wallet);
            else get().onDisconnectWallet();
        })
    },

    onConnectWallet: (wallet: ConnectedWallet) => {
        const chain = wallet.account.chain
        const network = get().network
        console.log('onConnectWallet', wallet, network);
        if (
            (chain === CHAIN.MAINNET && network === 'mainnet') ||
            (chain === CHAIN.TESTNET && network === 'testnet')
        ) {
            console.log('getting balances')
            set({
                address: Address.parseRaw(wallet.account.address),
            })

            get().readLastBlock();
            get().getTonToUsd();
            get().loadTonBalance();

        } else {
            void get().tonConnectUI?.disconnect()

            set({
                address: undefined,
                errorMessage: errorMessageNetworkMismatch + (get().isMainnet() ? 'MainNet' : 'TestNet')
            })
        }
    },

    onDisconnectWallet: () => {
        set({
            address: undefined,
            tonBalance: undefined,
            wallet: undefined,
            amount: '',
            walletState: undefined,
            errorMessage: '',
        })
    },

    setAmount(amount: string) {
        // remove non-numeric characters and replace comma with dot
        const formatted = amount
            .replace(/[^0-9.,]/g, '')
            .replace(',', '.')
            .replace(/(\..*?)([.,])/g, '$1') // keep only the first dot
            .replace(/(\.\d{9}).*/, '$1'); // truncate after 9 decimal places
        set({ amount: formatted })
    },

    setAmountToMax() {
        set({ amount: fromNano(get().maxAmount()) })
    },

    sendTonTransaction: async () => {
        if (
            get().address != null &&
            get().isAmountValid() &&
            get().isAmountPositive() &&
            get().amountInNano != null &&
            get().treasury != null &&
            get().wallet != null &&
            get().tonConnectUI != null &&
            get().tonBalance != null
        ) {
            let referrer: Address | undefined
            let tx: any;

            try {
                referrer = Address.parse(referrerAddress)
            } catch {
                referrer = undefined
            }

            const message = get().isStakeTabActive()
                ? createDepositMessage(get().treasury!.address, get().amountInNano()!, referrer)
                : createUnstakeMessage(get().wallet!.address, get().amountInNano()!)

            if (get().activeTab === 'unstake' && get().unstakeType === 'instant') {



                tx = {
                    validUntil: Math.floor(Date.now() / 1000) + txValidUntil,
                    network: get().isMainnet() ? CHAIN.MAINNET : CHAIN.TESTNET,
                    messages: [{
                        // @ts-ignore
                        address: message.to.toString(),
                        // @ts-ignore
                        amount: message.value.toString(),
                        // @ts-ignore
                        payload: message.body?.toBoc().toString('base64'),
                    }]
                }
            } else {
                tx = {
                    validUntil: Math.floor(Date.now() / 1000) + txValidUntil,
                    network: get().isMainnet() ? CHAIN.MAINNET : CHAIN.TESTNET,
                    from: get().address!.toRawString(),
                    messages: [message],
                }
            }

            const tonBalance = get().tonBalance
            console.log('sendTonTransaction', tx, tonBalance)
            return get().tonConnectUI!
                .sendTransaction(tx)
                .then(() => {
                    get().setWaitForTransaction('wait')
                    return get().checkIfBalanceChanged(tonBalance!, get().walletState?.tokens as bigint, 20)
                })
                .then(() => {
                    get().setAmount('')
                })
        }
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

    unstakingInProgressFormatted() {
        return formatNano(get().walletState?.unstaking ?? 0n) + ' mTON'
    },

    unstakingInProgressDetails(): ITicket | null {
        const value = get().walletState?.unstaking
        if (value == null || value === 0n || get().treasuryState == null) {
            return null
        }
        let time = undefined
        const firstParticipationKey = get().treasuryState!.participations.keys()[0] ?? 0n
        const firstParticipationValue = get().treasuryState!.participations.get(firstParticipationKey)
        if ((firstParticipationValue?.state ?? ParticipationState.Open) >= ParticipationState.Staked) {
            time = firstParticipationValue?.stakeHeldUntil
        }
        return {
            name: 'Stake Request',
            unlocked: false,
            formattedAmount: formatNano(value) + ' TON',
            amount: Number(value),
            // amount: formatNano(value) + ' mTON',
            eta: time == null ? 'Available' : formatDate(new Date((Number(time) + 5 * 60) * 1000)),
        }
    },

    stakingInProgressFormatted() {
        let result = 0n
        const empty = Dictionary.empty(Dictionary.Keys.BigUint(32), Dictionary.Values.BigVarUint(4))
        const staking = get().walletState?.staking ?? empty
        const times = staking.keys()
        for (const time of times) {
            const value = staking.get(time)
            if (value != null) {
                result += value
            }
        }
        return formatNano(result) + ' TON'
    },

    stakingInProgressDetails(): ITicket[] {
        const result: ITicket[] = []
        const empty = Dictionary.empty(Dictionary.Keys.BigUint(32), Dictionary.Values.BigVarUint(4))
        const staking = get().walletState?.staking ?? empty
        const times = staking.keys()
        for (const time of times) {
            const value = staking.get(time)
            if (value != null) {
                const until = get().treasuryState?.participations.get(time)?.stakeHeldUntil ?? 0n
                result.push({
                    name: 'Stake Request',
                    unlocked: false,
                    formattedAmount: formatNano(value) + ' TON',
                    amount: Number(value),
                    // amount: formatNano(value) + ' TON',
                    eta: until === 0n ? 'Available' : formatDate(new Date((Number(until) + 5 * 60) * 1000)),
                })
            }
        }
        return result
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
        if (retries === 0) {
            // give up
            get().setWaitForTransaction('timeout')
            console.log('giving up')
            return
        }
        const newBalance = get().tonBalance
        const newWalletStateBalance = get().walletState?.tokens

        get().wallet?.getWalletState()
            .then((walletState) => set({ walletState })).catch(() => { })

        if (newBalance != null && newBalance !== balance && newWalletStateBalance != null && newWalletStateBalance !== walletStateBalance) {
            get().setWaitForTransaction('done')
            // reload balances
            get().readLastBlock();
            get().getTonToUsd();

        } else {
            setTimeout(() => void get().checkIfBalanceChanged(balance, walletStateBalance, retries - 1), checkBalanceChangeDelay)
        }
    },

    getTonToUsd: async () => {
        const url = "https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT"
        await fetch(url)
            .then((response) => response.json())
            .then((data) => data.price)
            .then((price) => set({ TONToUSD: price }))
            .catch((error) => console.error('Error:', error))
    },

    getUnstakeFeeFormatted() {
        const unstakeFee = get().walletFees?.unstakeFee || 0n;

        return `${formatNano(unstakeFee)} TON`;
    },

    getUnstakeFeeFormattedAsUsd() {
        const unstakeFee = NanoToTon(get().walletFees?.unstakeFee || 0n);

        const val = tonToUsd(Number(unstakeFee), get().TONToUSD)
        return val.toLocaleString(undefined, {
            maximumFractionDigits: 2,
        })
    }
}))