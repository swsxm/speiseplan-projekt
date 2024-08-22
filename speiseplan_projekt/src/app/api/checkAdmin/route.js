import { verifyAuth } from '@/lib/verifyToken';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    try {
        const verifiedToken = await verifyAuth(token);
        return NextResponse.json({ isAdmin: verifiedToken.admin }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
}
