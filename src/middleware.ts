// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Matches everything except static files (_next, etc.)
    "/api/trpc/(.*)",             // Ensure it includes tRPC calls
  ],
};