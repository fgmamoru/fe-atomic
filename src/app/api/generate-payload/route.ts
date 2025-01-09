import crypto from "crypto";
import { NextResponse } from "next/server";

const DOMAIN = process.env.DOMAIN!;
const SHARED_SECRET = process.env.SHARED_SECRET!;
// from config or 1h
const PAYLOAD_TTL = parseInt(process.env.PAYLOAD_TTL!) || 3600;
const PROOF_TTL = parseInt(process.env.PROOF_TTL!);

// A faulty API route to test Sentry's error monitoring
export function GET() {
    // ```
    // 0             8                 16               48
    // | random bits | expiration time | sha2 signature |
    // 0                                       32
    // |             payload_hex               |
    // ```
    const randomBits = crypto.randomBytes(8);
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = Buffer.alloc(8);
    expirationTime.writeBigUint64BE(BigInt(currentTime + PAYLOAD_TTL));
    const payload = Buffer.concat([randomBits, expirationTime]);

    const hmac = crypto.createHmac("sha256", SHARED_SECRET);
    hmac.update(payload);
    const signature = hmac.digest();

    const finalPayload = Buffer.concat([payload, signature]);

    const payloadHex = finalPayload.subarray(0, 32).toString("hex");

    return NextResponse.json({ payload: payloadHex });
}
