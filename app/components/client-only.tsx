/**
 * @fileoverview ClientOnly - SSR-safe component wrapper for client-side only rendering
 * 
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 * 
 * This component provides a safe wrapper for components that should only render on
 * the client side, preventing hydration mismatches in server-side rendered (SSR)
 * applications. It's essential for components that depend on browser APIs or
 * third-party libraries that don't support SSR.
 * 
 * KEY FEATURES:
 * 1. Prevents hydration mismatches between server and client rendering
 * 2. Provides customizable fallback content during SSR
 * 3. Uses function-as-children pattern for lazy evaluation
 * 4. Integrates with custom useHydrated hook for reliable hydration detection
 * 5. Zero-overhead after hydration completion
 * 
 * ==================================================================================
 * SSR COMPATIBILITY STRATEGY
 * ==================================================================================
 * 
 * HYDRATION DETECTION:
 * Server Render → Returns fallback content → Client hydrates →
 * useHydrated detects completion → Switches to children rendering
 * 
 * COMMON USE CASES:
 * - Third-party components that don't support SSR (SurveyJS, charts, maps)
 * - Components using browser-only APIs (localStorage, geolocation, camera)
 * - Dynamic imports that may fail during SSR
 * - Progressive enhancement patterns
 * 
 * PERFORMANCE CONSIDERATIONS:
 * - Function-as-children prevents unnecessary component creation during SSR
 * - Minimal overhead with direct hydration state checking
 * - No additional re-renders after initial hydration
 * 
 * ==================================================================================
 * INTEGRATION PATTERNS
 * ==================================================================================
 * 
 * BASIC USAGE:
 * ```tsx
 * <ClientOnly fallback={<LoadingSkeleton />}>
 *   {() => <ExpensiveClientComponent />}
 * </ClientOnly>
 * ```
 * 
 * PROGRESSIVE ENHANCEMENT:
 * ```tsx
 * <ClientOnly fallback={<BasicForm />}>
 *   {() => <EnhancedInteractiveForm />}
 * </ClientOnly>
 * ```
 * 
 * ASSESSMENT INTEGRATION:
 * Used to wrap SurveyJS component which doesn't support SSR,
 * providing skeleton loading state during initial page load.
 * 
 * @version 1.0.0
 * @author Vitae Development Team
 * @since 1.0.0
 * @requires react
 * @requires #app/utils/misc.tsx
 * 
 * @example
 * ```tsx
 * // Wrap client-only survey component
 * <ClientOnly fallback={<SurveySkeleton />}>
 *   {() => <SurveyComponent {...surveyProps} />}
 * </ClientOnly>
 * ```
 * 
 * @see {@link app/utils/misc.tsx} for useHydrated hook implementation
 * @see {@link app/routes/assessment+/take.tsx} for usage example
 */

import { useHydrated } from '#app/utils/misc.tsx'

interface ClientOnlyProps {
  children: () => React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hydrated = useHydrated()

  if (!hydrated) {
    return <>{fallback}</>
  }

  return <>{children()}</>
}