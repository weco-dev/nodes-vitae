/**
 * @fileoverview Demo Take Route - Demo Assessment Interface
 *
 * This route provides the main interface for users to experience the demo assessment.
 * It's based on the production assessment route but adapted for:
 * - No authentication required
 * - localStorage-based persistence
 * - 25 demo questions only
 * - Simplified UX focused on conversion
 */

import { AlertCircle } from 'lucide-react'
import { lazy, Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { useFetcher, useLoaderData, Link, redirect } from 'react-router'
import { AssessmentNavigation } from '#app/components/assessment/assessment-navigation.tsx'
import { ClientOnly } from '#app/components/client-only.tsx'
import { useAssessmentNavigation } from '#app/components/hooks/use-assessment-navigation.ts'
import { Alert, AlertDescription } from '#app/components/ui/alert.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Skeleton } from '#app/components/ui/skeleton.tsx'
import {
	initializeDemoAnalytics,
	trackDemoQuestionAnswer,
	trackDemoNavigation,
	trackDemoError,
	trackDemoLoadingPerformance,
} from '#app/utils/demo-analytics.ts'
import {
	demoAssessmentQuestions,
	convertDemoToSurveyJsFormat,
	getDemoAnswerableQuestions,
} from '#app/utils/demo-questions.ts'
import {
	saveCompletedDemoSession,
	demoSessionExists,
	type CompletedDemoSessionData,
} from '#app/utils/demo-session.server.ts'
import {
	getDemoDataFromLocalStorage,
	saveDemoProgressToLocalStorage,
	saveDemoAnswerToLocalStorage,
	completeDemoInLocalStorage,
	clearDemoData,
	ensureDemoSessionId,
} from '#app/utils/demo-storage.ts'
import { type Route } from './+types/take'

// Lazy load the survey component
const SurveyComponent = lazy(() =>
	import('#app/components/assessment/survey-component.tsx').then((module) => ({
		default: module.SurveyComponent,
	})),
)

export async function loader({}: Route.LoaderArgs) {
	// No authentication required for demo
	const demoData = getDemoDataFromLocalStorage()
	const surveyJson = convertDemoToSurveyJsFormat(demoAssessmentQuestions, true) // Force all questions to be required

	return {
		assessment: {
			id: 'demo',
			sessionId: demoData.sessionId,
			currentPageIndex: demoData.currentPageIndex,
			surveyData: demoData.surveyData,
		},
		surveyJson,
		questions: demoAssessmentQuestions.map((q) => ({
			questionId: q.questionId,
			section: q.section,
			title: q.title,
			isRequired: q.isRequired,
			type: q.type,
			// parentQuestionId: q.parentQuestionId,
		})),
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const intent = formData.get('intent')

	switch (intent) {
		case 'save-progress': {
			const surveyDataStr = formData.get('surveyData')
			if (typeof surveyDataStr !== 'string') {
				throw new Error('Invalid survey data')
			}
			const surveyData = JSON.parse(surveyDataStr) as Record<string, any>
			const currentPageIndex = Number(formData.get('currentPageIndex'))

			saveDemoProgressToLocalStorage(surveyData, currentPageIndex)
			return { success: true }
		}

		case 'save-answer': {
			const questionName = formData.get('questionName') as string
			const answerStr = formData.get('answer')
			if (typeof answerStr !== 'string') {
				throw new Error('Invalid answer data')
			}
			const answer = JSON.parse(answerStr)

			// Note: localStorage save happens on client side in handleValueChanged
			// This action is only for analytics tracking

			// Track analytics for demo
			const questionMetaStr = formData.get('questionMeta')
			if (typeof questionMetaStr === 'string') {
				const questionMeta = JSON.parse(questionMetaStr) as any
				trackDemoQuestionAnswer(questionMeta.questionId, questionName, answer, {
					section: questionMeta.section,
					questionType: questionMeta.type,
				})
			}

			return { success: true }
		}

		case 'complete': {
			const sessionId = formData.get('sessionId') as string
			const completionDataStr = formData.get('completionData') as string

			// 1. Complete in localStorage (existing) - this runs on client side
			completeDemoInLocalStorage()

			// 2. NEW: Save completed session to database
			if (completionDataStr && sessionId && sessionId !== 'ssr-placeholder') {
				try {
					const completedData = JSON.parse(
						completionDataStr,
					) as CompletedDemoSessionData

					// Check if already stored to prevent duplicates
					const exists = await demoSessionExists(sessionId)

					if (!exists) {
						await saveCompletedDemoSession(sessionId, completedData)
					}
				} catch (error) {
					// Database save failure doesn't break demo completion
					console.warn('Failed to save completed demo session:', error)
				}
			}

			return redirect('/demo/complete')
		}

		default:
			throw new Error(`Unknown intent: ${intent}`)
	}
}

export default function DemoTake() {
	const { assessment, surveyJson, questions } = useLoaderData<typeof loader>()
	const fetcher = useFetcher()

	// State management for demo
	const [currentSection, setCurrentSection] = useState(
		questions[assessment.currentPageIndex]?.section ||
			questions[0]?.section ||
			'',
	)
	const [currentPageIndex, setCurrentPageIndex] = useState(
		assessment.currentPageIndex,
	)
	const [surveyData, setSurveyData] = useState(assessment.surveyData)
	const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
		new Set(),
	)
	const [loadingTimeout, setLoadingTimeout] = useState(false)
	const isProgrammaticNavigation = useRef(false)

	// Initialize demo analytics on mount
	useEffect(() => {
		const startTime = performance.now()
		initializeDemoAnalytics()

		// Ensure demo session has proper session ID
		ensureDemoSessionId()

		// Track loading performance
		const endTime = performance.now()
		trackDemoLoadingPerformance('demo_take_route', endTime - startTime)
	}, [])

	// Handle demo restart
	const handleRestartDemo = () => {
		clearDemoData()
		window.location.href = '/demo/take'
	}

	// Demo-specific navigation system (adapted from assessment route)
	const assessmentNavigation = useAssessmentNavigation(
		currentPageIndex,
		questions.length,
		async (pageIndex: number, signal?: AbortSignal) => {
			if (signal?.aborted) {
				throw new Error('Navigation aborted')
			}

			// Update survey model
			const surveyModel = (window as any).surveyModel
			if (surveyModel) {
				isProgrammaticNavigation.current = true

				// Load latest data from localStorage before navigation
				const latestDemoData = getDemoDataFromLocalStorage()
				if (
					latestDemoData.surveyData &&
					Object.keys(latestDemoData.surveyData).length > 0
				) {
					surveyModel.data = latestDemoData.surveyData
				}

				surveyModel.currentPageNo = pageIndex
				setCurrentSection(questions[pageIndex]?.section || '')
				setCurrentPageIndex(pageIndex) // Update local state

				// Track navigation for demo analytics
				trackDemoNavigation(currentPageIndex, pageIndex)

				setTimeout(() => {
					isProgrammaticNavigation.current = false
				}, 100)
			}

			if (signal?.aborted) {
				throw new Error('Navigation aborted')
			}

			// Save progress to localStorage instead of database
			return new Promise((resolve, reject) => {
				void fetcher.submit(
					{
						intent: 'save-progress',
						currentPageIndex: String(pageIndex),
						surveyData: JSON.stringify(surveyModel?.data || {}),
					},
					{ method: 'POST' },
				)

				const timeoutId = setTimeout(() => {
					reject(new Error('Navigation timeout'))
				}, 5000) // Longer timeout for demo

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

	// Handle loading timeout
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingTimeout(true)
			trackDemoError('Loading timeout exceeded', {
				component: 'demo_take',
				fatal: false,
			})
		}, 15000) // Longer timeout for demo
		return () => clearTimeout(timer)
	}, [])

	// Initialize answered questions from demo data and update when localStorage changes
	const updateAnsweredQuestionsFromStorage = useCallback(() => {
		console.log(
			'🔄 updateAnsweredQuestionsFromStorage called at:',
			new Date().toISOString(),
		)
		const demoData = getDemoDataFromLocalStorage()
		const answered = new Set<string>()

		// Update survey data state
		setSurveyData(demoData.surveyData)

		console.log('🔄 Updating from localStorage:', {
			demoData: demoData.surveyData,
			dataKeys: Object.keys(demoData.surveyData || {}),
			questionsCount: questions.length,
		})

		if (demoData.surveyData && typeof demoData.surveyData === 'object') {
			Object.keys(demoData.surveyData).forEach((fieldName) => {
				const value = demoData.surveyData[fieldName]
				const hasValue =
					value !== undefined &&
					value !== null &&
					value !== '' &&
					!((value as any)?.length === 0)

				console.log('🔍 Checking field:', {
					fieldName,
					value,
					hasValue,
				})

				if (hasValue) {
					const question = questions.find((q) => {
						const fullQuestion = demoAssessmentQuestions.find(
							(aq) => aq.questionId === q.questionId,
						)
						console.log('🔎 Comparing:', {
							fieldName,
							questionId: q.questionId,
							fullQuestionName: fullQuestion?.name,
							matches: fullQuestion?.name === fieldName,
						})
						return fullQuestion?.name === fieldName
					})
					if (question) {
						console.log('✅ Found answered question:', {
							fieldName,
							value,
							questionId: question.questionId,
							section: question.section,
						})
						answered.add(question.questionId)
					} else {
						console.log('❌ No question found for field:', fieldName)
					}
				}
			})
		}

		console.log('🎯 Setting answered questions:', {
			answeredCount: answered.size,
			answeredIds: Array.from(answered),
			totalQuestions: getDemoAnswerableQuestions().length,
		})

		setAnsweredQuestions((prev) => {
			console.log(
				'🔄 [updateAnsweredQuestionsFromStorage] answeredQuestions state change:',
				{
					from: Array.from(prev),
					to: Array.from(answered),
					timestamp: new Date().toISOString(),
					stack: new Error().stack?.split('\n').slice(1, 4),
				},
			)
			return answered
		})
	}, [questions])

	// Initialize answered questions on mount
	useEffect(() => {
		console.log(
			'🚀 [useEffect] Initial mount - calling updateAnsweredQuestionsFromStorage',
		)
		updateAnsweredQuestionsFromStorage()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Remove dependency to prevent re-runs

	// Also update when localStorage might have changed (on visibility change)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				console.log(
					'🚀 [useEffect] Visibility change - calling updateAnsweredQuestionsFromStorage',
				)
				updateAnsweredQuestionsFromStorage()
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () =>
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Remove dependency to prevent re-runs

	const handleValueChanged = useCallback(
		(name: string, value: any, questionMeta: any) => {
			console.log('💾 Value changed:', {
				name,
				value,
				questionMeta,
			})

			// Update answered questions for UI feedback
			const question = questions.find((q) => {
				const fullQuestion = demoAssessmentQuestions.find(
					(aq) => aq.questionId === q.questionId,
				)
				return fullQuestion?.name === name
			})

			console.log('🔍 Looking for question:', {
				name,
				foundQuestion: question?.questionId,
				allQuestions: questions.map((q) => ({
					id: q.questionId,
					name: demoAssessmentQuestions.find(
						(aq) => aq.questionId === q.questionId,
					)?.name,
				})),
			})

			// Only process answers for non-umbrella questions
			const fullQuestion = demoAssessmentQuestions.find(
				(aq) => aq.questionId === question?.questionId,
			)
			// if (fullQuestion?.type === 'group') {
			// 	console.log('⏭️  Skipping umbrella question:', fullQuestion.questionId)
			// 	return
			// }

			if (question) {
				setAnsweredQuestions((prev) => {
					const newSet = new Set(prev)
					const hasValue =
						value !== undefined &&
						value !== null &&
						value !== '' &&
						!(Array.isArray(value) && value.length === 0)

					console.log('📊 [handleValueChanged] Updating answered questions:', {
						questionId: question.questionId,
						hasValue,
						value,
						previousSize: prev.size,
						timestamp: new Date().toISOString(),
					})

					if (hasValue) {
						newSet.add(question.questionId)
					} else {
						newSet.delete(question.questionId)
					}

					console.log(
						'📊 [handleValueChanged] New answered questions size:',
						newSet.size,
						Array.from(newSet),
					)
					return newSet
				})
			}

			// Save to localStorage on client side
			saveDemoAnswerToLocalStorage(name, value)

			// Also submit to server for analytics tracking
			void fetcher.submit(
				{
					intent: 'save-answer',
					questionName: name,
					answer: JSON.stringify(value),
					questionMeta: JSON.stringify({
						...questionMeta,
						section: question?.section,
						type: fullQuestion?.type,
					}),
				},
				{ method: 'POST' },
			)

			// Note: No need to call updateAnsweredQuestionsFromStorage here
			// as we already updated the state immediately above and localStorage
			// will be updated by the fetcher action
		},
		[fetcher, questions],
	)

	const handlePageChanged = useCallback(
		(pageIndex: number, surveyData: any) => {
			if (isProgrammaticNavigation.current) {
				return
			}

			const currentQuestion = questions[pageIndex]
			if (currentQuestion) {
				setCurrentSection(currentQuestion.section)
			}

			// Update current page index state
			setCurrentPageIndex(pageIndex)

			// Update answered questions from current survey data (not localStorage)
			const answered = new Set<string>()
			Object.keys(surveyData || {}).forEach((fieldName) => {
				const value = surveyData[fieldName]
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
					const question = questions.find((q) => {
						const fullQuestion = demoAssessmentQuestions.find(
							(aq) => aq.questionId === q.questionId,
						)
						return fullQuestion?.name === fieldName
					})
					if (question) {
						answered.add(question.questionId)
					}
				}
			})

			console.log('🔄 [handlePageChanged] updating answered questions:', {
				pageIndex,
				surveyDataKeys: Object.keys(surveyData || {}),
				answeredQuestions: Array.from(answered),
				timestamp: new Date().toISOString(),
			})

			setAnsweredQuestions(answered)

			// Save progress to localStorage
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
			// Get the current demo data to ensure we have the correct sessionId
			const currentDemoData = getDemoDataFromLocalStorage()
			const sessionId =
				currentDemoData.sessionId !== 'ssr-placeholder'
					? currentDemoData.sessionId
					: assessment.sessionId

			// Prepare the completion data on the client side
			const completionData = {
				sessionId,
				surveyData: currentDemoData.surveyData,
				startTime: currentDemoData.startTime,
			}

			void fetcher.submit(
				{
					intent: 'complete',
					sessionId,
					completionData: JSON.stringify(completionData),
					surveyData: JSON.stringify(surveyData),
				},
				{ method: 'POST' },
			)
		},
		[fetcher, assessment.sessionId],
	)

	const handleError = useCallback((error: Error, errorInfo: any) => {
		trackDemoError(error, {
			component: 'demo_survey',
			fatal: false,
			data: errorInfo,
		})
	}, [])

	return (
		<div className="bg-background min-h-screen">
			<main className="flex-1">
				<div className="p-3 sm:p-4 lg:p-6">
					<div className="mx-auto w-full max-w-5xl">
						{/* Demo Header */}
						<div className="mb-6">
							<div className="mb-2 flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-blue-500" />
								<h1 className="text-2xl font-semibold">
									Vitae Questionario Demo
								</h1>
							</div>
							<p className="text-muted-foreground">
								Quanto sei già attento ai diritti delle persone nella tua
								azienda? E cosa significa rispettare questi diritti nel tuo
								lavoro quotidiano?
							</p>
							<p className="text-muted-foreground">
								Rispondi a queste poche e semplici domande per capire quanto sei
								informato sul tema.
							</p>
						</div>

						{/* Assessment Navigation */}
						<AssessmentNavigation
							section={currentSection}
							currentQuestion={assessmentNavigation.currentPageIndex + 1}
							totalQuestions={getDemoAnswerableQuestions().length}
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

						{/* Survey Component */}
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
																Demo is taking longer than usual to load
															</p>
															<p className="text-muted-foreground mb-3 text-sm">
																This might be due to your internet connection or
																browser settings.
															</p>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => window.location.reload()}
																>
																	<Icon name="reset" className="mr-2 h-4 w-4" />
																	Refresh Page
																</Button>
																<Button size="sm" asChild>
																	<Link to="/signup">
																		Create Account Instead
																	</Link>
																</Button>
															</div>
														</AlertDescription>
													</Alert>
												</div>
											) : (
												<div className="space-y-4 p-6">
													<Skeleton className="h-8 w-3/4" />
													<Skeleton className="h-32 w-full" />
													<div className="flex gap-2">
														<Skeleton className="h-10 w-20" />
														<Skeleton className="h-10 w-20" />
													</div>
												</div>
											)
										}
									>
										<SurveyComponent
											surveyJson={surveyJson}
											initialData={surveyData}
											initialPageIndex={currentPageIndex}
											onValueChanged={handleValueChanged}
											onPageChanged={handlePageChanged}
											onComplete={handleComplete}
											onError={handleError}
											isNavigating={assessmentNavigation.isNavigating}
											isDemo={true}
											demoRequireAllQuestions={true}
										/>
									</Suspense>
								)}
							</ClientOnly>
						</div>

						{/* Demo Info Footer */}
						<div className="mt-8 text-center">
							<div className="bg-muted/30 rounded-lg p-4">
								<p className="text-muted-foreground text-sm">
									Questa demo ti offre un'anteprima del questionario completo
								</p>
								<p className="text-muted-foreground mb-2 text-sm">
									Crea un account gratuito per accedere al questionario completo
								</p>
								<div className="flex flex-col justify-center gap-3 sm:flex-row">
									<Button
										variant="outline"
										size="sm"
										onClick={handleRestartDemo}
									>
										<Icon name="reset" className="mr-2 h-4 w-4" />
										Riprova la demo
									</Button>
									<Button size="sm" asChild>
										<Link to="/signup">Crea account</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
					<Icon name="cross-1" className="text-destructive h-8 w-8" />
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">Demo Error</h1>
					<p className="text-muted-foreground max-w-md">
						Something went wrong with the demo. This might be a temporary issue.
					</p>
				</div>

				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<Button variant="outline" onClick={() => window.location.reload()}>
						<Icon name="reset" className="mr-2 h-4 w-4" />
						Try Again
					</Button>
					<Button asChild>
						<Link to="/">Return to Home</Link>
					</Button>
				</div>

				<div className="text-muted-foreground pt-4 text-sm">
					<p>
						You can also{' '}
						<Link to="/signup" className="underline hover:no-underline">
							create a free account
						</Link>{' '}
						to access the full assessment system.
					</p>
				</div>
			</div>
		</div>
	)
}
