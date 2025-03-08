import { NativeJettonModel } from '@/models/NativeJetton.model';
import { TON_CENTER_API_URL } from '@/services/config.service';
import { DEFAULT_CURRENCIES } from '@/services/Defaults';
import { TonCenterJettonPairs } from '@/types/toncenter';
import { QueryClient } from '@tanstack/react-query'


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },

    },
});

export const getListOfJettonWallets = async (address: string): Promise<NativeJettonModel[]> => {
    if (!address) {
        return [];
    }
    const response = await fetch(`${TON_CENTER_API_URL}/api/v3/jetton/wallets?owner_address=${address}&limit=100&offset=0`);
    const res: TonCenterJettonPairs = await response.json();

    return DEFAULT_CURRENCIES.map((currency) => {
        if (!currency.display) {
            return undefined;
        }
        console.log("JETTTON MASTER", currency.jettonMasterAddress, currency.name)
        const jetton = res.jetton_wallets.find((wallet) => wallet.jetton.toLocaleLowerCase() === currency.jettonMasterAddress.toLocaleLowerCase());

        if (!jetton) {
            return NativeJettonModel.fromEmpty(currency.jettonMasterAddress, currency);
        }

        return new NativeJettonModel(jetton, res.metadata[jetton.jetton], currency)
    }).filter((jetton) => jetton !== undefined) as NativeJettonModel[];
}