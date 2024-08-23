import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/verifyToken';
export async function GET(req) {
    const check = await verifyAdmin(req)
    if (check instanceof NextResponse){
        return check
    }
    const payload = check
    return NextResponse.json(payload)
}
