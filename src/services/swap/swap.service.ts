import { TonClient, toNano } from "@ton/ton";
import { DEX, pTON } from "@ston-fi/sdk";
import { MTON_ADDRESS, STONFI_PROXY_TON_ADDRESS, STONFI_ROUTER_ADDRESS } from "../config.service";

const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});

const router = client.open(
    DEX.v2_1.Router.create(
        STONFI_ROUTER_ADDRESS
    )
);


const proxyTon = pTON.v2_1.create(
    STONFI_PROXY_TON_ADDRESS
);


export const getSwapMTonToTonTxParameters = async (params: SwapParams) => {
    const _params = {
        userWalletAddress: params.userWalletAddress,
        offerJettonAddress: MTON_ADDRESS,
        offerAmount: toNano(params.offerAmount),
        minAskAmount: toNano(params.minAskAmount),
        proxyTon,
        queryId: 12345,
    }

    console.log(`params`, _params);

    const txParams = await router.getSwapJettonToTonTxParams(_params);



    return txParams;
};

export type SwapParams = {
    userWalletAddress: string;
    offerAmount: string;
    minAskAmount: string;
};