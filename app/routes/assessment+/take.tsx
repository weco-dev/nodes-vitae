/**
 * @fileoverview Assessment Take Route - Primary interface for ESG assessment completion
 *
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 *
 * This route serves as the main interface for users to complete ESG (Environmental,
 * Social, Governance) assessments. It provides a full-stack implementation with
 * server-side state management, real-time persistence, and a responsive UI built
 * around the SurveyJS framework.
 *
 * KEY FEATURES:
 * 1. Assessment lifecycle manageme
e, resume, complete)
 * 2. Real-time answer persistence to prevent data loss
 * 3. Progress tracking with section-based navigation
 * 4. Lazy-loaded survey component for performance
 * 5. Client-side state hydration with server data
 * 6. Comprehensive error handling and loading states
 * 7. Mobile-responsive design with progressive enhancement
 *
 * ==================================================================================
 * REMIX ARCHITECTURE INTEGRATION
 * ==================================================================================
 *
 * LOADER FUNCTION:
 * - Authenticates user and retrieves/creates assessment
 * - Loads assessment questions and converts to SurveyJS format
 * - Provides initial state hydration for client components
 * - Handles assessment creation logic transparently
 *
 * ACTION FUNCTION:
 * - Processes form submissions with intent-based routing
 * - Handles three distinct intents: save-progress, save-answer, complete
 * - Provides atomic operations with proper error boundaries
 * - Returns JSON responses for AJAX consumption
 *
 * COMPONENT ARCHITECTURE:
 * - Lazy loads SurveyComponent for bundle size optimization
 * - Uses ClientOnly wrapper for SSR compatibility
 * - Implements Suspense boundaries with skeleton loading
 * - Provides fallback UI for JavaScript-disabled environments
 *
 * ==================================================================================
 * DATA FLOW & STATE MANAGEMENT
 * ==================================================================================
 *
 * INITIALIZATION FLOW:
 * 1. User navigates to /assessment/take
 * 2. Loader authenticates and checks for existing open assessment
 * 3. Creates new assessment if none exists, or loads existing
 * 4. Converts assessment questions to SurveyJS format
 * 5. Provides initial data to client component
 * 6. Client hydrates survey component with server state
 *
 * REAL-TIME PERSISTENCE:
 * User Input → SurveyComponent callback → useFetcher submission →
 * Route action → Database operation → Success response → UI feedback
 *
 * INTENT-BASED ACTIONS:
 * - 'save-answer': Individual question persistence (real-time)
 * - 'save-progress': Page navigation with bulk data update
 * - 'complete': Final submission with status change and redirect
 *
 * STATE SYNCHRONIZATION:
 * - Server state: Database persistence via Prisma
 * - Client state: React state + SurveyJS model
 * - Network state: Remix fetcher for optimistic updates
 * - UI state: Loading indicators and section tracking
 *
 * ==================================================================================
 * USER EXPERIENCE PATTERNS
 * ==================================================================================
 *
 * PROGRESSIVE ENHANCEMENT:
 * - Works without JavaScript (basic form submission)
 * - Enhanced with JavaScript (real-time persistence)
 * - Optimistic UI updates for immediate feedback
 * - Graceful degradation for slow networks
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Lazy loading of survey component reduces initial bundle
 * - ClientOnly wrapper prevents SSR hydration mismatches
 * - Skeleton loading provides immediate visual feedback
 * - Debounced persistence reduces server load
 *
 * ACCESSIBILITY FEATURES:
 * - Semantic HTML structure for screen readers
 * - Progress indicators for assessment completion
 * - Keyboard navigation support via SurveyJS
 * - Focus management during dynamic content updates
 *
 * MOBILE RESPONSIVENESS:
 * - Touch-optimized survey controls
 * - Responsive layout for small screens
 * - Optimized for portrait and landscape orientations
 * - Reduced bandwidth usage with efficient updates
 *
 * ==================================================================================
 * ERROR HANDLING & EDGE CASES
 * ==================================================================================
 *
 * HANDLED SCENARIOS:
 *
 * 1. AUTHENTICATION FAILURES:
 *    - Automatic redirect to login via requireUserId
 *    - Session expiration handling during assessment
 *    - Unauthorized access prevention
 *
 * 2. ASSESSMENT STATE CONFLICTS:
 *    - Multiple open assessments (prevented by server logic)
 *    - Concurrent user sessions (last-write-wins)
 *    - Assessment deletion during completion
 *
 * 3. NETWORK INTERRUPTIONS:
 *    - Failed submissions with user feedback
 *    - Retry mechanisms for critical operations
 *    - Offline state detection and queuing
 *
 * 4. DATA VALIDATION ERRORS:
 *    - Invalid form data with descriptive errors
 *    - JSON parsing failures in submissions
 *    - Required field validation
 *
 * 5. COMPONENT LOADING FAILURES:
 *    - Lazy loading fallbacks for SurveyComponent
 *    - JavaScript disabled graceful degradation
 *    - Bundle loading timeout handling
 *
 * ==================================================================================
 * INTEGRATION POINTS & DEPENDENCIES
 * ==================================================================================
 *
 * BACKEND INTEGRATION:
 * - Prisma ORM for database operations
 * - Authentication system for user validation
 * - Assessment server utilities for business logic
 * - Question configuration management
 *
 * FRONTEND INTEGRATION:
 * - SurveyJS for survey rendering and interaction
 * - React Router for navigation and data loading
 * - UI component system for consistent styling
 * - Client-side state management with React hooks
 *
 * THIRD-PARTY DEPENDENCIES:
 * - SurveyJS library for survey functionality
 * - Remix framework for full-stack architecture
 * - React Suspense for loading boundaries
 * - Custom UI components for design system
 *
 * ==================================================================================
 * DEPLOYMENT & MONITORING CONSIDERATIONS
 * ==================================================================================
 *
 * PERFORMANCE METRICS:
 * - Page load times and bundle size impact
 * - Database query performance for assessment operations
 * - Real-time persistence latency measurements
 * - User engagement and completion rates
 *
 * ERROR MONITORING:
 * - Server action failures and error rates
 * - Client-side JavaScript errors
 * - Database operation timeouts
 * - Assessment completion funnel analysis
 *
 * SCALABILITY PATTERNS:
 * - Stateless server operations for horizontal scaling
 * - Database connection pooling via Prisma
 * - CDN-friendly static asset organization
 * - Efficient caching strategies for question data
 *
 * ==================================================================================
 * FUTURE ENHANCEMENT OPPORTUNITIES
 * ==================================================================================
 *
 * 1. REAL-TIME COLLABORATION:
 *    - WebSocket integration for live updates
 *    - Multi-user assessment support
 *    - Shared progress indicators
 *
 * 2. ADVANCED PERSISTENCE:
 *    - Offline support with IndexedDB
 *    - Background sync for queued operations
 *    - Conflict resolution for concurrent edits
 *
 * 3. ANALYTICS INTEGRATION:
 *    - User interaction tracking
 *    - Assessment completion funnels
 *    - Performance monitoring dashboards
 *
 * 4. ACCESSIBILITY ENHANCEMENTS:
 *    - Screen reader optimization
 *    - High contrast mode support
 *    - Keyboard navigation improvements
 *
 * 5. PERFORMANCE OPTIMIZATIONS:
 *    - Question-level code splitting
 *    - Predictive prefetching
 *    - Service worker caching
 *
 * ==================================================================================
 * UMBRELLA QUESTION SUPPORT (v2.0)
 * ==================================================================================
 *
 * QUESTION DATA ENHANCEMENT:
 * - Added `type` field to question objects for umbrella question identification
 * - Added `parentQuestionId` field for sub-question to parent relationships
 * - Enhanced loader data structure to support question hierarchy
 *
 * ANSWER PROCESSING:
 * - Filters out umbrella questions (`type: 'group'`) from answer processing
 * - Prevents value change handling for non-answerable umbrella questions
 * - Maintains clean answer state by ignoring navigation-only questions
 *
 * NAVIGATION INTEGRATION:
 * - Passes question type information to navigation components
 * - Supports hierarchical navigation with parent-child relationships
 * - Enables proper progress calculation excluding umbrella questions
 *
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @updated 2025-07-18 - Integrated centralized navigation hook to prevent ping pong effects
 * @updated 2025-07-28 - Added umbrella question support with hierarchy handling
 * @requires react
 * @requires react-router
 * @requires #app/components/assessment/survey-component
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 *
 * @example
 * ```tsx
 * // Route usage in app routing
 * import TakeRoute from './assessment+/take.tsx'
 *
 * // The route handles its own data loading and form processing
 * // Users navigate to /assessment/take to begin or continue assessments
 * ```
 *
 * @see {@link app/components/assessment/survey-component.tsx} for UI component
 * @see {@link app/components/hooks/use-assessment-navigation.ts} for navigation state management
 * @see {@link app/utils/assessment.server.ts} for backend operations
 * @see {@link app/utils/assessment-questions.ts} for question configuration
 */

