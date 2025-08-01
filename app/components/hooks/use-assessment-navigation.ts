/**
 * @fileoverview useAssessmentNavigation - Centralized navigation state management for ESG assessments
 *
 * ==================================================================================
 * HOOK OVERVIEW
 * ==================================================================================
 *
 * This custom React hook provides centralized navigation state management for ESG
 * assessment interfaces. It prevents navigation conflicts, handles async operations,
 * and provides consistent navigation behavior across different UI components.
 *
 * KEY FEATURES:
 * 1. Prevents navigation "ping pong" effects during rapid user interactions
 * 2. Manages async navigation operations with proper abort handling
 * 3. Synchronizes external page changes with internal state
 * 4. Provides consistent navigation boundaries and validation
 * 5. Supports multiple navigation sources (progress bar, survey form, dropdown)
 * 6. Handles navigation timeouts and error recovery
 *
 * ==================================================================================
 * PING PONG EFFECT PREVENTION
 * ==================================================================================
 *
 * PROBLEM SOLVED:
 * - User rapidly clicks navigation buttons or progress dots
 * - Multiple async navigation operations start simultaneously
 * - State updates conflict, causing UI to "bounce" between pages
 * - Progress bar and survey component get out of sync
 *
 * SOLUTION APPROACH:
 * - Single source of truth for navigation state
 * - Abort controller pattern to cancel pending operations
 * - Navigation lock during async operations
 * - Proper cleanup on component unmount
 *
 * ==================================================================================
 * STATE MANAGEMENT ARCHITECTURE
 * ==================================================================================
 *
 * NAVIGATION STATE:
 * - isNavigating: Boolean flag preventing concurrent navigation
 * - currentPageIndex: Current active page (source of truth)
 * - pendingPageIndex: Target page during navigation (for UI feedback)
 * - abortController: Controller for canceling in-flight operations
 *
 * STATE TRANSITIONS:
 * 1. Idle → Navigating: User initiates navigation
 * 2. Navigating → Idle: Navigation completes successfully
 * 3. Navigating → Idle: Navigation aborted or fails
 * 4. External sync: Updates from parent component
 *
 * ==================================================================================
 * ASYNC OPERATION HANDLING
 * ==================================================================================
 *
 * ABORT CONTROLLER PATTERN:
 * - Each navigation creates a new AbortController
 * - Previous operations are cancelled before starting new ones
 * - Graceful handling of aborted operations
 * - Timeout protection for hung operations
 *
 * ERROR RECOVERY:
 * - Navigation aborted: Silent recovery, no state change
 * - Navigation timeout: Warning logged, state reset
 * - Other errors: State reset, error propagated
 *
 * ==================================================================================
 * INTEGRATION PATTERNS
 * ==================================================================================
 *
 * USAGE WITH COMPONENTS:
 * - Progress bar: Uses navigate, navigatePrevious, navigateNext
 * - Survey component: Uses navigate for direct page jumps
 * - Section dropdown: Uses navigate with source tracking
 * - Parent route: Provides onNavigate callback for server sync
 *
 * DATA FLOW:
 * User Input → Hook Navigation → Server Sync → UI Update → State Sync
 *
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-18
 * @requires react
 *
 * @example
 * ```tsx
 * // Usage in assessment route
 * const navigation = useAssessmentNavigation(
 *   initialPageIndex,
 *   totalPages,
 *   async (pageIndex, signal) => {
 *     // Update survey model
 *     surveyModel.currentPageNo = pageIndex
 *
 *     // Save to server
 *     await saveProgress(pageIndex, signal)
 *   }
 * )
 *
 * // Use in components
 * <ProgressBar
 *   currentIndex={navigation.currentPageIndex}
 *   onPageChange={navigation.navigate}
 *   isNavigating={navigation.isNavigating}
 *   onNavigatePrevious={navigation.navigatePrevious}
 *   onNavigateNext={navigation.navigateNext}
 * />
 * ```
 *
 * @see {@link app/routes/assessment+/take.tsx} for implementation context
 * @see {@link app/components/assessment/responsive-progress-bar.tsx} for UI integration
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface NavigationState {
	isNavigating: boolean
	currentPageIndex: number
	pendingPageIndex: number | null
	abortController: AbortController | null
}

interface NavigationOptions {
	skipValidation?: boolean
	source?: 'progress-bar' | 'survey-form' | 'section-dropdown'
}

export function useAssessmentNavigation(
	initialPageIndex: number,
	totalPages: number,
	onNavigate: (pageIndex: number, signal?: AbortSignal) => Promise<void>,
) {
	const [navigationState, setNavigationState] = useState<NavigationState>({
		isNavigating: false,
		currentPageIndex: initialPageIndex,
		pendingPageIndex: null,
		abortController: null,
	})

	const navigationInProgress = useRef(false)

	// Sync external page changes - fix synchronization issues
	useEffect(() => {
		if (
			!navigationInProgress.current &&
			initialPageIndex !== navigationState.currentPageIndex
		) {
			setNavigationState((prev) => ({
				...prev,
				currentPageIndex: initialPageIndex,
			}))
		}
	}, [initialPageIndex, navigationState.currentPageIndex])

	// Force sync when navigationInProgress becomes false
	useEffect(() => {
		if (
			!navigationState.isNavigating &&
			!navigationInProgress.current &&
			initialPageIndex !== navigationState.currentPageIndex
		) {
			setNavigationState((prev) => ({
				...prev,
				currentPageIndex: initialPageIndex,
			}))
		}
	}, [
		navigationState.isNavigating,
		initialPageIndex,
		navigationState.currentPageIndex,
	])

	const navigate = useCallback(
		async (targetPageIndex: number, _options: NavigationOptions = {}) => {
			// Validation
			if (targetPageIndex < 0 || targetPageIndex >= totalPages) {
				console.warn(`Invalid page index: ${targetPageIndex}`)
				return
			}

			if (targetPageIndex === navigationState.currentPageIndex) {
				return
			}

			// Cancel any pending navigation
			if (navigationState.abortController) {
				navigationState.abortController.abort()
			}

			// Set up new navigation
			const controller = new AbortController()
			navigationInProgress.current = true

			setNavigationState({
				isNavigating: true,
				currentPageIndex: navigationState.currentPageIndex,
				pendingPageIndex: targetPageIndex,
				abortController: controller,
			})

			try {
				await onNavigate(targetPageIndex, controller.signal)

				// Check if navigation wasn't aborted
				if (!controller.signal.aborted) {
					setNavigationState({
						isNavigating: false,
						currentPageIndex: targetPageIndex,
						pendingPageIndex: null,
						abortController: null,
					})
				}
			} catch (error) {
				if (
					error instanceof Error &&
					(error.name === 'AbortError' ||
						error.message === 'Navigation aborted')
				) {
					// Navigation was cancelled, reset navigation state
					setNavigationState({
						isNavigating: false,
						currentPageIndex: navigationState.currentPageIndex,
						pendingPageIndex: null,
						abortController: null,
					})
					return
				}

				if (error instanceof Error && error.message === 'Navigation timeout') {
					// Navigation timed out, log warning but reset state
					console.warn('Navigation timed out, resetting state')
					setNavigationState({
						isNavigating: false,
						currentPageIndex: navigationState.currentPageIndex,
						pendingPageIndex: null,
						abortController: null,
					})
					return
				}

				// Handle other errors - reset to previous state
				setNavigationState({
					isNavigating: false,
					currentPageIndex: navigationState.currentPageIndex,
					pendingPageIndex: null,
					abortController: null,
				})

				throw error
			} finally {
				navigationInProgress.current = false
			}
		},
		[navigationState, totalPages, onNavigate],
	)

	const navigatePrevious = useCallback(() => {
		if (navigationState.currentPageIndex > 0 && !navigationState.isNavigating) {
			void navigate(navigationState.currentPageIndex - 1, {
				source: 'progress-bar',
			})
		}
	}, [navigate, navigationState.currentPageIndex, navigationState.isNavigating])

	const navigateNext = useCallback(() => {
		if (
			navigationState.currentPageIndex < totalPages - 1 &&
			!navigationState.isNavigating
		) {
			void navigate(navigationState.currentPageIndex + 1, {
				source: 'progress-bar',
			})
		}
	}, [
		navigate,
		navigationState.currentPageIndex,
		navigationState.isNavigating,
		totalPages,
	])

	const navigateToPage = useCallback(
		(pageIndex: number, source?: string) => {
			void navigate(pageIndex, {
				source: source as NavigationOptions['source'],
			})
		},
		[navigate],
	)

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (navigationState.abortController) {
				navigationState.abortController.abort()
			}
		}
	}, [navigationState.abortController])

	return {
		currentPageIndex: navigationState.currentPageIndex,
		isNavigating: navigationState.isNavigating,
		pendingPageIndex: navigationState.pendingPageIndex,
		navigate: navigateToPage,
		navigatePrevious,
		navigateNext,
		canNavigatePrevious:
			navigationState.currentPageIndex > 0 && !navigationState.isNavigating,
		canNavigateNext:
			navigationState.currentPageIndex < totalPages - 1 &&
			!navigationState.isNavigating,
	}
}
