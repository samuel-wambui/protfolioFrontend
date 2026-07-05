import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://portfoliobackend-ltak.onrender.com/api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const enrichedPayload = {
      ...payload,
      city: payload.city ?? decodedHeader(request, "x-vercel-ip-city"),
      country: payload.country ?? header(request, "x-vercel-ip-country"),
      ipAddress: payload.ipAddress ?? firstForwardedIp(request),
      latitude: payload.latitude ?? header(request, "x-vercel-ip-latitude"),
      longitude: payload.longitude ?? header(request, "x-vercel-ip-longitude"),
      region: payload.region ?? header(request, "x-vercel-ip-country-region"),
    };

    const response = await fetch(`${API_BASE_URL}/analytics/events`, {
      body: JSON.stringify(enrichedPayload),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 202 });
    }

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}

function firstForwardedIp(request: NextRequest): string | null {
  const forwardedFor = header(request, "x-forwarded-for");
  if (!forwardedFor) {
    return header(request, "x-real-ip");
  }

  return forwardedFor.split(",")[0]?.trim() || null;
}

function decodedHeader(request: NextRequest, name: string): string | null {
  const value = header(request, name);
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function header(request: NextRequest, name: string): string | null {
  const value = request.headers.get(name);
  return value?.trim() || null;
}
