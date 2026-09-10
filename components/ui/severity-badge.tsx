import type { AlertSeverity } from "@/lib/types/database.types";
import { severityLabel, severityTone } from "@/lib/severity";
import { Badge, type BadgeProps } from "@/components/ui/badge";

/** Tone maps `Tone` (from lib/severity.ts) onto Badge's own tone scale. */
const TONE_TO_BADGE_TONE: Record<ReturnType<typeof severityTone>, BadgeProps["tone"]> = {
  critical: "critical",
  warn: "warn",
  info: "info",
  muted: "neutral",
};

export interface SeverityBadgeProps extends Omit<BadgeProps, "tone" | "children"> {
  severity: AlertSeverity;
}

/**
 * Renders an `AlertSeverity` through the single shared mapping in
 * `lib/severity.ts`. Never re-derive severity → colour anywhere else.
 */
export function SeverityBadge({ severity, ...props }: SeverityBadgeProps) {
  const tone = severityTone(severity);
  return (
    <Badge tone={TONE_TO_BADGE_TONE[tone]} {...props}>
      {severityLabel(severity)}
    </Badge>
  );
}
