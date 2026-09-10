import type { Metadata } from "next";
import { getStatusReport, type ComponentCheckResult, type ComponentStatus, type StatusReport } from "@/lib/status";

export const metadata: Metadata = {
  title: "Status — PageWatch",
  description: "Live status of PageWatch's database, storage, and monitoring pipeline.",
};

// Public page, intentionally unauthenticated — there is no DashboardShell/
// auth guard here (see app/dashboard/layout.tsx for where that lives). It
// must also never be statically prerendered: it reflects live state, and it
// exists specifically for the moment the database is unreachable, so it has
// to run the checks fresh on every request rather than serve a build-time
// snapshot from before things broke.
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<ComponentStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
};

const STATUS_TONE: Record<ComponentStatus, { dot: string; text: string; bg: string; border: string }> = {
  operational: { dot: "bg-ok", text: "text-ok", bg: "bg-ok-subtle", border: "border-ok/30" },
  degraded: { dot: "bg-warn", text: "text-warn", bg: "bg-warn-subtle", border: "border-warn/30" },
  down: { dot: "bg-critical", text: "text-critical", bg: "bg-critical-subtle", border: "border-critical/30" },
};

function OverallBanner({ report }: { report: StatusReport }) {
  const tone = STATUS_TONE[report.status];
  const headline =
    report.status === "operational"
      ? "All systems operational"
      : report.status === "degraded"
        ? "Degraded performance"
        : "Service disruption";

  return (
    <div className={`flex items-center gap-3 rounded-md border ${tone.border} ${tone.bg} px-5 py-4`}>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} aria-hidden="true" />
      <div>
        <div className={`text-section-title font-semibold ${tone.text}`}>{headline}</div>
        <div className="mt-0.5 text-meta text-text-faint">
          Last checked {new Date(report.checkedAt).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" })}
        </div>
      </div>
    </div>
  );
}

function ComponentRow({ component }: { component: ComponentCheckResult }) {
  const tone = STATUS_TONE[component.status];
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
      <div className="text-ui-medium text-text">{component.name}</div>
      <div className="flex items-center gap-2">
        <span className="text-meta text-text-muted">{component.message}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label ${tone.bg} ${tone.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {STATUS_LABEL[component.status]}
        </span>
      </div>
    </div>
  );
}

/**
 * "Recent incidents" driven by the same live check data rather than a
 * hardcoded list — there is no persisted incident-history table (that would
 * need a migration, out of scope for this page), so this reflects the
 * current report only: any component that isn't operational right now,
 * listed as an ongoing incident. It cannot show past incidents that have
 * since resolved.
 */
function IncidentsSection({ report }: { report: StatusReport }) {
  const ongoing = report.components.filter((c) => c.status !== "operational");

  return (
    <section className="mt-10">
      <h2 className="text-section-title font-semibold text-text">Recent incidents</h2>
      {ongoing.length === 0 ? (
        <p className="mt-3 text-ui text-text-muted">No incidents reported.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {ongoing.map((component) => {
            const tone = STATUS_TONE[component.status];
            return (
              <li key={component.name} className={`rounded-md border ${tone.border} ${tone.bg} px-4 py-3`}>
                <div className={`text-ui-medium ${tone.text}`}>
                  {component.name} — {STATUS_LABEL[component.status]}
                </div>
                <div className="mt-1 text-meta text-text-muted">{component.message}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

const FALLBACK_REPORT: StatusReport = {
  status: "down",
  checkedAt: new Date().toISOString(),
  components: [
    { name: "Database", status: "down", message: "Database: unavailable" },
    { name: "Storage", status: "down", message: "Storage: unavailable" },
    { name: "Monitoring", status: "down", message: "Monitoring: unavailable" },
    { name: "Dispatch", status: "down", message: "Dispatch: unavailable" },
  ],
};

export default async function StatusPage() {
  // `getStatusReport` already wraps every check so it never throws, but this
  // page exists specifically for the moment things are broken — a second,
  // page-level fallback means a truly unexpected failure here still renders
  // a status page (reporting everything down) instead of a 500.
  let report: StatusReport;
  try {
    report = await getStatusReport();
  } catch {
    report = FALLBACK_REPORT;
  }

  return (
    <main className="min-h-full bg-bg px-4 py-16 text-text">
      <div className="mx-auto w-full max-w-[640px]">
        <h1 className="text-page-title font-semibold text-text">PageWatch Status</h1>
        <p className="mt-1 text-ui text-text-muted">
          Live status of the database, storage, and monitoring pipeline behind PageWatch.
        </p>

        <div className="mt-8">
          <OverallBanner report={report} />
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-border bg-panel">
          {report.components.map((component) => (
            <ComponentRow key={component.name} component={component} />
          ))}
        </div>

        <IncidentsSection report={report} />
      </div>
    </main>
  );
}
