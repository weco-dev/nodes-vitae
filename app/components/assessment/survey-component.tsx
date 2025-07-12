/**
 * @fileoverview SurveyComponent - Enterprise-grade React wrapper for SurveyJS with real-time persistence
 * 
 * ==================================================================================
 * ARCHITECTURAL OVERVIEW
 * ==================================================================================
 * 
 * This component is the core UI component for the ESG (Environmental, Social, Governance) 
 * assessment system. It wraps SurveyJS library to provide:
 * 
 * 1. Real-time answer persistence to prevent data loss
 * 2. Dynamic help content injection via React portals
 * 3. Progress tracking across multi-page surveys
 * 4. Robust error handling and recovery mechanisms
 * 5. Memory-efficient lifecycle management
 * 
 * The component is designed to handle complex assessment workflows where users may:
 * - Navigate away and return to continue surveys
 * - Experience network interruptions during completion
 * - Require contextual help for complex questions
 * - Need immediate feedback on input validation
 * 
 * ==================================================================================
 * TECHNICAL ARCHITECTURE
 * ==================================================================================
 * 
 * DATA FLOW:
 * Parent Route (take.tsx) 
 *   ↓ (surveyJson, initialData, callbacks)
 * SurveyComponent 
 *   ↓ (creates SurveyJS Model)
 * SurveyJS Library
 *   ↓ (onValueChanged, onPageChanged, onComplete events)
 * Callback Functions
 *   ↓ (HTTP requests via Remix fetcher)
 * Backend API Actions
 *   ↓ (database persistence)
 * Prisma ORM → PostgreSQL/SQLite
 * 
 * STATE MANAGEMENT STRATEGY:
 * - Local state: Component initialization and UI state
 * - SurveyJS state: Form data and current page tracking
 * - Server state: Persistent storage via Remix actions
 * - Error state: Isolated error boundaries for each operation
 * 
 * PERFORMANCE CHARACTERISTICS:
 * - Lazy initialization prevents unnecessary re-renders
 * - Callback stability via useRef eliminates effect dependencies
 * - Accordion injection is on-demand per question
 * - Memory cleanup prevents React root leaks
 * 
 * ==================================================================================
 * INTEGRATION PATTERNS & USAGE EXAMPLES
 * ==================================================================================
 * 
 * BASIC USAGE:
 * ```tsx
 * import { SurveyComponent } from '#app/components/assessment/survey-component'
 * 
 * function AssessmentPage() {
 *   const surveyConfig = {
 *     pages: [{
 *       name: "environmental",
 *       elements: [{
 *         type: "radiogroup",
 *         name: "energy_source",
 *         title: "What is your primary energy source?",
 *         questionId: "env_001",
 *         section: "Environmental",
 *         score: 10,
 *         descriptions: [
 *           "Consider renewable vs non-renewable sources",
 *           "Include backup power systems",
 *           "Account for seasonal variations"
 *         ],
 *         choices: ["Solar", "Wind", "Natural Gas", "Coal"]
 *       }]
 *     }]
 *   }
 * 
 *   return (
 *     <SurveyComponent
 *       surveyJson={surveyConfig}
 *       initialData={{ energy_source: "Solar" }}
 *       onValueChanged={handleAnswerChange}
 *       onPageChanged={handleProgressUpdate}
 *       onComplete={handleSubmission}
 *     />
 *   )
 * }
 * ```
 * 
 * ADVANCED USAGE WITH ERROR HANDLING:
 * ```tsx
 * const handleValueChanged = useCallback(async (name, value, questionMeta) => {
 *   try {
 *     await fetcher.submit({
 *       intent: 'save-answer',
 *       questionName: name,
 *       answer: JSON.stringify(value),
 *       questionMeta: JSON.stringify({
 *         questionId: questionMeta.questionId,
 *         section: questionMeta.section,
 *         score: questionMeta.score
 *       })
 *     }, { method: 'POST' })
 *   } catch (error) {
 *     toast.error('Failed to save answer. Please try again.')
 *     // Implement retry logic or offline storage
 *   }
 * }, [fetcher])
 * ```
 * 
 * SURVEY JSON STRUCTURE REQUIREMENTS:
 * ```json
 * {
 *   "pages": [
 *     {
 *       "name": "page_identifier",
 *       "elements": [
 *         {
 *           "type": "radiogroup|checkbox|text|rating|dropdown",
 *           "name": "question_name",
 *           "title": "Question text",
 *           "questionId": "unique_db_identifier",
 *           "section": "Environmental|Social|Governance",
 *           "score": 0-100,
 *           "descriptions": ["help_text_1", "help_text_2", "help_text_3"],
 *           "choices": ["option1", "option2"],
 *           "isRequired": true|false
 *         }
 *       ]
 *     }
 *   ],
 *   "showQuestionNumbers": "off",
 *   "showProgressBar": "top",
 *   "progressBarType": "pages"
 * }
 * ```
 * 
 * ==================================================================================
 * COMPONENT LIFECYCLE & INTERNAL MECHANICS
 * ==================================================================================
 * 
 * INITIALIZATION SEQUENCE:
 * 1. Component mounts → useEffect triggered
 * 2. Survey JSON validation → Check for required structure
 * 3. SurveyJS Model creation → new Model(surveyJson)
 * 4. Event handler registration → onValueChanged, onPageChanged, onComplete
 * 5. Initial data population → survey.data = initialData
 * 6. Accordion setup → onAfterRenderQuestion handler
 * 7. Initialization flag set → setIsInitialized(true)
 * 
 * EVENT HANDLING FLOW:
 * 
 * VALUE CHANGE EVENT:
 * User Input → SurveyJS Model → onValueChanged event → Extract metadata → 
 * Call parent callback → HTTP request → Database update → UI feedback
 * 
 * PAGE CHANGE EVENT:
 * Navigation Action → SurveyJS Model → onCurrentPageChanged → Update section state →
 * Call parent callback → Save progress → Update progress indicators
 * 
 * COMPLETION EVENT:
 * Submit Action → SurveyJS Model → onComplete → Final data extraction →
 * Call parent callback → Mark as completed → Redirect to summary
 * 
 * ACCORDION INJECTION MECHANISM:
 * Question Render → onAfterRenderQuestion → Check for descriptions →
 * Create DOM container → createRoot → Mount QuestionAccordion → 
 * Store root reference → Cleanup on unmount
 * 
 * ==================================================================================
 * ERROR SCENARIOS & RECOVERY STRATEGIES
 * ==================================================================================
 * 
 * HANDLED ERROR CONDITIONS:
 * 
 * 1. INVALID SURVEY JSON:
 *    - Detection: Missing pages array or malformed structure
 *    - Recovery: Console error + early return, no survey creation
 *    - User Experience: Shows loading state indefinitely
 *    - Fix: Validate survey JSON in parent component before passing
 * 
 * 2. CALLBACK EXECUTION FAILURES:
 *    - Detection: try-catch blocks around all event handlers
 *    - Recovery: Error logging + continued operation
 *    - User Experience: Survey continues working, data may not persist
 *    - Fix: Implement retry mechanisms in parent callbacks
 * 
 * 3. ACCORDION INJECTION FAILURES:
 *    - Detection: DOM manipulation errors in onAfterRenderQuestion
 *    - Recovery: Continue without help content
 *    - User Experience: Questions display without accordion help
 *    - Fix: Validate question.descriptions structure
 * 
 * 4. MEMORY LEAKS:
 *    - Detection: Unmount cleanup in useEffect return function
 *    - Recovery: Dispose survey model + unmount React roots
 *    - User Experience: No visible impact
 *    - Fix: Ensure all roots are properly tracked and cleaned
 * 
 * ==================================================================================
 * PERFORMANCE OPTIMIZATION TECHNIQUES
 * ==================================================================================
 * 
 * CALLBACK STABILIZATION:
 * ```tsx
 * // WRONG - causes survey recreation on every callback change
 * useEffect(() => {
 *   survey.onValueChanged.add(onValueChanged)
 * }, [onValueChanged])
 * 
 * // CORRECT - stable references prevent effect re-execution
 * const onValueChangedRef = useRef(onValueChanged)
 * onValueChangedRef.current = onValueChanged
 * 
 * useEffect(() => {
 *   survey.onValueChanged.add((sender, options) => {
 *     onValueChangedRef.current?.(options.name, options.value)
 *   })
 * }, []) // Empty dependency array
 * ```
 * 
 * ACCORDION ROOT MANAGEMENT:
 * ```tsx
 * // Track all React roots for proper cleanup
 * const accordionRootsRef = useRef<Map<string, Root>>(new Map())
 * 
 * // Cleanup previous accordion before creating new one
 * const existingRoot = accordionRootsRef.current.get(question.name)
 * if (existingRoot) {
 *   existingRoot.unmount()
 *   accordionRootsRef.current.delete(question.name)
 * }
 * ```
 * 
 * INITIALIZATION GUARDS:
 * ```tsx
 * // Prevent multiple survey creation
 * if (surveyRef.current && isInitialized) {
 *   console.log('Survey already exists, skipping recreation')
 *   return
 * }
 * ```
 * 
 * ==================================================================================
 * DEBUGGING & TROUBLESHOOTING GUIDE
 * ==================================================================================
 * 
 * COMMON ISSUES & SOLUTIONS:
 * 
 * ISSUE: Survey recreated on every render
 * SYMPTOMS: Console shows "Creating new survey model" repeatedly
 * SOLUTION: Check callback dependencies in parent component
 * 
 * ISSUE: Accordions not showing
 * SYMPTOMS: Questions display without help content
 * DEBUG: Check question.descriptions array in survey JSON
 * SOLUTION: Ensure descriptions is array of strings, max 3 items
 * 
 * ISSUE: Answers not saving
 * SYMPTOMS: Data lost on page refresh
 * DEBUG: Check network tab for failed POST requests
 * SOLUTION: Verify parent onValueChanged callback implementation
 * 
 * ISSUE: Memory leaks
 * SYMPTOMS: Page becomes slow after multiple survey interactions
 * DEBUG: Check React DevTools for leaked components
 * SOLUTION: Verify accordionRootsRef cleanup in useEffect return
 * 
 * CONSOLE LOGGING GUIDE:
 * - "🎯 SurveyComponent render called" - Component render
 * - "🔄 SurveyComponent useEffect triggered" - Initialization start
 * - "🆕 Creating new survey model" - New survey creation
 * - "📝 Survey model created" - Survey successfully created
 * - "📊 Survey value changed" - Answer updated
 * - "🔄 Calling onValueChanged callback" - Parent callback triggered
 * 
 * ==================================================================================
 * FUTURE ENHANCEMENT OPPORTUNITIES
 * ==================================================================================
 * 
 * 1. TYPE SAFETY IMPROVEMENTS:
 *    - Replace 'any' types with proper TypeScript interfaces
 *    - Add generic types for survey data structure
 *    - Implement strict typing for question metadata
 * 
 * 2. ACCESSIBILITY ENHANCEMENTS:
 *    - Add ARIA labels for screen readers
 *    - Implement keyboard navigation for accordions
 *    - Add focus management for dynamic content
 * 
 * 3. PERFORMANCE OPTIMIZATIONS:
 *    - Implement question-level memoization
 *    - Add virtual scrolling for long surveys
 *    - Optimize DOM manipulation in accordion injection
 * 
 * 4. ADVANCED FEATURES:
 *    - Offline support with IndexedDB
 *    - Real-time collaboration
 *    - Conditional question logic
 *    - Custom validation rules
 * 
 * 5. MONITORING & ANALYTICS:
 *    - User interaction tracking
 *    - Performance metrics
 *    - Error reporting integration
 *    - Completion rate analysis
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires react ^18.0.0
 * @requires react-dom ^18.0.0
 * @requires survey-core
 * @requires survey-react-ui
 * @requires #app/components/ui/accordion
 * 
 * @example
 * // Basic usage in assessment flow
 * <SurveyComponent
 *   surveyJson={convertToSurveyJsFormat(assessmentQuestions)}
 *   initialData={existingAnswers}
 *   onValueChanged={handleAnswerPersistence}
 *   onPageChanged={handleProgressTracking}
 *   onComplete={handleAssessmentCompletion}
 * />
 * 
 * @see {@link app/routes/assessment+/take.tsx} for usage example
 * @see {@link app/utils/assessment-questions.ts} for survey JSON structure
 * @see {@link app/utils/assessment.server.ts} for backend persistence
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '#app/components/ui/accordion'
import 'survey-core/survey-core.min.css'

interface SurveyComponentProps {
	surveyJson: any
	initialData?: Record<string, any>
	onValueChanged?: (name: string, value: any, questionMeta: any) => void
	onPageChanged?: (pageIndex: number, surveyData: any) => void
	onComplete?: (surveyData: any) => void
}

function QuestionAccordion({ descriptions }: { descriptions: string[] }) {
	const limitedDescriptions = descriptions.slice(0, 3)

	return (
		<Accordion type="single" collapsible className="mt-2 mb-4 w-full">
			{limitedDescriptions.map((desc, index) => (
				<AccordionItem key={index} value={`item-${index}`}>
					<AccordionTrigger>More Info {index + 1}</AccordionTrigger>
					<AccordionContent>{desc}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

export function SurveyComponent({
	surveyJson,
	initialData = {},
	onValueChanged,
	onPageChanged,
	onComplete,
}: SurveyComponentProps) {
	console.log('🎯 SurveyComponent render called')
	const surveyRef = useRef<Model | null>(null)
	const accordionRootsRef = useRef<Map<string, any>>(new Map())
	const [isInitialized, setIsInitialized] = useState(false)

	// Store callbacks in refs to avoid triggering useEffect
	const onValueChangedRef = useRef(onValueChanged)
	const onPageChangedRef = useRef(onPageChanged)
	const onCompleteRef = useRef(onComplete)

	// Update refs when callbacks change
	onValueChangedRef.current = onValueChanged
	onPageChangedRef.current = onPageChanged
	onCompleteRef.current = onComplete

	useEffect(() => {
		console.log('🔄 SurveyComponent useEffect triggered')

		// If we already have a survey and surveyJson hasn't changed, don't recreate
		if (surveyRef.current && isInitialized) {
			console.log(
				'✅ Survey already exists and initialized, skipping recreation',
			)
			return
		}

		console.log('🆕 Creating new survey model')
		// Reset initialization state
		setIsInitialized(false)

		// Validate surveyJson before creating model
		if (!surveyJson || !surveyJson.pages || !Array.isArray(surveyJson.pages)) {
			console.error('Invalid survey JSON structure:', surveyJson)
			return
		}

		// Create survey model
		const survey = new Model(surveyJson)
		console.log('📝 Survey model created:', survey)

		// Configure survey to trigger value changes on text input changes
		survey.textUpdateMode = 'onTyping'

		surveyRef.current = survey

		// Set initial data before adding event handlers
		if (initialData && Object.keys(initialData).length > 0) {
			survey.data = initialData
		}

		// Handle value changes
		survey.onValueChanged.add((sender, options) => {
			console.log('📊 Survey value changed:', options.name, options.value)
			try {
				const question = survey.getQuestionByName(options.name)
				if (question && onValueChangedRef.current) {
					const questionMeta = {
						questionId: (question as any).questionId || options.name,
						section: (question as any).section || 'Unknown',
						score: (question as any).score || 0,
					}
					console.log('🔄 Calling onValueChanged callback')
					onValueChangedRef.current(options.name, options.value, questionMeta)
				}
			} catch (error) {
				console.error('Error in onValueChanged:', error)
			}
		})

		// Handle page changes
		survey.onCurrentPageChanged.add((sender) => {
			try {
				if (onPageChangedRef.current) {
					onPageChangedRef.current(sender.currentPageNo, sender.data)
				}
			} catch (error) {
				console.error('Error in onPageChanged:', error)
			}
		})

		// Handle completion
		survey.onComplete.add((sender) => {
			try {
				if (onCompleteRef.current) {
					onCompleteRef.current(sender.data)
				}
			} catch (error) {
				console.error('Error in onComplete:', error)
			}
		})

		// Inject accordions after questions render
		survey.onAfterRenderQuestion.add((sender, options) => {
			try {
				const question = options.question

				if (
					question &&
					question.descriptions &&
					Array.isArray(question.descriptions) &&
					question.descriptions.every(
						(desc: unknown) => typeof desc === 'string',
					)
				) {
					// Clean up previous accordion if exists
					const existingRoot = accordionRootsRef.current.get(question.name)
					if (existingRoot) {
						existingRoot.unmount()
					}

					// Create container for accordion
					const accordionContainer = document.createElement('div')
					accordionContainer.className = 'question-accordion-wrapper'

					// Find question title element
					const questionTitle =
						options.htmlElement?.querySelector('.sv_q_title')
					if (questionTitle && questionTitle.parentNode) {
						// Insert after title, before question content
						questionTitle.parentNode.insertBefore(
							accordionContainer,
							questionTitle.nextSibling,
						)

						// Render React component
						const root = createRoot(accordionContainer)
						accordionRootsRef.current.set(question.name, root)
						root.render(
							<QuestionAccordion
								descriptions={question.descriptions as string[]}
							/>,
						)
					}
				}
			} catch (error) {
				console.error('Error in accordion injection:', error)
			}
		})

		// Mark as initialized after all setup is complete
		setIsInitialized(true)

		const localAccordionRoots = accordionRootsRef.current

		return () => {
			// Reset initialization state on cleanup
			setIsInitialized(false)

			// Cleanup accordions
			localAccordionRoots.forEach((root) => root.unmount())
			localAccordionRoots.clear()

			// Cleanup survey
			survey.dispose()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Update survey data when initialData changes (without recreating the survey)
	// Only update if the survey doesn't already have data to prevent overwriting user input
	useEffect(() => {
		if (
			surveyRef.current &&
			initialData &&
			Object.keys(initialData).length > 0
		) {
			// Only set initial data if the survey is empty or has no user input
			const currentData = surveyRef.current.data
			if (!currentData || Object.keys(currentData).length === 0) {
				surveyRef.current.data = initialData
			}
		}
	}, [initialData])

	// Don't render if survey isn't properly initialized
	if (!isInitialized || !surveyRef.current) {
		return (
			<div className="survey-container">
				<div className="p-8 text-center">
					<p className="text-muted-foreground">Loading survey...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="survey-container">
			<Survey model={surveyRef.current} />
		</div>
	)
}
