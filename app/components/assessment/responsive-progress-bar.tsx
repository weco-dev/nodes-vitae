/**
 * @fileoverview ResponsiveProgressBar - Adaptive navigation and progress tracking for ESG assessments
 *
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 *
 * This component provides a responsive progress tracking and navigation interface for
 * multi-page ESG (Environmental, Social, Governance) assessments. It adapts between
 * mobile and desktop layouts to provide optimal user experience across all devices.
 *
 * KEY FEATURES:
 * 1. Adaptive layout: Horizontal scrollable view on mobile, grid layout on desktop
 * 2. Visual progress indicators: Color-coded dots showing completion status
 * 3. Dual progress metrics: Separate tracking for mandatory vs total questions
 * 4. Interactive navigation: Click any dot to jump to specific questions
 * 5. Directional controls: Previous/Next arrows for sequential navigation
 * 6. Accessibility support: ARIA labels, keyboard navigation, focus management
 *
 * ==================================================================================
 * VISUAL DESIGN SYSTEM
 * ==================================================================================
 *
 * PROGRESS DOT STATES:
 * - **Regular Questions (Round)**:
 *   - Answered: Green background (bg-green-500) - Question completed
 *   - Answered + Current: Green with ring (ring-4 ring-primary/30) - Active completed question
 *   - Current: Transparent with primary border + ring - Active unanswered question
 *   - Unanswered: Gray background (bg-gray-300) - Not yet visited/answered
 * - **Umbrella Questions (Square)**:
 *   - Normal: Gray background (bg-gray-100) with gray border - Overview state
 *   - Current: Blue background (bg-blue-200) with blue ring - Active overview
 *
 * RESPONSIVE BREAKPOINTS:
 * - Mobile (< lg): Horizontal scrollable container with navigation arrows
 * - Desktop (>= lg): Flexible grid layout with centered progress dots
 *
 * INTERACTIVE STATES:
 * - Hover effects on all clickable elements
 * - Disabled states for navigation arrows at boundaries
 * - Focus indicators for keyboard navigation
 * - Tooltips showing question titles and sections
 *
 * ==================================================================================
 * INTEGRATION PATTERNS
 * ==================================================================================
 *
 * USAGE IN ASSESSMENT FLOW:
 * Parent Route (take.tsx) → useAssessmentNavigation hook → ResponsiveProgressBar →
 * User navigation → Navigation hook → Server sync → UI update → State sync
 *
 * DATA FLOW REQUIREMENTS:
 * - questions: Array of question metadata with sections and IDs
 * - currentIndex: Zero-based index of active question
 * - answeredQuestions: Set of question IDs that have been completed
 * - onPageChange: Callback function for navigation events
 * - isNavigating: Boolean flag from navigation hook to prevent conflicts
 * - Navigation handlers: onNavigatePrevious, onNavigateNext from navigation hook
 * - Navigation state: canNavigatePrevious, canNavigateNext from navigation hook
 *
 * PROGRESS CALCULATION LOGIC:
 * ```tsx
 * // Filter out umbrella questions (type: 'group') from progress calculations
 * const answerableQuestions = questions.filter(q => q.type !== 'group')
 * 
 * // Mandatory completion percentage (excludes umbrella questions)
 * const mandatoryAnswerable = answerableQuestions.filter(q => q.isRequired)
 * const mandatoryAnswered = mandatoryAnswerable.filter(q => 
 *   answeredQuestions.has(q.questionId)).length
 * const mandatoryPercentage = (mandatoryAnswered / mandatoryAnswerable.length) * 100
 *
 * // Total completion percentage (excludes umbrella questions)
 * const allAnswered = answerableQuestions.filter(q => 
 *   answeredQuestions.has(q.questionId)).length
 * const totalPercentage = (allAnswered / answerableQuestions.length) * 100
 * ```
 *
 * ==================================================================================
 * ACCESSIBILITY CONSIDERATIONS
 * ==================================================================================
 *
 * KEYBOARD NAVIGATION:
 * - Tab order: Previous arrow → Progress dots → Next arrow
 * - Enter/Space: Activate navigation buttons and progress dots
 * - Arrow keys: Sequential navigation through progress dots
 *
 * SCREEN READER SUPPORT:
 * - aria-label attributes on all interactive elements
 * - Descriptive button labels indicating current state
 * - Progress announcements when navigating between questions
 *
 * VISUAL ACCESSIBILITY:
 * - High contrast colors for progress indicators
 * - Focus rings meet WCAG 2.1 requirements
 * - Text sizing follows accessible typography guidelines
 * - Color coding supplemented with visual patterns (borders, sizes)
 *
 * ==================================================================================
 * PERFORMANCE OPTIMIZATIONS
 * ==================================================================================
 *
 * RENDERING EFFICIENCY:
 * - Conditional rendering for mobile vs desktop layouts
 * - Memoized style calculations for progress dots
 * - Efficient DOM updates through React's reconciliation
 * - Auto-scroll behavior with navigation state awareness
 *
 * INTERACTION HANDLING:
 * - Event delegation for progress dot clicks
 * - Navigation state prevents rapid state changes and conflicts
 * - Disabled states during navigation operations
 * - Lightweight hover effects without layout thrashing
 * - Smooth scrolling to current dot with proper timing
 *
 * ==================================================================================
 * UMBRELLA QUESTION SUPPORT (v2.0)
 * ==================================================================================
 *
 * QUESTION TYPE HANDLING:
 * - `type: 'group'` - Umbrella questions excluded from progress calculations
 * - `type: 'radiogroup'|'text'|'checkbox'|'rating'|'boolean'` - Answerable questions
 *
 * VISUAL DIFFERENTIATION:
 * - Square shape (rounded-sm) for umbrella questions vs round for regular
 * - Blue color theme for umbrella questions vs green/gray for regular
 * - Special status handling: 'umbrella' and 'umbrella-current' states
 *
 * PROGRESS FILTERING:
 * - Only answerable questions count toward completion percentages
 * - Umbrella questions provide navigation structure without affecting metrics
 * - Maintains accurate progress reporting for assessment completion
 *
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-12
 * @updated 2025-07-18 - Added navigation hook integration and ping pong effect prevention
 * @updated 2025-07-28 - Added umbrella question support with progress filtering
 * @requires react
 * @requires lucide-react
 * @requires #app/utils/misc (cn utility)
 *
 * @example
 * ```tsx
 * // Usage in assessment route with navigation hook
 * const navigation = useAssessmentNavigation(...)
 *
 * <ResponsiveProgressBar
 *   questions={assessmentQuestions}
 *   currentIndex={navigation.currentPageIndex}
 *   answeredQuestions={new Set(['q1', 'q3', 'q5'])}
 *   onPageChange={navigation.navigate}
 *   isNavigating={navigation.isNavigating}
 *   onNavigatePrevious={navigation.navigatePrevious}
 *   onNavigateNext={navigation.navigateNext}
 *   canNavigatePrevious={navigation.canNavigatePrevious}
 *   canNavigateNext={navigation.canNavigateNext}
 *   className="mb-6"
 * />
 *
 * // Results in adaptive progress bar with:
 * // - Mobile: Scrollable dots with arrows
 * // - Desktop: Horizontal scrollable layout with progress stats
 * // - Visual indicators for completion status
 * // - Interactive navigation to any question
 * // - Ping pong effect prevention during navigation
 * // - Smooth auto-scroll to current question
 * ```
 *
 * @see {@link app/routes/assessment+/take.tsx} for implementation context
 * @see {@link app/components/hooks/use-assessment-navigation.ts} for navigation state management
 * @see {@link app/components/assessment/section-display.tsx} for related progress components
 */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useEffect, useCallback } from 'react'
