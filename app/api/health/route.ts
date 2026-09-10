import { NextResponse } from "next/server";
import { getStatusReport } from "@/lib/status";

// This route calls out to Supabase on every request and must reflect live
// state, not a build-time snapshot — an uptime monitor polling a cached
// response would never see an outage.
export const dynamic = "force-dynamic";

/**
 * Machine-readable health check. `getStatusReport` never throws (every
 * underlying check is wrapped so a failure reports `down` instead), so this
 * always resolves — the only thing that varies is the status code: `down`
 * anywhere in the report is the one case an uptime monitor should treat as a
 * failed check.
 */
export async function GET() {
  const report = await getStatusReport();
  return NextResponse.json(report, {
    status: report.status === "down" ? 503 : 200,
  });
}
