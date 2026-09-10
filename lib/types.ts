// Shared app-level types.
// Database row types live in lib/types/database.types.ts
// Plan capabilities live in lib/plans.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type { Profile, Workspace, PlanId, PlanStatus } from './types/database.types'