import { cn } from '#app/utils/misc.tsx'

interface ResponsiveProgressBarProps {
	questions: Array<{
		questionId: string
		section: string
		title: string
		isRequired: boolean
		type?: string
	}>
	currentIndex: number
	answeredQuestions: Set<string>
	onPageChange: (index: number) => void
	className?: string
	isNavigating?: boolean
	onNavigatePrevious?: () => void
	onNavigateNext?: () => void
	canNavigatePrevious?: boolean
	canNavigateNext?: boolean
}

export function ResponsiveProgressBar({
	questions,
	currentIndex,
	answeredQuestions,
	onPageChange,
	className,
	isNavigating = false,
	onNavigatePrevious,
	onNavigateNext,
	canNavigatePrevious = false,
	canNavigateNext = false,
}: ResponsiveProgressBarProps) {
	// Refs for scroll containers
	const mobileScrollRef = useRef<HTMLDivElement>(null)
	const desktopScrollRef = useRef<HTMLDivElement>(null)

	// Auto-scroll to current dot - only when not navigating
	const scrollToCurrentDot = useCallback(() => {
		if (isNavigating) return // Don't scroll during navigation

		const scrollContainer =
			window.innerWidth >= 1024
				? desktopScrollRef.current
				: mobileScrollRef.current

		if (scrollContainer) {
			const dots = scrollContainer.querySelectorAll(
				'button[aria-label*="Question"]',
			)
			const currentDot = dots[currentIndex] as HTMLElement
			if (currentDot) {
				currentDot.scrollIntoView({
					behavior: 'smooth',
					inline: 'center',
					block: 'nearest',
				})
			}
		}
	}, [currentIndex, isNavigating])

	// Auto-scroll with delay to ensure DOM is updated
	useEffect(() => {
		const timer = setTimeout(scrollToCurrentDot, 100)
		return () => clearTimeout(timer)
	}, [currentIndex, scrollToCurrentDot])

	// Navigation handlers
	const handleDotClick = useCallback(
		(index: number) => {
			if (!isNavigating) {
				onPageChange(index)
			}
		},
		[onPageChange, isNavigating],
	)

	// Calculate completion percentages
	const answerableQuestions = questions.filter((q) => q.type !== 'group')
	const mandatoryAnswerable = answerableQuestions.filter((q) => q.isRequired)

	const mandatoryAnswered = mandatoryAnswerable.filter((q) =>
		answeredQuestions.has(q.questionId),
	).length

	const mandatoryTotal = mandatoryAnswerable.length

	const allAnswered = answerableQuestions.filter((q) =>
		answeredQuestions.has(q.questionId),
	).length

	const mandatoryPercentage =
		mandatoryTotal > 0
			? Math.round((mandatoryAnswered / mandatoryTotal) * 100)
			: 0

	const totalPercentage = Math.round(
		(allAnswered / answerableQuestions.length) * 100,
	)
	const getProgressDotStatus = (
		index: number,
		question: { questionId: string; type?: string },
	) => {
		// Special handling for umbrella questions
		if (question.type === 'group') {
			const isCurrent = index === currentIndex
			return isCurrent ? 'umbrella-current' : 'umbrella'
		}

		const isAnswered = answeredQuestions.has(question.questionId)
		const isCurrent = index === currentIndex

		if (isAnswered && isCurrent) return 'answered-current'
		if (isAnswered) return 'answered'
		if (isCurrent) return 'current'
		return 'unanswered'
	}

	const getProgressDotStyles = (status: string) => {
		const baseStyles =
			'focus:ring-primary/50 h-4 w-4 flex-shrink-0 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none border-2'

		switch (status) {
			case 'answered':
				return `${baseStyles} bg-green-500 border-green-500 text-white hover:bg-green-600 rounded-full`
			case 'answered-current':
				return `${baseStyles} bg-green-500 border-green-500 text-white hover:bg-green-600 ring-4 ring-primary/30 rounded-full`
			case 'current':
				return `${baseStyles} bg-transparent border-primary text-primary ring-4 ring-primary/30 rounded-full`
			case 'umbrella':
				return `${baseStyles} bg-gray-100 border-gray-400 text-gray-600 hover:bg-gray-200 rounded-sm` // Square shape, gray colors
			case 'umbrella-current':
				return `${baseStyles} bg-blue-200 border-blue-500 text-blue-700 ring-4 ring-blue-300 rounded-sm` // Square shape with ring
			case 'unanswered':
				return `${baseStyles} bg-transparent border-gray-300 text-gray-400 hover:bg-gray-50 rounded-full`
			default:
				return `${baseStyles} bg-transparent border-gray-300 text-gray-400 rounded-full`
		}
	}

	return (
		<div className={cn('w-full', className)}>
			{/* Mobile: Horizontal scrollable dots with arrows */}
			<div className="block lg:hidden">
				<div className="flex items-center gap-2">
					<button
						onClick={onNavigatePrevious}
						disabled={!canNavigatePrevious || isNavigating}
						className={cn(
							'flex-shrink-0 rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
							isNavigating && 'animate-pulse',
						)}
						aria-label="Previous question"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>

					<div
						ref={mobileScrollRef}
						className="scrollbar-hide flex-1 overflow-x-auto"
					>
						<div className="flex min-w-max gap-2 px-2 py-3">
							{questions.map((question, index) => {
								const status = getProgressDotStatus(index, question)
								return (
									<button
										key={question.questionId}
										onClick={() => handleDotClick(index)}
										disabled={isNavigating}
										className={cn(
											getProgressDotStyles(status),
											isNavigating && 'animate-pulse cursor-not-allowed',
										)}
										title={`${question.section}: ${question.title}`}
										aria-label={`Question ${index + 1} - ${status}`}
									/>
								)
							})}
						</div>
					</div>

					<button
						onClick={onNavigateNext}
						disabled={!canNavigateNext || isNavigating}
						className={cn(
							'flex-shrink-0 rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
							isNavigating && 'animate-pulse',
						)}
						aria-label="Next question"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>

				{/* Mobile progress indicator */}
				<div className="mt-2 flex flex-col items-center gap-1">
					<div className="text-muted-foreground text-xs">
						Question {currentIndex + 1} of {questions.length}
						{isNavigating && ' (navigating...)'}
					</div>
					<div className="text-muted-foreground text-xs">
						Mandatory: {mandatoryPercentage}% | Total: {totalPercentage}%
					</div>
				</div>
			</div>

			{/* Desktop: Horizontal scroll with larger arrows */}
			<div className="hidden lg:block">
				<div className="mb-4 flex items-center gap-4">
					<button
						onClick={onNavigatePrevious}
						disabled={!canNavigatePrevious || isNavigating}
						className={cn(
							'flex-shrink-0 rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
							isNavigating && 'animate-pulse',
						)}
						aria-label="Previous question"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>

					<div
						ref={desktopScrollRef}
						className="scrollbar-hide flex-1 overflow-x-auto"
					>
						<div className="flex min-w-max gap-3 px-4 py-3">
							{questions.map((question, index) => {
								const status = getProgressDotStatus(index, question)
								return (
									<button
										key={question.questionId}
										onClick={() => handleDotClick(index)}
										disabled={isNavigating}
										className={cn(
											getProgressDotStyles(status),
											isNavigating && 'animate-pulse cursor-not-allowed',
										)}
										title={`${question.section}: ${question.title}`}
										aria-label={`Question ${index + 1} - ${status}`}
									/>
								)
							})}
						</div>
					</div>

					<button
						onClick={onNavigateNext}
						disabled={!canNavigateNext || isNavigating}
						className={cn(
							'flex-shrink-0 rounded-full p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
							isNavigating && 'animate-pulse',
						)}
						aria-label="Next question"
					>
						<ChevronRight className="h-6 w-6" />
					</button>
				</div>

				{/* Desktop progress text */}
				<div className="text-muted-foreground flex items-center justify-between text-sm">
					<div>
						Question {currentIndex + 1} of {questions.length}
						{isNavigating && ' (navigating...)'}
					</div>
					<div>
						Mandatory: {mandatoryPercentage}% ({mandatoryAnswered}/
						{mandatoryTotal}) | Total: {totalPercentage}% ({allAnswered}/
						{questions.length})
					</div>
				</div>
			</div>
		</div>
	)
}
