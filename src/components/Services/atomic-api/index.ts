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

export const getListOfJettonWallets = async (address: string) => {
    if (!address) {
        return [];
    }
    const response = await fetch(`${TON_CENTER_API_URL}/api/v3/jetton/wallets?owner_address=${address}&limit=10&offset=0`);
    const res: TonCenterJettonPairs = await response.json();

    return res.jetton_wallets.map((wallet) => {
        const metadata = res.metadata[wallet.jetton];
        const currency = DEFAULT_CURRENCIES.find((currency) => currency.jettonMasterAddress === wallet.jetton);
        if (!currency) {
            return undefined;
        }
        return new NativeJettonModel(wallet, metadata, currency);
    }).filter((wallet) => wallet !== undefined) as NativeJettonModel[];
}

// export const useGetListOfJettonWallets = (address: string) => {
//     return useQuery<NativeJettonModel[]>({
//         queryKey: ['getListOfJettons', address],
//         queryFn: ,
//     });
// }