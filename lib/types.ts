// Shared app-level types
// Database row types live in lib/types/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Profile = {
  id: string
  email: string | null
  full_name: string
  avatar_url: string | null
  plan: 'trial' | 'starter' | 'agency'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}
