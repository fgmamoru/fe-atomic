export const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    console.warn("API_URL is not set");
}
export const API_SCHEME = process.env.NEXT_PUBLIC_API_SCHEME || "https";
export const TREASURY_CONTRACT_ADDR = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDR as string;
if (!TREASURY_CONTRACT_ADDR) {
    console.warn("TREASURY_CONTRACT_ADDR is not set");
}
export const ENV = process.env.NEXT_PUBLIC_ENV as "local" | "development" | "production";
if (!ENV) {
    console.warn("ENV is not set");
}
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK || "testnet") as "mainnet" | "testnet";
if (!NETWORK) {
    console.warn("NETWORK is not set");
}
if (NETWORK === "mainnet" || NETWORK === "testnet") {
    console.warn("NETWORK is not set to mainnet or testnet");
}
if (ENV === "production" && NETWORK === "testnet") {
    console.warn("ENV is production and NETWORK is testnet");
}

export const MTON_ADDRESS = process.env.NEXT_PUBLIC_MTON_ADDRESS as string;
if (!MTON_ADDRESS) {
    console.warn("MTON_ADDRESS is not set");
}

export const STONFI_PROXY_TON_ADDRESS = process.env.NEXT_PUBLIC_STONFI_PROXY_TON_ADDRESS as string || "kQACS30DNoUQ7NfApPvzh7eBmSZ9L4ygJ-lkNWtba8TQT-Px" // pTON v2.1.0;
if (!STONFI_PROXY_TON_ADDRESS) {
    console.warn("STONFI_PROXY_TON_ADDRESS is not set");
}

export const STONFI_ROUTER_ADDRESS = process.env.NEXT_PUBLIC_STONFI_ROUTER_ADDRESS as string || "kQALh-JBBIKK7gr0o4AVf9JZnEsFndqO0qTCyT-D-yBsWk0v" // CPI Router v2.1.0;

if (!STONFI_ROUTER_ADDRESS) {
    console.warn("STONFI_ROUTER_ADDRESS is not set");
}

export const HOST = process.env.HOST || process.env.NEXT_PUBLIC_HOST || "localhost:3000";

if (!HOST) {
    console.warn("HOST is not set");
}

if (ENV !== "local" && HOST === "localhost") {
    console.warn("ENV is production and HOST is localhost");
}

export const HOST_SCHEME = process.env.NEXT_PUBLIC_HOST_SCHEME || "http";