/**
 * @fileoverview AssessmentNavigation - Unified navigation and progress component
 *
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 *
 * This component combines section navigation and progress tracking into a unified
 * interface for ESG assessments. It integrates the functionality of both
 * SectionDisplay and ResponsiveProgressBar components with support for umbrella
 * question hierarchies.
 *
 * KEY FEATURES:
 * 1. Section dropdown navigation with progress indicators
 * 2. Interactive progress dots with left/right navigation arrows
 * 3. Responsive design for mobile and desktop
 * 4. Consistent styling with the app's design system
 * 5. Auto-scroll functionality for current question visibility
 * 6. **Umbrella question support** with hierarchical navigation
 * 7. **Visual differentiation** between regular and umbrella questions
 *
 * ==================================================================================
 * UMBRELLA QUESTION SUPPORT (v2.0)
 * ==================================================================================
 *
 * VISUAL INDICATORS:
 * - **Regular Questions**: Round dots (green when answered, gray when not)
 * - **Umbrella Questions**: Square indicators (blue theme, "Overview" state)
 * - **Current State**: Ring indicator around active question
 *
 * QUESTION TYPES:
 * - `type: 'radiogroup'|'text'|'checkbox'|'rating'|'boolean'` - Answerable questions
 * - `type: 'group'` - Umbrella questions for navigation organization only
 *
 * ACCESSIBILITY:
 * - Screen reader labels distinguish between question types
 * - "Overview" label for umbrella questions vs "Answered/Not answered" for regular
 * - Proper ARIA labels for navigation state
 *
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-21
 * @updated 2025-07-28 - Added umbrella question support
 * @requires react
 * @requires lucide-react
 * @requires #app/components/ui/button
 * @requires #app/components/ui/icon
 * @requires #app/components/ui/select
 */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useEffect, useCallback } from 'react'
import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { cn } from '#app/utils/misc.tsx'

interface AssessmentNavigationProps {
	// Section navigation props
	section: string
	currentQuestion: number
	totalQuestions: number
	questions: Array<{
		questionId: string
		section: string
		title: string
		isRequired: boolean
		type?: string
	}>
	onSectionChange: (sectionIndex: number) => Promise<void> | void

	// Progress bar props
	currentIndex: number
	answeredQuestions: Set<string>
	onPageChange: (index: number) => void

	// Navigation props
	isNavigating?: boolean
	onNavigatePrevious?: () => Promise<void> | void
	onNavigateNext?: () => Promise<void> | void
	canNavigatePrevious?: boolean
	canNavigateNext?: boolean

	// Styling
	className?: string
}

