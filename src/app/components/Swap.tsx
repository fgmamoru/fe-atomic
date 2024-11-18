import { MainButton } from "@/components/Button/MainButton";
import { MiniButton } from "@/components/Button/MiniButton";
import { SwapInput } from "@/components/Forms/SwapInput";
import { formatCryptoAmount } from "@/utils";
import styles from "./Swap.module.css";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { create } from 'zustand';
import { AtomicPoolCurrencyMapItem, Currency } from "@/types";
import { NETWORK } from "@/services/config.service";
import { getHttpV4Endpoint, Network } from "@orbs-network/ton-access";
import { address, Address, OpenedContract, TonClient4 } from "@ton/ton";
import { CHAIN, ConnectedWallet, TonConnectUI, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { Wallet, WalletFees, WalletState } from "@/components/Services/ton-comms/Wallet";
import { AtomicDex, AtomicPool, SwapOrder } from "@/services/AtomicDex/AtomicDex.service";
import { getPoolList } from "@/services/swap/swap.service";
import { getLastBlockSeqNo } from "@/services/ton.service";

type ExchangeRateKey = `${string}-${string}`;
const NETWORK_MISMATCH_ERROR_MESSAGE = 'Your wallet must be on '

type Model = {
    amount: string;
    selectedFromCurrency: Currency;
    selectedToCurrency: Currency;
    currentExchangeRate: number;
    errorMessage: string;
    tonBalance: bigint | undefined;
    address?: Address

    currencyList: Currency[];
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
    getCurrencyList: () => void;
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
    pools: Record<string, AtomicPool & AtomicPoolCurrencyMapItem>,

}

const atomicDex = AtomicDex.fromAddress(Address.parse("EQCANtHMd-perMjM3Tk2xKoDkD3BN_CiJaGu4kqKcHmm4sdP"))

const useSwapModel = create<Model>((set, get) => ({
    amount: "0.0",
    tonClient: undefined,
    tonBalance: 0n,
    network: NETWORK,
    TONToUSD: 0,
    pools: {},

    errorMessage: "",
    selectedFromCurrency: {
        symbol: "TON",
        icon: "/icons/ton.svg",
    } as Currency,
    selectedToCurrency: {
        symbol: "MevTon",
        icon: "/icons/mevton.svg",
    } as Currency,
    currentExchangeRate: 1,
    currencyList: [] as Currency[],
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
        set({ amount: formatted })
    },

    setFromCurrency: () => {
    },
    setToCurrency: () => { },
    maxAmountInTon: () => { return "0.0" },
    setAmountToMax: () => { },
    getCurrencyList: () => {
        set({
            currencyList: [
                {
                    symbol: "TON",
                    icon: "/icons/ton.svg",
                },
                {
                    symbol: "MevTon",
                    icon: "/icons/mevton.svg",
                },
            ]
        })
    },

    switchCurrencies: () => {
        const { selectedFromCurrency, selectedToCurrency } = get();
        set({
            selectedFromCurrency: selectedToCurrency,
            selectedToCurrency: selectedFromCurrency,
        })
    },

    init: async (tonConnectUI: TonConnectUI) => {
        if (get().inited) return;
        const tonClient = new TonClient4({ endpoint: 'http://49.12.86.187:8091/jsonRPC' });
        const atomicDexContract = tonClient.open(atomicDex);

        set({
            tonConnectUI,
            tonClient,
            inited: true,
            atomicDexContract,
        });
        get().connectWallet();
        getPoolList()
            .then((pools) => set({ pools }))
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
            .then((price) => set({ TONToUSD: price }))
            .catch((error) => console.error('Error:', error))
    },
    isMainnet() {
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
    }
}))


export function DexSwapTab() {
    const model = useSwapModel();
    const [tonConnectUi] = useTonConnectUI();

    useEffect(() => {
        if (!tonConnectUi) return;
        model.init(tonConnectUi);
    }, [tonConnectUi]);
    return (
        <>
            <SwapInput
                min={0}
                id="stake-amount"
                type="text"
                value={model.amount}
                onChange={model.setAmount}
                inputMode="decimal"
                placeholder={formatCryptoAmount(0)}
                label="Sell"
                cryptoName={model.selectedFromCurrency.symbol}
                cryptoIcon={model.selectedFromCurrency.icon}
                invalid={!!model.errorMessage}
                error={model.errorMessage}
                endLabel={<div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    <span style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "var(--color-text-secondary)",
                    }}>
                        <AnimatedNumber value={model.maxAmountInTon()} formatValue={formatCryptoAmount} duration={300} /></span>
                    <MiniButton
                        disabled={parseFloat(model.maxAmountInTon()) === 0}
                        onClick={() => model.setAmountToMax()}>Max</MiniButton>
                </div>}
            />
            <div
                className={styles.SwapButtonContainer}
            >
                <div className={styles.SwapButtonWrapper}>
                    <MainButton
                        square
                        variant="secondary"
                        onClick={model.switchCurrencies}
                        className={styles.SwapButton}>
                        <img src="/icons/switch.svg" alt="swap" />
                    </MainButton>
                </div>
            </div>

            <SwapInput
                min={0}
                id="stake-you-receive"
                value={model.maxAmountInTon()}
                label="Buy"
                cryptoName={model.selectedToCurrency.symbol}
                cryptoIcon={model.selectedToCurrency.icon}
                disabled
                type="text"
            />
            <pre>
                {JSON.stringify({
                    inited: model.inited,
                    isConnected: model.isConnected(),
                    address: model.address?.toString(),
                    tonBalance: model.tonBalance?.toString(),
                    pools: model.pools,
                }, null, 2)}
            </pre>
            <MainButton fullWidth>Connect Wallet</MainButton>
        </>
    )
}