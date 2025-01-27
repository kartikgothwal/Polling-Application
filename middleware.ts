import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyJwtToken } from "./utils/verify-auth-token";
const publicRoutes: string[] = ["/"];
const protectedRoutes: string[] = ["/dashboard"];
export async function middleware(request: NextRequest) {
  try {
    const path: string = request.nextUrl.pathname;
    const cookieStore = cookies();
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

    return NextResponse.next();
  } catch (error) {
    console.error("🚀 ~ middleware error:", error);  
    return handleError(request, error);
  }
}

// Error handling middleware
export function handleError(
  request: NextRequest,
  error: unknown,
  statusCode: number = 500
) {
  const errorMessage = "An unexpected error occurred.";
  return new NextResponse(JSON.stringify({ message: errorMessage, error }), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export const config = {
  matcher: ["/", "/dashboard"],
};
