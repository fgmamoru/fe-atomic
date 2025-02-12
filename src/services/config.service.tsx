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



















/**
 * OLD CONFIG SECTION
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    console.warn("API_URL is not set");
}
export const API_SCHEME = process.env.NEXT_PUBLIC_API_SCHEME || "https";

