import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyUser } from '@/lib/verifyToken';

interface isAdmin {
  admin: boolean;
}

/**
 * This function checks if the result is not null
 * and if it has an admin attribute, the admin attribute
 * is than passed as the result
 */
function isJwtPayload(result: any): result is isAdmin {
  return result != null && 'admin' in result;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const verificationResult = token ? await verifyUser(request) : null;
  let isAdmin = false;
  let validToken = false;


  if (isJwtPayload(verificationResult)) {
    validToken = true;
    isAdmin = verificationResult.admin;
  }

  // ADMIN PAGE FILTERING
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (validToken && isAdmin) {
      return NextResponse.next(); // Allow access to admin page
    }
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to homepage if not admin
  }

  // LOGIN PAGE FILTERING
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (validToken && isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url)); // Redirect to admin if admin
    }
    if (validToken) {
      return NextResponse.redirect(new URL('/profile', request.url)); // Redirect to profile if logged in
    }
    return NextResponse.next(); // Allow access to login page if not logged in
  }

  // REGISTER PAGE AUTHENTICATION
  if (request.nextUrl.pathname.startsWith('/register')) {
    if (validToken) {
      return NextResponse.redirect(new URL('/profile', request.url)); // Redirect to profile if logged in
    }
    return NextResponse.next(); // Allow access to register page if not logged in
  }

  // PROFILE PAGE FILTERING
  if (request.nextUrl.pathname.startsWith('/profile') && !validToken) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login if not logged in
  }

  return NextResponse.next(); // Allow access to other pages
}
