import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyJwtToken } from "./utils/verify-auth-token";
const publicRoutes: string[] = ["/"];
const protectedRoutes: string[] = ["/dashboard"];
export async function middleware(request: NextRequest) {
  const path: string = request.nextUrl.pathname;
  if (path === "/") {
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get("token")?.value.trim();
     const isProtectedRoute: boolean = protectedRoutes.includes(path);
    const isPublicRoute: boolean = publicRoutes.includes(path);
    if (token && isPublicRoute) {
      const isValidToken = VerifyJwtToken(token);
      console.log("🚀 ~ middleware ~ isValidToken:", isValidToken);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: "/",
};
