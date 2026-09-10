import type { ComparisonRow } from '@/lib/marketing/comparisons'

/**
 * Capability table for `/compare/[slug]`. Server component, no client JS.
 * Wrapped in its own `overflow-x-auto` container per the responsive rules —
 * this is the one thing on the page allowed to be wider than the viewport.
 */
export function ComparisonTable({
  competitorName,
  rows,
}: {
  competitorName: string
  rows: ComparisonRow[]
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[560px] border-collapse text-ui">
        <thead>
          <tr className="border-b border-border bg-bg-subtle">
            <th
              scope="col"
              className="px-4 py-3 text-left text-label uppercase tracking-[0.06em] text-text-faint"
            >
              Capability
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-label uppercase tracking-[0.06em] text-accent"
            >
              PageWatch
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-label uppercase tracking-[0.06em] text-text-faint"
            >
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.capability} className="bg-panel">
              <th scope="row" className="px-4 py-3 text-left align-top text-ui font-normal text-text">
                {row.capability}
              </th>
              <td className="px-4 py-3 align-top text-ui text-text">{row.pagewatch}</td>
              <td className="px-4 py-3 align-top text-ui text-text-muted">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
