import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";
import { Address, Cell } from "@ton/core";
import { TonClient } from "@ton/ton";
import BN from "bn.js";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { CheckProofPayload } from "./dto";
import debug from "debug";

const debugLog = debug("app:be:check-proof");
const DOMAIN = process.env.DOMAIN!;
debug.enable("app:be:check-proof");
const SHARED_SECRET = process.env.SHARED_SECRET!;
const PAYLOAD_TTL = parseInt(process.env.PAYLOAD_TTL!) || 3600;
const PROOF_TTL = parseInt(process.env.PROOF_TTL!);
const AUTH_PRIVATE_KEY = process.env.AUTH_PRIVATE_KEY!;
const AUTH_PUBLIC_KEY = process.env.AUTH_PUBLIC_KEY!;

export async function POST(request: NextRequest) {
    const body = await request.json();
    debugLog("POST /api/check-proof", body);

    const { proof, address, network } = CheckProofPayload.parse(body);
    const payload = Buffer.from(proof.payload, "hex");

    if (payload.length !== 32) {
        return NextResponse.json({
            error: `invalid payload length, got ${payload.length}, expected 32`,
        });
    }

    const mac = crypto.createHmac("sha256", SHARED_SECRET);
    mac.update(payload.subarray(0, 16));
    const payloadSignatureBytes = mac.digest();

    const signatureValid = payload
        .subarray(16)
        .equals(payloadSignatureBytes.subarray(0, 16));
    if (!signatureValid) {
        return NextResponse.json({ error: "invalid payload signature" }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // check payload expiration
    const expireBytes = payload.subarray(8, 16);
    const expireTime = expireBytes.readBigUint64BE();
    if (BigInt(now) > expireTime) {
        return NextResponse.json({ error: "payload expired" }, { status: 400 });
    }

    // check ton proof expiration
    if (now > proof.timestamp + PROOF_TTL) {
        return NextResponse.json({ error: "ton proof has been expired" }, { status: 400 });

    }

    if (proof.domain.value !== DOMAIN) {
        return NextResponse.json({
            error: `wrong domain, got ${proof.domain.value}, expected ${DOMAIN}`,
        }, { status: 400 });
    }

    if (proof.domain.lengthBytes !== proof.domain.value.length) {
        return NextResponse.json({
            error: `domain length mismatched against provided length bytes of ${proof.domain.lengthBytes}`,
        }, { status: 400 });
    }

    const parsedAddress = Address.parse(address);

    const wc = Buffer.alloc(4);
    wc.writeInt32BE(parsedAddress.workChain);

    const ts = Buffer.alloc(8);
    ts.writeBigUint64LE(BigInt(proof.timestamp));

    const dl = Buffer.alloc(4);
    dl.writeUint32LE(proof.domain.value.length);

    const tonProofPrefix = "ton-proof-item-v2/";
    const msg = Buffer.concat([
        Buffer.from(tonProofPrefix),
        wc,
        parsedAddress.hash,
        dl,
        Buffer.from(proof.domain.value),
        ts,
        Buffer.from(proof.payload),
    ]);

    const msgHash = crypto.createHash("sha256").update(msg).digest();

    const tonConnectPrefix = "ton-connect";
    const fullMsg = Buffer.concat([
        Buffer.from([0xff, 0xff]),
        Buffer.from(tonConnectPrefix),
        msgHash,
    ]);

    const fullMsgHash = crypto.createHash("sha256").update(fullMsg).digest();

    const client = new TonClient({
        endpoint: `https://${network === "TESTNET" ? "testnet." : ""
            }toncenter.com/api/v2/jsonRPC`,
    });
    const executionRes = await client.runMethodWithError(
        parsedAddress,
        "get_public_key"
    );
    let pubkey: Buffer;

    if (executionRes.exit_code === 0) {
        const pubkeyNum = executionRes.stack.readBigNumber();
        const pubkeyBn = new BN(pubkeyNum.toString());
        pubkey = pubkeyBn.toBuffer("be", 32);
    } else {
        const codes = {
            V1R1: "te6cckEBAQEARAAAhP8AIN2k8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVEH98Ik=",
            V1R2: "te6cckEBAQEAUwAAov8AIN0gggFMl7qXMO1E0NcLH+Ck8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVNDieG8=",
            V1R3: "te6cckEBAQEAXwAAuv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCBAgDXGCDXCx/tRNDTH9P/0VESuvKhIvkBVBBE+RDyovgAAdMfMSDXSpbTB9QC+wDe0aTIyx/L/8ntVLW4bkI=",
            V2R1: "te6cckEBAQEAVwAAqv8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VShNwu2",
            V2R2: "te6cckEBAQEAYwAAwv8AIN0gggFMl7ohggEznLqxnHGw7UTQ0x/XC//jBOCk8mCDCNcYINMf0x8B+CO78mPtRNDTH9P/0VExuvKhA/kBVBBC+RDyovgAApMg10qW0wfUAvsA6NGkyMsfy//J7VQETNeh",
            V3R1: "te6cckEBAQEAYgAAwP8AIN0gggFMl7qXMO1E0NcLH+Ck8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVD++buA=",
            V3R2: "te6cckEBAQEAcQAA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVBC9ba0=",
            V4R1: "te6cckECFQEAAvUAART/APSkE/S88sgLAQIBIAIDAgFIBAUE+PKDCNcYINMf0x/THwL4I7vyY+1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8REhMUA+7QAdDTAwFxsJFb4CHXScEgkVvgAdMfIYIQcGx1Z70ighBibG5jvbAighBkc3RyvbCSXwPgAvpAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8F4ATTP8glghBwbHVnupEx4w0kghBibG5juuMABAYHCAIBIAkKAFAB+gD0BDCCEHBsdWeDHrFwgBhQBcsFJ88WUAP6AvQAEstpyx9SEMs/AFL4J28ighBibG5jgx6xcIAYUAXLBSfPFiT6AhTLahPLH1Iwyz8B+gL0AACSghBkc3Ryuo41BIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UghBkc3Rygx6xcIAYUATLBVjPFiL6AhLLassfyz+UEDRfBOLJgED7AAIBIAsMAFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQCAVgNDgARuMl+1E0NcLH4AD2ynftRNCBAUDXIfQEMALIygfL/8nQAYEBCPQKb6ExgAgEgDxAAGa3OdqJoQCBrkOuF/8AAGa8d9qJoQBBrkOuFj8AAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJcfsAyEAUgQEI9FHypwIAbIEBCNcYyFQgJYEBCPRR8qeCEG5vdGVwdIAYyMsFywJQBM8WghAF9eEA+gITy2oSyx/JcfsAAgBygQEI1xgwUgKBAQj0WfKn+CWCEGRzdHJwdIAYyMsFywJQBc8WghAF9eEA+gIUy2oTyx8Syz/Jc/sAAAr0AMntVEap808=",
            V4R2: "te6cckECFAEAAtQAART/APSkE/S88sgLAQIBIAIPAgFIAwYC5tAB0NMDIXGwkl8E4CLXScEgkl8E4ALTHyGCEHBsdWe9IoIQZHN0cr2wkl8F4AP6QDAg+kQByMoHy//J0O1E0IEBQNch9AQwXIEBCPQKb6Exs5JfB+AF0z/IJYIQcGx1Z7qSODDjDQOCEGRzdHK6kl8G4w0EBQB4AfoA9AQw+CdvIjBQCqEhvvLgUIIQcGx1Z4MesXCAGFAEywUmzxZY+gIZ9ADLaRfLH1Jgyz8gyYBA+wAGAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+ICASAHDgIBIAgNAgFYCQoAPbKd+1E0IEBQNch9AQwAsjKB8v/ydABgQEI9ApvoTGACASALDAAZrc52omhAIGuQ64X/wAAZrx32omhAEGuQ64WPwAARuMl+1E0NcLH4AFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQE+PKDCNcYINMf0x/THwL4I7vyZO1E0NMf0x/T//QE0VFDuvKhUVG68qIF+QFUEGT5EPKj+AAkpMjLH1JAyx9SMMv/UhD0AMntVPgPAdMHIcAAn2xRkyDXSpbTB9QC+wDoMOAhwAHjACHAAuMAAcADkTDjDQOkyMsfEssfy/8QERITAG7SB/oA1NQi+QAFyMoHFcv/ydB3dIAYyMsFywIizxZQBfoCFMtrEszMyXP7AMhAFIEBCPRR8qcCAHCBAQjXGPoA0z/IVCBHgQEI9FHyp4IQbm90ZXB0gBjIywXLAlAGzxZQBPoCFMtqEssfyz/Jc/sAAgBsgQEI1xj6ANM/MFIkgQEI9Fnyp4IQZHN0cnB0gBjIywXLAlAFzxZQA/oCE8tqyx8Syz/Jc/sAAAr0AMntVAj45Sg=",
        };

        const boc = Cell.fromBase64(proof.state_init);
        const code = boc.refs[0];
        const data = boc.refs[1];
        const version = code.toBoc().toString("base64");

        switch (version) {
            case codes.V1R1:
            case codes.V1R2:
            case codes.V1R3:
            case codes.V2R1:
            case codes.V2R2: {
                // skip seqno
                pubkey = data.asSlice().skip(32).loadBuffer(32);
                break;
            }
            case codes.V3R1:
            case codes.V3R2:
            case codes.V4R1:
            case codes.V4R2: {
                // skip seqno, walletId
                pubkey = data.asSlice().skip(64).loadBuffer(32);
                break;
            }
            default: {
                return NextResponse.json({
                    error: "unsupported wallet version",
                });
            }
        }
    }

    const proofSignatureBytes = Buffer.from(proof.signature, "base64");
    const verified = nacl.sign.detached.verify(
        fullMsgHash,
        proofSignatureBytes,
        pubkey
    );

    if (!verified) {
        return NextResponse.json({
            error: "verification failed",
        }, { status: 401 });

    }

    const claims = {
        exp: now + PAYLOAD_TTL,
        address: parsedAddress.toString(),
    };
    const token = jwt.sign(claims, SHARED_SECRET);

    const signature = generateSignature(getMessageToSign(proof.payload, address));

    const result = {
        token,
        signature,
        ttl: now + PAYLOAD_TTL,
    }

    debugLog("POST /api/check-proof result", result);

    return NextResponse.json(result);
}

function generateSignature(message: string) {
    debugLog("AUTH_PRIVATE_KEY", AUTH_PRIVATE_KEY);
    debugLog("AUTH_PUBLIC_KEY", AUTH_PUBLIC_KEY);
    debugLog("!!!message", message);
    debugLog("!!!privKey", AUTH_PRIVATE_KEY);

    const privKey = Buffer.from(AUTH_PRIVATE_KEY, 'hex');
    debugLog("!!!privKey", privKey);
    const signature = crypto.sign(null, Buffer.from(message, 'hex'), {
        key: privKey,
        format: "der",
        type: "pkcs8",
    });


    return signature.toString("base64");
};

function getMessageToSign(payload: string, address: string) {
    return `${payload}:${address}`;
}