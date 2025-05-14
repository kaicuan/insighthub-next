// @/api/auth/uq-callback/route.ts
import { signIn } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export async function GET(request: NextRequest) {
  const ourl = new URL(request.url);
  const callbackUrl = ourl.searchParams.get('callbackUrl');
  const callbackUrlParam = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""
  
  const {
    headers,
    nextUrl: { protocol, host, pathname, search },
  } = request;
  const detectedHost = headers.get("x-forwarded-host") ?? host;
  const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol;
  const _protocol = `${detectedProtocol.replace(/:$/, "")}:`;
  const url = new URL(_protocol + "//" + detectedHost + basePath + pathname + search);

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
        new URL(basePath + `/request-consent` + callbackUrlParam, url)
      );
    }
    
    return NextResponse.redirect(
      new URL(basePath + `/signin?error=${encodeURIComponent(errorMessage)}`, url)
    );
  }

  return NextResponse.redirect(
    new URL(callbackUrl || basePath + "/workspace", url)
  );
}