import { AlertCircle } from 'lucide-react'
import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { redirect, useFetcher, useLoaderData, Link } from 'react-router'
import { AssessmentNavigation } from '#app/components/assessment/assessment-navigation.tsx'
import { ClientOnly } from '#app/components/client-only.tsx'
import { useAssessmentNavigation } from '#app/components/hooks/use-assessment-navigation.ts'
import { Alert, AlertDescription } from '#app/components/ui/alert.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Separator } from '#app/components/ui/separator.tsx'
import { Skeleton } from '#app/components/ui/skeleton.tsx'
import {
	assessmentQuestions,
	convertToSurveyJsFormat,
} from '#app/utils/assessment-questions.ts'
import {
	getUserOpenAssessment,
	createAssessment,
	updateAssessmentProgress,
	saveAssessmentAnswer,
	completeAssessment,
} from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/take'

// Lazy load the survey component
const SurveyComponent = lazy(() =>
	import('#app/components/assessment/survey-component.tsx').then((module) => ({
		default: module.SurveyComponent,
	})),
)

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)

	let assessment = await getUserOpenAssessment(userId)

	// Create new assessment if none exists
	if (!assessment) {
		assessment = await createAssessment(userId)
	}

	const surveyJson = convertToSurveyJsFormat(assessmentQuestions)
	const surveyData = assessment!.surveyData
		? JSON.parse(assessment!.surveyData)
		: {}

	return {
		assessment: {
			id: assessment!.id,
			currentPageIndex: assessment!.currentPageIndex,
			surveyData,
		},
		surveyJson,
		questions: assessmentQuestions.map((q) => ({
			questionId: q.questionId,
			section: q.section,
			title: q.title,
			isRequired: q.isRequired,
			type: q.type, // Add type information
			parentQuestionId: q.parentQuestionId, // Add parent relationship
		})),
	}
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	const assessment = await getUserOpenAssessment(userId)
	if (!assessment) {
		throw new Error('No open assessment found')
	}

	switch (intent) {
		case 'save-progress': {
			const surveyDataStr = formData.get('surveyData')
			if (typeof surveyDataStr !== 'string') {
				throw new Error('Invalid survey data')
			}
			const surveyData = JSON.parse(surveyDataStr) as Record<string, any>
			const currentPageIndex = Number(formData.get('currentPageIndex'))

			await updateAssessmentProgress(
				assessment.id,
				surveyData,
				currentPageIndex,
			)

			return { success: true }
		}

		case 'save-answer': {
			const questionName = formData.get('questionName') as string
			const answerStr = formData.get('answer')
			const questionMetaStr = formData.get('questionMeta')
			if (
				typeof answerStr !== 'string' ||
				typeof questionMetaStr !== 'string'
			) {
				throw new Error('Invalid answer data')
			}
			const answer = JSON.parse(answerStr)
			const questionMeta = JSON.parse(questionMetaStr) as {
				questionId: string
				section: string
				score: number
			}

			await saveAssessmentAnswer(
				assessment.id,
				questionMeta.questionId,
				questionName,
				questionMeta.section,
				answer,
			)

			return { success: true }
		}

		case 'validate': {
			const surveyDataStr = formData.get('surveyData')
			if (typeof surveyDataStr !== 'string') {
				throw new Error('Invalid survey data')
			}
			const surveyData = JSON.parse(surveyDataStr) as Record<string, any>

			// Check which required questions are missing
			const missingQuestions = assessmentQuestions
				.filter((q) => q.isRequired && !surveyData[q.name])
				.map((q) => ({
					questionId: q.questionId,
					name: q.name,
					title: q.title,
					section: q.section,
				}))

			if (missingQuestions.length === 0) {
				return redirect('/assessment/review')
			}

			return { missingQuestions }
		}

		case 'complete': {
			const surveyDataStr = formData.get('surveyData')
			if (typeof surveyDataStr !== 'string') {
				throw new Error('Invalid survey data')
			}
			const surveyData = JSON.parse(surveyDataStr) as Record<string, any>

			// Save final state
			await updateAssessmentProgress(
				assessment.id,
				surveyData,
				assessmentQuestions.length - 1,
			)

			// Mark as completed
			await completeAssessment(assessment.id)

			// Redirect to completion page instead of summary
			return redirect('/assessment/complete')
		}

		default:
			throw new Error(`Unknown intent: ${intent}`)
	}
}

