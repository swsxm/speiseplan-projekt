import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {verifyAuth} from '@/lib/verifyToken'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const verifiedToken =
      token &&
      (await verifyAuth(token).catch((err) => {
        console.log(err)
      }))

}