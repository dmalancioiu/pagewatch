import { redirect } from 'next/navigation'

// Keywords have been replaced by URL monitoring.
// Redirect anyone hitting the old route to the new URLs page.
export default function KeywordsPage() {
  redirect('/dashboard/urls')
}