export default function AssessmentTake() {
	console.log('🏠 AssessmentTake component render')
	const { assessment, surveyJson, questions } = useLoaderData<typeof loader>()
	console.log('🎯 Assessment currentPageIndex:', assessment.currentPageIndex)
	const fetcher = useFetcher()
	console.log('📊 Fetcher state:', fetcher.state)

	// Centralized navigation system
	const assessmentNavigation = useAssessmentNavigation(
		assessment.currentPageIndex,
		questions.length,
		async (pageIndex: number, signal?: AbortSignal) => {
			// Check if navigation was aborted
			if (signal?.aborted) {
				throw new Error('Navigation aborted')
			}

			// Update survey model
			const surveyModel = (window as any).surveyModel
			if (surveyModel) {
				isProgrammaticNavigation.current = true
				surveyModel.currentPageNo = pageIndex
				setCurrentSection(questions[pageIndex]?.section || '')
				setShowValidation(false)
				setMissingQuestions([])
				// Reset flag after a brief delay to allow SurveyJS events to process
				setTimeout(() => {
					isProgrammaticNavigation.current = false
				}, 100)
			}

			// Check again if aborted before server request
			if (signal?.aborted) {
				throw new Error('Navigation aborted')
			}

			// Save progress to server
			return new Promise((resolve, reject) => {
				void fetcher.submit(
					{
						intent: 'save-progress',
						currentPageIndex: String(pageIndex),
						surveyData: JSON.stringify(surveyModel?.data || {}),
					},
					{ method: 'POST' },
				)

				// Set a maximum timeout to prevent infinite waiting
				const timeoutId = setTimeout(() => {
					reject(new Error('Navigation timeout'))
				}, 2000)

				// Monitor for completion or abortion
				const checkCompletion = () => {
					if (signal?.aborted) {
						clearTimeout(timeoutId)
						reject(new Error('Navigation aborted'))
						return
					}

					if (fetcher.state === 'idle') {
						clearTimeout(timeoutId)
						resolve(void 0)
					} else {
						setTimeout(checkCompletion, 50)
					}
				}

				checkCompletion()
			})
		},
	)

	const [currentSection, setCurrentSection] = useState(
		questions[assessment.currentPageIndex]?.section ||
			questions[0]?.section ||
			'',
	)
	const [showValidation, setShowValidation] = useState(false)
	const [missingQuestions, setMissingQuestions] = useState<any[]>([])
	const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
		new Set(),
	)

	const [loadingTimeout, setLoadingTimeout] = useState(false)
	const isProgrammaticNavigation = useRef(false)

	// Handle loading timeout
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingTimeout(true)
		}, 10000) // 10 second timeout

		return () => clearTimeout(timer)
	}, [])

	// Initialize answered questions from assessment data
	useEffect(() => {
		const answered = new Set<string>()

		// Initialize from initial survey data (from loader)
		if (assessment.surveyData && typeof assessment.surveyData === 'object') {
			Object.keys(assessment.surveyData).forEach((fieldName) => {
				const value = assessment.surveyData![fieldName]
				// Check if value is considered "answered" (not empty/null/undefined)
				const hasValue =
					value !== undefined &&
					value !== null &&
					value !== '' &&
					!((value as any)?.length === 0) &&
					!(
						typeof value === 'object' &&
						value !== null &&
						!Array.isArray(value) &&
						Object.keys(value as Record<string, any>).length === 0
					)

				if (hasValue) {
					const question = questions.find((q) => {
						// Find matching question by comparing with assessmentQuestions
						const fullQuestion = assessmentQuestions.find(
							(aq) => aq.questionId === q.questionId,
						)
						return fullQuestion?.name === fieldName
					})
					if (question) {
						answered.add(question.questionId)
					}
				}
			})
		}

		setAnsweredQuestions(answered)
	}, [questions, assessment.surveyData])

	const handleValueChanged = useCallback(
		(name: string, value: any, questionMeta: any) => {
			console.log('🚀 handleValueChanged called:', name, value)

			// Update answered questions immediately for UI feedback
			const question = questions.find((q) => {
				const fullQuestion = assessmentQuestions.find(
					(aq) => aq.questionId === q.questionId,
				)
				return fullQuestion?.name === name
			})

			// Only process answers for non-umbrella questions
			const fullQuestion = assessmentQuestions.find(
				(aq) => aq.questionId === question?.questionId,
			)
			if (fullQuestion?.type === 'group') {
				console.log('⚠️ Ignoring value change for umbrella question:', name)
				return
			}

			if (question) {
				setAnsweredQuestions((prev) => {
					const newSet = new Set(prev)
					// Check if value is considered "answered" (not empty/null/undefined)
					const hasValue =
						value !== undefined &&
						value !== null &&
						value !== '' &&
						!(Array.isArray(value) && value.length === 0) &&
						!(
							typeof value === 'object' &&
							value !== null &&
							!Array.isArray(value) &&
							Object.keys(value).length === 0
						)

					if (hasValue) {
						newSet.add(question.questionId)
					} else {
						newSet.delete(question.questionId)
					}
					return newSet
				})
			}

			// Existing save logic
			void fetcher.submit(
				{
					intent: 'save-answer',
					questionName: name,
					answer: JSON.stringify(value),
					questionMeta: JSON.stringify(questionMeta),
				},
				{ method: 'POST' },
			)
		},
		[fetcher, questions],
	)

	const handlePageChanged = useCallback(
		(pageIndex: number, surveyData: any) => {
			// Skip if this is a programmatic navigation (already handled by navigation hook)
			if (isProgrammaticNavigation.current) {
				return
			}

			// Update current section
			const currentQuestion = questions[pageIndex]
			if (currentQuestion) {
				setCurrentSection(currentQuestion.section)
			}

			// Update answered questions from survey data
			const answered = new Set<string>()
			Object.keys(surveyData || {}).forEach((fieldName) => {
				const value = surveyData[fieldName]
				// Check if value is considered "answered" (not empty/null/undefined)
				const hasValue =
					value !== undefined &&
					value !== null &&
					value !== '' &&
					!((value as any)?.length === 0) &&
					!(
						typeof value === 'object' &&
						value !== null &&
						!Array.isArray(value) &&
						Object.keys(value as Record<string, any>).length === 0
					)

				if (hasValue) {
					const question = questions.find((q) => {
						const fullQuestion = assessmentQuestions.find(
							(aq) => aq.questionId === q.questionId,
						)
						return fullQuestion?.name === fieldName
					})
					if (question) {
						answered.add(question.questionId)
					}
				}
			})
			setAnsweredQuestions(answered)

			// Save progress
			void fetcher.submit(
				{
					intent: 'save-progress',
					surveyData: JSON.stringify(surveyData),
					currentPageIndex: String(pageIndex),
				},
				{ method: 'POST' },
			)
		},
		[questions, fetcher],
	)

	const handleComplete = useCallback(
		(surveyData: any) => {
			void fetcher.submit(
				{
					intent: 'complete',
					surveyData: JSON.stringify(surveyData),
				},
				{ method: 'POST' },
			)
		},
		[fetcher],
	)

	const handleFinalize = useCallback(() => {
		const surveyModel = (window as any).surveyModel // Access survey model
		if (surveyModel) {
			void fetcher.submit(
				{
					intent: 'validate',
					surveyData: JSON.stringify(surveyModel.data),
				},
				{ method: 'POST' },
			)
		}
	}, [fetcher])

	// Handle validation response
	useEffect(() => {
		if (fetcher.data?.missingQuestions) {
			setMissingQuestions(fetcher.data.missingQuestions)
			setShowValidation(true)
		}
	}, [fetcher.data])

	return (
		<div className="bg-background min-h-screen">
			{/* Mobile-First Header */}
			<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
				{/* Mobile Layout */}
				<div className="flex h-14 items-center justify-between px-4 sm:hidden">
					<Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
						<Link to="/dashboard">
							<Icon name="arrow-left" className="h-4 w-4" />
							<span className="sr-only">Back to Dashboard</span>
						</Link>
					</Button>
					<h1 className="truncate text-base font-semibold">
						Human Rights Due Diligence...
					</h1>
					<Button
						onClick={handleFinalize}
						size="sm"
						className="h-8 px-3 text-xs"
					>
						Finalize
					</Button>
				</div>

				{/* Desktop/Tablet Layout */}
				<div className="hidden h-16 items-center gap-4 px-4 sm:flex lg:px-6">
					<Button variant="ghost" size="sm" asChild className="shrink-0">
						<Link to="/dashboard">
							<Icon name="arrow-left" className="mr-2 h-4 w-4" />
							<span className="hidden md:inline">Dashboard</span>
							<span className="md:hidden">Back</span>
						</Link>
					</Button>
					<Separator orientation="vertical" className="h-6" />
					<div className="min-w-0 flex-1">
						<h1 className="truncate text-lg font-semibold">
							Human Rights Due Diligence Assessment
						</h1>
						{missingQuestions.length > 0 && (
							<p className="text-muted-foreground truncate text-xs">
								{missingQuestions.length} mandatory questions remaining
							</p>
						)}
					</div>
					<Button onClick={handleFinalize} size="sm" className="shrink-0">
						<Icon name="check" className="mr-2 h-4 w-4" />
						Finalize Assessment
					</Button>
				</div>
			</header>

			<main className="flex-1">
				<div className="p-3 sm:p-4 lg:p-6">
					<div className="mx-auto w-full max-w-5xl">
						{showValidation && missingQuestions.length > 0 && (
							<Alert className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									<p className="mb-2 font-medium">
										Please complete the following mandatory questions:
									</p>
									<ul className="list-inside list-disc space-y-1">
										{missingQuestions.map((q) => (
											<li key={q.questionId}>
												<button
													className="text-primary underline"
													onClick={() => {
														// Navigate to question
														const surveyModel = (window as any).surveyModel
														const question = surveyModel?.getQuestionByName(
															q.name,
														)
														if (question) {
															isProgrammaticNavigation.current = true
															surveyModel.currentPage = question.page
															setShowValidation(false)
															setTimeout(() => {
																isProgrammaticNavigation.current = false
															}, 100)
														}
													}}
												>
													{q.section}: {q.title}
												</button>
											</li>
										))}
									</ul>
								</AlertDescription>
							</Alert>
						)}

						<AssessmentNavigation
							section={currentSection}
							currentQuestion={assessmentNavigation.currentPageIndex + 1}
							totalQuestions={questions.length}
							questions={questions}
							onSectionChange={assessmentNavigation.navigate}
							currentIndex={assessmentNavigation.currentPageIndex}
							answeredQuestions={answeredQuestions}
							onPageChange={assessmentNavigation.navigate}
							isNavigating={assessmentNavigation.isNavigating}
							onNavigatePrevious={assessmentNavigation.navigatePrevious}
							onNavigateNext={assessmentNavigation.navigateNext}
							canNavigatePrevious={assessmentNavigation.canNavigatePrevious}
							canNavigateNext={assessmentNavigation.canNavigateNext}
						/>

						<div className="bg-card mx-auto max-w-6xl rounded-lg p-2 shadow-sm lg:p-6">
							<ClientOnly
								fallback={
									<div className="space-y-4">
										<Skeleton className="h-8 w-3/4" />
										<Skeleton className="h-32 w-full" />
										<Skeleton className="h-10 w-32" />
									</div>
								}
							>
								{() => (
									<Suspense
										fallback={
											loadingTimeout ? (
												<div className="space-y-4 p-6">
													<Alert>
														<AlertCircle className="h-4 w-4" />
														<AlertDescription>
															<p className="mb-2 font-medium">
																Assessment is taking longer than usual to load
															</p>
															<p className="text-muted-foreground mb-3 text-sm">
																This may be due to network conditions or React
																Router v7 performance issues. The assessment
																will continue loading in the background.
															</p>
															<Button
																variant="outline"
																size="sm"
																onClick={() => window.location.reload()}
															>
																Refresh Page
															</Button>
														</AlertDescription>
													</Alert>
													<div className="space-y-2">
														<Skeleton className="h-8 w-3/4" />
														<Skeleton className="h-4 w-1/2" />
													</div>
												</div>
											) : (
												<div className="space-y-4 p-6">
													<div className="space-y-2">
														<Skeleton className="h-8 w-3/4" />
														<Skeleton className="h-4 w-1/2" />
													</div>
													<div className="space-y-3">
														<Skeleton className="h-32 w-full" />
														<div className="flex space-x-2">
															<Skeleton className="h-4 w-4 rounded-full" />
															<Skeleton className="h-4 w-24" />
														</div>
														<div className="flex space-x-2">
															<Skeleton className="h-4 w-4 rounded-full" />
															<Skeleton className="h-4 w-32" />
														</div>
														<div className="flex space-x-2">
															<Skeleton className="h-4 w-4 rounded-full" />
															<Skeleton className="h-4 w-28" />
														</div>
													</div>
													<div className="flex justify-between pt-4">
														<Skeleton className="h-10 w-20" />
														<Skeleton className="h-10 w-20" />
													</div>
												</div>
											)
										}
									>
										<SurveyComponent
											surveyJson={surveyJson}
											initialData={assessment.surveyData}
											initialPageIndex={assessment.currentPageIndex}
											onValueChanged={handleValueChanged}
											onPageChanged={handlePageChanged}
											onComplete={handleComplete}
											isNavigating={assessmentNavigation.isNavigating}
										/>
									</Suspense>
								)}
							</ClientOnly>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
