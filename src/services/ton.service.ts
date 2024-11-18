import { TON_API_URL } from "./config.service";

export const getLastBlockSeqNo = async () => {
    const endpoint = `${TON_API_URL}/getMasterchainInfo`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    return data.result.last.seqno;
};