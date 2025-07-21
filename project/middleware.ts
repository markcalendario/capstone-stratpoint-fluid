import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up"];

export default authMiddleware({
  publicRoutes,

  async afterAuth(auth, req) {
    const url = req.nextUrl.clone();
    const isPublicRoute = publicRoutes.includes(url.pathname);

    // When user is not authenticated
    if (!auth.userId && !isPublicRoute) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    // When user is authenticated
    if (auth.userId && isPublicRoute) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};
