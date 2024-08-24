import { jwtVerify, JWTPayload } from "jose";
import {NextResponse, NextRequest } from "next/server";

interface UserJwtPayload extends JWTPayload {
    jti: string;
    iat: number;
    admin: boolean; 
    user: string;
    email: string;
    employee_number: number;
}

export function getJwtSecretKey() {
/**
 * Return the JWT Secret
 */
    const secret = process.env.TOKEN_SECRET;

    if (!secret || secret.length === 0) {
        throw new Error('The environment variable TOKEN_SECRET is not set.');
    }
    return secret;
};


export async function verifyAuth(token: string) {
/**
 * Verification of the JWT Token 
 */
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
        const payload = verified.payload as UserJwtPayload; 
        return payload;
    } catch {
        throw new Error('Your token has expired.');
    }
};


export async function verifyAdmin(req: NextRequest) {
/**
 * Admin Verification 
 */
    const token = req.cookies.get('token')?.value
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const payload = await verifyAuth(token);
    if (!payload.admin) {
        return NextResponse.json({ status: 403, message: "Forbidden" });
    }
    return payload;
}


export async function verifyUser(req: NextRequest) {
/**
 * User Verification 
 */
    const token = req.cookies.get('token')?.value
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const payload = await verifyAuth(token);
    return payload
}