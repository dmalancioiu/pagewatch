import { redirect } from 'next/navigation'

// Competitor tracking has been removed. Redirect to the dashboard overview.
export default function CompetitorsPage() {
  redirect('/dashboard')
}
