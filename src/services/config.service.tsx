export const ATOMIC_DEX_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ATOMIC_DEX_CONTRACT_ADDRESS!;

if (!ATOMIC_DEX_CONTRACT_ADDRESS) {
    console.warn("ATOMIC_DEX_CONTRACT_ADDRESS is not set");
}

export const TON_NETWORK_URL = process.env.NEXT_PUBLIC_TON_NETWORK_URL!;

if (!TON_NETWORK_URL) {
    console.warn("TON_NETWORK_URL is not set");
}

export let NETWORK = process.env.NEXT_PUBLIC_NETWORK! as "mainnet" | "testnet";
if (!NETWORK) {
    console.warn("NETWORK is not set, setting to testnet");
    NETWORK = "testnet";
}

if (NETWORK !== "mainnet" && NETWORK !== "testnet") {
    console.warn("NETWORK is not set to mainnet or testnet");
}

export let TON_CENTER_API_URL = process.env.NEXT_PUBLIC_TON_CENTER_API_URL!;
if (!TON_CENTER_API_URL) {
    console.warn("TON_API_URL is not set, setting based on NETWORK");

    if (NETWORK == "testnet") {
        TON_CENTER_API_URL = "https://testnet.toncenter.com";
    } else {
        TON_CENTER_API_URL = "https://toncenter.com";
    }
}

export const ENV = process.env.NEXT_PUBLIC_ENV as "local" | "development" | "production";
if (!ENV) {
    console.warn("ENV is not set");
}

if (ENV === "production" && NETWORK === "testnet") {
    console.warn("ENV is production and NETWORK is testnet");
}

export const HOST = process.env.HOST || process.env.NEXT_PUBLIC_HOST || "localhost:3000";

if (!HOST) {
    console.warn("HOST is not set");
}

if (ENV !== "local" && HOST === "localhost") {
    console.warn("ENV is production and HOST is localhost");
}

export const CONFIG = {
    TON_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("TON", process.env.NEXT_PUBLIC_TON_MASTER_CONTRACT_ADDRESS),
    USDT_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("USDT", process.env.NEXT_PUBLIC_USDT_MASTER_CONTRACT_ADDRESS),
    BTC_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("BTC", process.env.NEXT_PUBLIC_BTC_MASTER_CONTRACT_ADDRESS),
    ETH_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("ETH", process.env.NEXT_PUBLIC_ETH_MASTER_CONTRACT_ADDRESS),
    DOGS_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("DOGS", process.env.NEXT_PUBLIC_DOGS_MASTER_CONTRACT_ADDRESS),
    NOT_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("NOT", process.env.NEXT_PUBLIC_NOT_MASTER_CONTRACT_ADDRESS),
    CATS_MASTER_CONTRACT_ADDRESS: validateDefaultJettonMasterAddress("CATS", process.env.NEXT_PUBLIC_CATS_MASTER_CONTRACT_ADDRESS),
}

function validateDefaultJettonMasterAddress(name: string, value?: string): string {

    if (!value) {
        console.warn(`${name} master contract address is not set NEXT_PUBLIC_${name}_MASTER_CONTRACT_ADDRESS`);
    }

    return value || "";
}















/**
 * OLD CONFIG SECTION
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    console.warn("API_URL is not set");
}
export const API_SCHEME = process.env.NEXT_PUBLIC_API_SCHEME || "https";

