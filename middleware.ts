import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyJwtToken } from "./utils/VerifyToken";
const publicRoutes: string[] = ["/"];
const protectedRoutes: string[] = ["/dashboard"];
export async function middleware(request: NextRequest) {
  try {
    const path: string = request.nextUrl.pathname;
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get("token")?.value.trim();
    const isProtectedRoute: boolean = protectedRoutes.includes(path);
    const isPublicRoute: boolean = publicRoutes.includes(path);
    if (token && (!token.includes(".") || token.split(".").length !== 3)) {
      cookieStore.delete("token");
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (token && isPublicRoute) {
      const isValidToken = await VerifyJwtToken(token);
      if (isValidToken) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    } else if (isProtectedRoute) {
      if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      const isValidToken = await VerifyJwtToken(token);
      if (!isValidToken) {
        cookieStore.delete("token");
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }
  } catch (error: unknown) {
    console.error("🚀 ~ middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/dashboard"],
};
