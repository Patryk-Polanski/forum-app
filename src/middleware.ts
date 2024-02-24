import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
}

// only run the middleware when the below url paths are matched
export const config = {
  matcher: ["/r/:path*/submit", "/r/create"],
};
