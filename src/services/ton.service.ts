import { TON_CENTER_API_URL } from "./config.service";

export const getLastBlockSeqNo = async () => {
    const endpoint = `${TON_CENTER_API_URL}/getMasterchainInfo`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    return data.result.last.seqno;
};

const getTxByMsgBodyHash = async (hash: string) => {
    const endpoint = `${TON_CENTER_API_URL}/api/v3/transactionsByMessage?body_hash=${hash}&limit=10&offset=0`;

    const response = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data: IGetTxByHashResponse = await response.json();

    return data;
}

const getTxByMsgBodyHashPooling = async (hash: string, timeout: number = 60) => {
    const start = Date.now();
    let data = await getTxByMsgBodyHash(hash);

    while (!data.transactions?.length && Date.now() - start < timeout * 1000) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        data = await getTxByMsgBodyHash(hash);
    }

    return data;
}

export const hasTxByMsgBodyHash = async (hash: string) => {
    const data = await getTxByMsgBodyHashPooling(hash);

    return !!data.transactions.length;
}

interface IGetTxByHashResponse {
    transactions: unknown[];
    address_book: unknown[];
}