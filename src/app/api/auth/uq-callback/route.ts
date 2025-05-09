// @/api/auth/uq-callback/route.ts
import { signIn } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

const basePath = process.env.BASE_PATH ?? '';

export async function GET(request: NextRequest) {
  try {
    await signIn("uqsso", {
      redirect: false,
      request,
    });
    return NextResponse.redirect(new URL(basePath + "/workspace", request.url));
  } catch (error) {
    const errorMessage = error.cause.err || "Unknown Error";

    if (errorMessage == "Error: MISSING_CONSENT") {
      return NextResponse.redirect(
        new URL(basePath + `/request-consent`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL(basePath + `/signin?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}