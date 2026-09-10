import { z } from 'zod'

// Converts empty strings from .env files to undefined so optional() works correctly
const opt = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.string().min(1).optional()
)

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url().optional().default('http://localhost:54321')
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().optional().default('placeholder-anon-key')
  ),
  SUPABASE_SERVICE_ROLE_KEY:          opt,
  TRIGGER_SECRET_KEY:                 opt,
  TRIGGER_PROJECT_REF:                opt,
  RESEND_API_KEY:                     opt,
  EMAIL_FROM_DOMAIN:                  z.string().default('yourdomain.com'),
  STRIPE_SECRET_KEY:                  opt,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: opt,
  STRIPE_WEBHOOK_SECRET:              opt,
  // One per self-serve paid plan in lib/plans.ts. The names must track the
  // PlanId values — the old STARTER/AGENCY pair predated the plan catalog and
  // is what let the pricing page, the database and checkout drift apart.
  STRIPE_PRO_PRICE_ID:                opt,
  STRIPE_BUSINESS_PRICE_ID:           opt,
  STRIPE_AGENCY_PRICE_ID:             opt,
  NEXT_PUBLIC_APP_URL:                z.string().default('http://localhost:3000'),
  ANTHROPIC_API_KEY:                  opt,
})

export const env = envSchema.parse(process.env)
