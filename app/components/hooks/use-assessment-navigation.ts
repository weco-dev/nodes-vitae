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
	onNavigate: (pageIndex: number, signal?: AbortSignal) => Promise<void>
) {
	const [navigationState, setNavigationState] = useState<NavigationState>({
		isNavigating: false,
		currentPageIndex: initialPageIndex,
		pendingPageIndex: null,
		abortController: null,
	})

	const navigationInProgress = useRef(false)

	// Sync external page changes
	useEffect(() => {
		if (!navigationInProgress.current && initialPageIndex !== navigationState.currentPageIndex) {
			setNavigationState(prev => ({
				...prev,
				currentPageIndex: initialPageIndex,
			}))
		}
	}, [initialPageIndex, navigationState.currentPageIndex])

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
				if (error instanceof Error && (error.name === 'AbortError' || error.message === 'Navigation aborted')) {
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
		[navigationState, totalPages, onNavigate]
	)

	const navigatePrevious = useCallback(() => {
		if (navigationState.currentPageIndex > 0 && !navigationState.isNavigating) {
			void navigate(navigationState.currentPageIndex - 1, { source: 'progress-bar' })
		}
	}, [navigate, navigationState.currentPageIndex, navigationState.isNavigating])

	const navigateNext = useCallback(() => {
		if (navigationState.currentPageIndex < totalPages - 1 && !navigationState.isNavigating) {
			void navigate(navigationState.currentPageIndex + 1, { source: 'progress-bar' })
		}
	}, [navigate, navigationState.currentPageIndex, navigationState.isNavigating, totalPages])

	const navigateToPage = useCallback((pageIndex: number, source?: string) => {
		void navigate(pageIndex, { source: source as NavigationOptions['source'] })
	}, [navigate])

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
		canNavigatePrevious: navigationState.currentPageIndex > 0 && !navigationState.isNavigating,
		canNavigateNext: navigationState.currentPageIndex < totalPages - 1 && !navigationState.isNavigating,
	}
}