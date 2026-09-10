/**
 * `SetupCommand` is the name `app/dashboard/layout.tsx` (owned by another
 * agent) imports when a signed-in user has no workspace yet — kept as an
 * alias so that call site didn't need touching. The actual three-step
 * wizard lives in `OnboardingWizard`; `app/onboarding/page.tsx` renders it
 * directly under its real name.
 */
export { OnboardingWizard as SetupCommand } from './OnboardingWizard'