export function AssessmentNavigation({
	section,
	currentQuestion,
	totalQuestions,
	questions,
	onSectionChange,
	currentIndex,
	answeredQuestions,
	onPageChange,
	isNavigating = false,
	onNavigatePrevious,
	onNavigateNext,
	canNavigatePrevious = false,
	canNavigateNext = false,
	className,
}: AssessmentNavigationProps) {
	// Refs for scroll containers
	const mobileScrollRef = useRef<HTMLDivElement>(null)
	const desktopScrollRef = useRef<HTMLDivElement>(null)

	// Extract unique sections and their first question indices
	const sections = questions.reduce(
		(acc, question, index) => {
			if (!acc.find((s) => s.section === question.section)) {
				acc.push({
					section: question.section,
					firstQuestionIndex: index,
					label: question.section || 'Unknown Section',
				})
			}
			return acc
		},
		[] as Array<{
			section: string
			firstQuestionIndex: number
			label: string
		}>,
	)

	// Handle section navigation
	const handleSectionChange = async (sectionName: string) => {
		if (!isNavigating) {
			const selectedSection = sections.find((s) => s.section === sectionName)
			if (selectedSection) {
				try {
					await onSectionChange(selectedSection.firstQuestionIndex)
				} catch (error) {
					console.error('Section navigation failed:', error)
				}
			}
		}
	}

	// Auto-scroll to current dot
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
					block: 'nearest',
					inline: 'center',
				})
			}
		}
	}, [currentIndex, isNavigating])

	// Auto-scroll when current index changes
	useEffect(() => {
		const timer = setTimeout(scrollToCurrentDot, 100)
		return () => clearTimeout(timer)
	}, [scrollToCurrentDot])

	return (
		<div
			className={cn(
				'bg-muted/50 mb-4 rounded-lg p-3 sm:mb-6 sm:p-4',
				className,
			)}
		>
			{/* Section Navigation Header */}
			<div className="mb-3 sm:mb-4">
				{/* Mobile: Stacked Layout */}
				<div className="space-y-2 sm:hidden">
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onNavigatePrevious}
							disabled={!canNavigatePrevious || isNavigating}
							className={cn(
								'h-8 w-8 shrink-0 p-0',
								isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
							)}
						>
							<Icon name="arrow-left" className="h-3 w-3" />
							<span className="sr-only">Previous</span>
						</Button>
						<Select
							value={section}
							onValueChange={handleSectionChange}
							disabled={isNavigating}
						>
							<SelectTrigger
								className={cn(
									'h-8 flex-1 text-sm',
									isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
								)}
							>
								<SelectValue placeholder="Select section..." />
							</SelectTrigger>
							<SelectContent>
								{sections.map((sectionItem) => (
									<SelectItem
										key={sectionItem.section}
										value={sectionItem.section}
									>
										{sectionItem.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="sm"
							onClick={onNavigateNext}
							disabled={!canNavigateNext || isNavigating}
							className={cn(
								'h-8 w-8 shrink-0 p-0',
								isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
							)}
						>
							<Icon name="arrow-right" className="h-3 w-3" />
							<span className="sr-only">Next</span>
						</Button>
					</div>
				</div>

				{/* Desktop/Tablet: Horizontal Layout */}
				<div className="hidden items-center gap-2 sm:flex">
					<Button
						variant="outline"
						size="sm"
						onClick={onNavigatePrevious}
						disabled={!canNavigatePrevious || isNavigating}
						className={cn(
							'shrink-0',
							isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
						)}
					>
						<Icon name="arrow-left" className="h-4 w-4" />
						<span className="hidden md:inline">Previous</span>
					</Button>
					<Select
						value={section}
						onValueChange={handleSectionChange}
						disabled={isNavigating}
					>
						<SelectTrigger
							className={cn(
								'flex-1',
								isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
							)}
						>
							<SelectValue placeholder="Select section..." />
						</SelectTrigger>
						<SelectContent>
							{sections.map((sectionItem) => (
								<SelectItem
									key={sectionItem.section}
									value={sectionItem.section}
								>
									{sectionItem.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						onClick={onNavigateNext}
						disabled={!canNavigateNext || isNavigating}
						className={cn(
							'shrink-0',
							isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
						)}
					>
						<span className="hidden md:inline">Next</span>
						<Icon name="arrow-right" className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Progress Bar Section */}
			<div>
				{/* Mobile Layout */}
				<div className="lg:hidden">
					<div className="flex items-center gap-2 sm:gap-3">
						{/* Left Arrow */}
						<button
							onClick={onNavigatePrevious}
							disabled={!canNavigatePrevious || isNavigating}
							className={cn(
								'shrink-0 touch-manipulation rounded-full border p-1.5 transition-colors sm:p-2',
								'hover:bg-muted focus:ring-primary/50 focus:ring-2 focus:outline-none',
								'active:bg-muted/80 active:scale-95',
								(!canNavigatePrevious || isNavigating) &&
									'cursor-not-allowed opacity-50',
							)}
							aria-label="Previous question"
						>
							<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>

						{/* Progress Dots */}
						<div
							ref={mobileScrollRef}
							className="flex flex-1 gap-1.5 overflow-x-auto px-1 py-2 sm:gap-2 [&::-webkit-scrollbar]:hidden"
							style={{
								scrollbarWidth: 'none',
								msOverflowStyle: 'none',
								maskImage:
									'linear-gradient(to right, transparent 0px, black 8px, black calc(100% - 8px), transparent 100%)',
								WebkitMaskImage:
									'linear-gradient(to right, transparent 0px, black 8px, black calc(100% - 8px), transparent 100%)',
							}}
						>
							{questions.map((question, index) => {
								const isAnswered = answeredQuestions.has(question.questionId)
								const isCurrent = index === currentIndex
								const isUmbrella = question.type === 'group'

								return (
									<button
										key={question.questionId}
										onClick={() => !isNavigating && onPageChange(index)}
										disabled={isNavigating}
										className={cn(
											'h-5 w-5 shrink-0 touch-manipulation transition-all duration-200 sm:h-6 sm:w-6',
											'hover:scale-110 focus:scale-110 focus:outline-none active:scale-95',
											'focus:ring-primary/50 focus:ring-2 focus:ring-offset-1',
											'border-2',
											isNavigating && 'cursor-not-allowed opacity-50',
											{
												// Umbrella questions - square shape, gray/blue colors
												'rounded-sm border-gray-400 bg-gray-100 hover:bg-gray-200':
													isUmbrella && !isCurrent,
												'rounded-sm border-blue-500 bg-blue-200 ring-2 ring-blue-300 sm:ring-4':
													isUmbrella && isCurrent,
												// Regular answered questions
												'rounded-full border-green-500 bg-green-500 hover:bg-green-600':
													isAnswered && !isCurrent && !isUmbrella,
												// Current answered question
												'ring-primary/30 rounded-full border-green-500 bg-green-500 ring-2 sm:ring-4':
													isAnswered && isCurrent && !isUmbrella,
												// Current unanswered question
												'border-primary ring-primary/30 rounded-full bg-transparent ring-2 sm:ring-4':
													!isAnswered && isCurrent && !isUmbrella,
												// Unanswered question
												'rounded-full border-gray-300 bg-gray-300 hover:bg-gray-400':
													!isAnswered && !isCurrent && !isUmbrella,
											},
										)}
										aria-label={`Question ${index + 1}: ${question.title} - ${
											isUmbrella
												? 'Overview'
												: isAnswered
													? 'Answered'
													: 'Not answered'
										}${isCurrent ? ' (Current)' : ''}`}
										title={`${question.section}: ${question.title}`}
									></button>
								)
							})}
						</div>

						{/* Right Arrow */}
						<button
							onClick={onNavigateNext}
							disabled={!canNavigateNext || isNavigating}
							className={cn(
								'shrink-0 touch-manipulation rounded-full border p-1.5 transition-colors sm:p-2',
								'hover:bg-muted focus:ring-primary/50 focus:ring-2 focus:outline-none',
								'active:bg-muted/80 active:scale-95',
								(!canNavigateNext || isNavigating) &&
									'cursor-not-allowed opacity-50',
							)}
							aria-label="Next question"
						>
							<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
						</button>
					</div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="hidden lg:block">
				<div className="flex items-center gap-4">
					{/* Left Arrow */}
					<button
						onClick={onNavigatePrevious}
						disabled={!canNavigatePrevious || isNavigating}
						className={cn(
							'shrink-0 rounded-full border p-2 transition-colors',
							'hover:bg-muted focus:ring-primary/50 focus:ring-2 focus:outline-none',
							(!canNavigatePrevious || isNavigating) &&
								'cursor-not-allowed opacity-50',
						)}
						aria-label="Previous question"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>

					{/* Progress Dots */}
					<div
						ref={desktopScrollRef}
						className="flex flex-1 gap-2 overflow-x-auto p-2 [&::-webkit-scrollbar]:hidden"
						style={{
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
							maskImage:
								'linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)',
						}}
					>
						{questions.map((question, index) => {
							const isAnswered = answeredQuestions.has(question.questionId)
							const isCurrent = index === currentIndex
							const isUmbrella = question.type === 'group'

							return (
								<button
									key={question.questionId}
									onClick={() => !isNavigating && onPageChange(index)}
									disabled={isNavigating}
									className={cn(
										'h-6 w-6 shrink-0 transition-all duration-200',
										'hover:scale-110 focus:scale-110 focus:outline-none',
										'focus:ring-primary/50 focus:ring-2 focus:ring-offset-2',
										'border-2',
										isNavigating && 'cursor-not-allowed opacity-50',
										{
											// Umbrella questions - square shape, blue colors
											'rounded-sm border-gray-400 bg-gray-100 hover:bg-gray-200':
												isUmbrella && !isCurrent,
											'rounded-sm border-blue-500 bg-blue-200 ring-4 ring-blue-300':
												isUmbrella && isCurrent,
											// Regular answered questions
											'rounded-full border-green-500 bg-green-500 hover:bg-green-600':
												isAnswered && !isCurrent && !isUmbrella,
											// Current answered question
											'ring-primary/30 rounded-full border-green-500 bg-green-500 ring-4':
												isAnswered && isCurrent && !isUmbrella,
											// Current unanswered question
											'border-primary ring-primary/30 rounded-full bg-transparent ring-4':
												!isAnswered && isCurrent && !isUmbrella,
											// Unanswered question
											'rounded-full border-gray-300 bg-gray-300 hover:bg-gray-400':
												!isAnswered && !isCurrent && !isUmbrella,
										},
									)}
									aria-label={`Question ${index + 1}: ${question.title} - ${
										isUmbrella
											? 'Overview'
											: isAnswered
												? 'Answered'
												: 'Not answered'
									}${isCurrent ? ' (Current)' : ''}`}
									title={`${question.section}: ${question.title}`}
								></button>
							)
						})}
					</div>

					{/* Right Arrow */}
					<button
						onClick={onNavigateNext}
						disabled={!canNavigateNext || isNavigating}
						className={cn(
							'shrink-0 rounded-full border p-2 transition-colors',
							'hover:bg-muted focus:ring-primary/50 focus:ring-2 focus:outline-none',
							(!canNavigateNext || isNavigating) &&
								'cursor-not-allowed opacity-50',
						)}
						aria-label="Next question"
					>
						<ChevronRight className="h-6 w-6" />
					</button>
				</div>
			</div>

			{/* Bottom Progress Bar */}
			<div className="mt-3 sm:mt-4">
				{/* Mobile: Stacked Progress Info */}
				<div className="space-y-2 sm:hidden">
					<div className="flex items-center justify-between text-xs">
						<span className="font-medium">
							{Math.round((answeredQuestions.size / totalQuestions) * 100)}%
							completed
						</span>
						<span className="text-muted-foreground">
							{currentQuestion} / {totalQuestions}
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							className="h-full rounded-full bg-green-500 transition-all duration-300 ease-in-out"
							style={{
								width: `${Math.round((answeredQuestions.size / totalQuestions) * 100)}%`,
							}}
						></div>
					</div>
				</div>

				{/* Desktop: Horizontal Progress Info */}
				<div className="hidden sm:block">
					<div className="mb-2 flex items-center justify-between">
						<div className="text-sm font-medium">
							Progress{' '}
							{Math.round((answeredQuestions.size / totalQuestions) * 100)}%
							completed
						</div>
						<div className="text-sm font-medium">
							Question {currentQuestion} / {totalQuestions}
						</div>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							className="h-2 rounded-full bg-green-500 transition-all duration-300 ease-in-out"
							style={{
								width: `${Math.round((answeredQuestions.size / totalQuestions) * 100)}%`,
							}}
						></div>
					</div>
				</div>
			</div>
		</div>
	)
}
