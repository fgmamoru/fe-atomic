import { sign } from "@ton/crypto";
import { NextRequest, NextResponse } from "next/server";

const SIGN_PRIVATE_KEY = process.env.SIGN_PRIVATE_KEY!;
const privKey = Buffer.from(SIGN_PRIVATE_KEY, 'hex');



export async function POST(request: NextRequest) {
    // check jwt

    // sign hash
    const body = await request.json();

    if (!body.hash) {
        return new Response("hash is required", { status: 400 });
    }


    const hash: string = body.hash;

    // conver hash in hex to bigint

    const hashBuffer = Buffer.from(hash, 'hex');


    const signature = sign(hashBuffer, privKey);

    return NextResponse.json({
        signature: signature.toString('hex'),
    });
}