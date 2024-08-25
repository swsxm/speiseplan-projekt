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
/**
 * Return the JWT Secret
 */
export function getJwtSecretKey() {
    const secret = process.env.TOKEN_SECRET;

    if (!secret || secret.length === 0) {
        throw new Error('The environment variable TOKEN_SECRET is not set.');
    }
    return secret;
};

/**
 * Verification of the JWT Token 
 */
export async function verifyAuth(token: string) {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
        const payload = verified.payload as UserJwtPayload; 
        return payload;
    } catch {
        return false;
    }
};

/**
 * Admin Verification 
 */
export async function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }

    const payload = await verifyAuth(token);

    if (!payload) {
        return NextResponse.json({ status: 403, message: "Forbidden" });
    }
    if (!payload.admin) {
        return NextResponse.json({ status: 403, message: "Forbidden" });
    }
    return payload;
}

/**
 * User Verification 
 */
export async function verifyUser(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const payload = await verifyAuth(token);
    if (payload instanceof NextResponse) {
        return NextResponse.json({ status: 403, message: "Forbidden"});
    }
    return payload;
}