import { NextResponse } from "next/server";
import { getDataSourceMode } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight health/readiness check for uptime monitors and deploy smoke
 * tests. Reports non-sensitive mode flags only — never secrets or credentials.
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    dataSource: getDataSourceMode(), // "mock" | "live"
  });
}
