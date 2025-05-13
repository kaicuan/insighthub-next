// @/api/auth/uq-callback/route.ts
import { signIn } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get('callbackUrl');

  try {
    await signIn("uqsso", {
      redirect: false,
      request,
    });

  } catch (error) {
    let errorMessage = "Unknown Error";

    if (error instanceof Error) {
      if (typeof error.cause === 'object' && error.cause && 'err' in error.cause) {
        errorMessage = (error.cause as { err: string }).err;
      } else {
        errorMessage = error.message;
      }
    }
    
    if (errorMessage == "Error: MISSING_CONSENT") {
      return NextResponse.redirect(
        new URL(basePath + `/request-consent`, request.url)
      );
    }
    
    return NextResponse.redirect(
      new URL(basePath + `/signin?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }

  return NextResponse.redirect(
    new URL(callbackUrl || basePath + "/workspace", url.origin)
  );
}