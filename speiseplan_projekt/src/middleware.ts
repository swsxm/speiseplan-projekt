import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {verifyAuth} from '@/lib/verifyToken'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const verifiedToken =
      token &&
      (await verifyAuth(token).catch((err: any) => {
        console.log(err)
      }))

  // ADMIN PAGE FILTERING

  if(request.nextUrl.pathname.startsWith('/admin')) {
    if (verifiedToken && verifiedToken.admin === true){
      return
    }
    else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // LOGIN PAGE FILTERING

  if(request.nextUrl.pathname.startsWith('/login') && verifiedToken && verifiedToken.admin === true){
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  if(request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }
  if(request.nextUrl.pathname.startsWith('/login') && !verifiedToken){
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // REGISTER PAGE AUTHENTICATION
  
  if (request.nextUrl.pathname.startsWith('/register') && !verifiedToken) {
    return;
  }
  if (request.nextUrl.pathname.startsWith('/register') && verifiedToken) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  // PROFILE PAGE FILTERING
  
  if (request.nextUrl.pathname.startsWith('/profile') && !verifiedToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

}