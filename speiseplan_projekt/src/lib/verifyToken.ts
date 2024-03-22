import { jwtVerify, JWTPayload } from "jose";

interface UserJwtPayload extends JWTPayload {
    jti: string;
    iat: number;
    admin: boolean; 
    user: string;
    email: string;
    employee_number: number;
}

export const getJwtSecretKey = () => {
    const secret = process.env.TOKEN_SECRET;

    if (!secret || secret.length === 0) {
        throw new Error('The environment variable TOKEN_SECRET is not set.');
    }
    return secret;
};

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
        const payload = verified.payload as UserJwtPayload; 
        return payload;
    } catch {
        throw new Error('Your token has expired.');
    }
};