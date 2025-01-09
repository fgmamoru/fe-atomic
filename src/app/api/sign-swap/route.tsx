import { sign } from "@ton/crypto";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SIGN_PRIVATE_KEY = process.env.SIGN_PRIVATE_KEY!;
const privKey = Buffer.from(SIGN_PRIVATE_KEY, 'hex');
const SHARED_SECRET = process.env.SHARED_SECRET!;



export async function POST(request: NextRequest) {
    // check jwt

    // sign hash
    const body = await request.json();

    if (!body.hash) {
        return new Response("hash is required", { status: 400 });
    }

    if (!body.jwt) {
        return new Response("jwt is required", { status: 400 });
    }

    const jwtToken = body.jwt;

    try {
        jwt.verify(jwtToken, SHARED_SECRET);
    } catch (error) {
        return new Response("Forbidden", { status: 403 });
    }


    const hash: string = body.hash;

    // conver hash in hex to bigint

    const hashBuffer = Buffer.from(hash, 'hex');


    const signature = sign(hashBuffer, privKey);

    return NextResponse.json({
        signature: signature.toString('hex'),
    });
}