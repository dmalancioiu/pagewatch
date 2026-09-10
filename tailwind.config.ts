import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Geist Sans / Mono, loaded via `geist/font/*` in app/layout.tsx and
        // exposed as CSS variables on <html>. See docs/DESIGN_SYSTEM.md §3.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Named sizes from the DESIGN_SYSTEM.md §3 type scale. Additive only —
      // the default Tailwind scale (text-xs/sm/base/lg/...) is untouched so
      // existing landing/dashboard screens don't reflow.
      fontSize: {
        label: ["11px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.06em" }],
        meta: ["12px", { lineHeight: "1.45", fontWeight: "400" }],
        ui: ["13px", { lineHeight: "1.45", fontWeight: "400" }],
        "ui-medium": ["13px", { lineHeight: "1.45", fontWeight: "500" }],
        "section-title": ["15px", { lineHeight: "1.3", fontWeight: "600" }],
        "page-title": ["20px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.02em" }],
        display: ["48px", { lineHeight: "1.05", fontWeight: "700", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        popover: "var(--shadow-popover)",
      },
      transitionDuration: {
        DEFAULT: "120ms",
      },
      colors: {
        // ── Legacy tokens (dashboard/auth) — kept exactly as-is; other
        // agents' un-rebuilt screens (and the global `* { border-color }` /
        // `body` rules pre-redesign) still resolve against these where
        // referenced. Do not remove entries here without re-grepping first.
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
        muted: "hsl(210 40% 96.1%)",
        mutedForeground: "hsl(215.4 16.3% 46.9%)",
        primary: "hsl(221.2 83.2% 53.3%)",
        primaryForeground: "hsl(210 40% 98%)",
        card: "hsl(0 0% 100%)",
        cardForeground: "hsl(222.2 84% 4.9%)",
        // Landing page design tokens
        base: "#080c14",
        surface: "#11151e",
        "surface-elevated": "#1a1f2c",

        // ── Design system tokens (docs/DESIGN_SYSTEM.md §2) ──────────────
        // `border` and `accent` reuse the legacy top-level keys below: the
        // old `border` value was unused anywhere in the codebase (verified
        // by grep) so its DEFAULT now carries the new hairline token; the
        // old `accent.400/500/600/900` scale IS used by
        // components/dashboard/DashboardNav.tsx, so those numeric keys are
        // preserved unchanged alongside the new DEFAULT/hover/fg/subtle.
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        accent: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          900: "#1e1b4b",
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
          subtle: "var(--accent-subtle)",
        },

        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          subtle: "rgb(var(--bg-subtle) / <alpha-value>)",
        },
        panel: {
          DEFAULT: "rgb(var(--panel) / <alpha-value>)",
          raised: "rgb(var(--panel-raised) / <alpha-value>)",
        },
        text: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          faint: "rgb(var(--text-faint) / <alpha-value>)",
        },
        diff: {
          DEFAULT: "rgb(var(--diff) / <alpha-value>)",
          subtle: "var(--diff-subtle)",
        },
        critical: {
          DEFAULT: "rgb(var(--critical) / <alpha-value>)",
          subtle: "var(--critical-subtle)",
        },
        warn: {
          DEFAULT: "rgb(var(--warn) / <alpha-value>)",
          subtle: "var(--warn-subtle)",
        },
        ok: {
          DEFAULT: "rgb(var(--ok) / <alpha-value>)",
          subtle: "var(--ok-subtle)",
        },
        info: {
          DEFAULT: "rgb(var(--info) / <alpha-value>)",
          subtle: "var(--info-subtle)",
        },
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".4" },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
