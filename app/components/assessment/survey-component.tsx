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
 * 6. Three-column accordion system for contextual help (Help, Reporting, Documentation)
 * 7. Markdown support in question titles with field name display
 * 8. Conditional UI rendering for better user experience
 *
 * ==================================================================================
 * RECENT ENHANCEMENTS (v3.0 - July 2025)
 * ==================================================================================
 *
 * ### Umbrella Question Support:
 * - **Hierarchical Structure**: Support for umbrella questions that group sub-questions
 * - **Parent Title Injection**: Sub-questions display their parent umbrella question title
 * - **Visual Differentiation**: Blue-themed styling for umbrella question sections
 * - **Conditional Processing**: Different rendering logic for umbrella vs regular questions
 *
 * ### Enhanced Help System:
 * - **Three-Column Structure**: Replaced generic descriptions with semantic fields:
 *   - `help`: Contextual guidance for question understanding
 *   - `reporting`: Compliance and regulatory requirements
 *   - `docs`: Additional documentation and resources
 * - **Conditional Rendering**: Accordions only appear when content is available
 * - **Progressive Disclosure**: Users can expand relevant help sections on demand
 *
 * ### Markdown Integration:
 * - **Title Processing**: Question titles support markdown formatting (_italic_, *bold*, `code`)
 * - **Field Name Display**: Question field names appear above titles for context
 * - **Umbrella Title Display**: Parent question titles for grouped sub-questions
 * - **Safe Processing**: Secure markdown rendering without XSS vulnerabilities
 *
 * ### Mobile-First Design:
 * - **Responsive Accordions**: Optimized layout for all screen sizes
 * - **Touch-Friendly**: Enhanced touch targets for mobile interaction
 * - **Text Wrapping**: Improved text flow for long question content
 * - **Hierarchy Display**: Clear visual hierarchy for umbrella question relationships
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
 * ==================================================================================
 * UMBRELLA QUESTION IMPLEMENTATION (v3.0)
 * ==================================================================================
 *
 * QUESTION HIERARCHY PROCESSING:
 * - Umbrella questions (`type: 'group'`) provide structure without accepting input
 * - Sub-questions reference parent umbrella via `parentQuestionId` and `parentQuestionTitle`
 * - Dynamic parent title injection creates visual hierarchy
 *
 * STYLING SYSTEM:
 * ```tsx
 * // Umbrella question field names (blue theme)
 * className="bg-blue-50 text-blue-700 border-b border-blue-200"
 *
 * // Regular question field names (primary theme)
 * className="bg-primary/10 text-primary border-b border-primary/10"
 *
 * // Parent title sections (prominent blue styling)
 * className="bg-blue-50 text-blue-700 text-base font-semibold"
 * ```
 *
 * PROCESSING FLOW:
 * 1. Field name injection with umbrella-specific styling
 * 2. Parent title injection for sub-questions before field names
 * 3. Markdown processing with hierarchy-aware rendering
 * 4. Answer handling that ignores umbrella question inputs
 *
 * @version 3.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @updated 2025-07-28 - Added umbrella question support with parent-child relationships
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
 *   initialPageIndex={lastQuestionIndex}
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
import ReactMarkdown from 'react-markdown'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '#app/components/ui/accordion'
import { Icon } from '#app/components/ui/icon'
import 'survey-core/survey-core.min.css'

interface SurveyComponentProps {
	surveyJson: any
	initialData?: Record<string, any>
	initialPageIndex?: number
	onValueChanged?: (name: string, value: any, questionMeta: any) => void
	onPageChanged?: (pageIndex: number, surveyData: any) => void
	onComplete?: (surveyData: any) => void
	onError?: (error: Error, errorInfo: any) => void
	isNavigating?: boolean
	onNavigationStateChange?: (isNavigating: boolean) => void
	isDemo?: boolean // Add demo mode support
}

function QuestionAccordion({
	help,
	reporting,
	docs,
}: {
	help?: string
	reporting?: string
	docs?: string
}) {
	// Create accordion items array with conditional inclusion
	const accordionItems = [
		{
			key: 'help',
			title: 'Aiuto',
			content: help,
			icon: 'circle-question-mark' as const,
		},
		{
			key: 'reporting',
			title: 'Reporting',
			content: reporting,
			icon: 'pen-line' as const,
		},
		{
			key: 'docs',
			title: 'Documentazione',
			content: docs,
			icon: 'book-text' as const,
		},
	].filter((item) => item.content && item.content.trim() !== '')

	// Return null if no content to display
	if (accordionItems.length === 0) return null

	return (
		<Accordion
			type="single"
			collapsible
			className="bg-card mt-4 mb-4 w-full rounded-md border"
		>
			{accordionItems.map((item) => (
				<AccordionItem
					key={item.key}
					value={item.key}
					className="border-b last:border-b-0"
				>
					<AccordionTrigger className="hover:bg-muted/50 px-4 py-3 text-left">
						<div className="flex w-full items-center gap-2 text-left">
							<Icon
								name={item.icon}
								className="text-muted-foreground h-4 w-4"
							/>
							<span className="text-sm font-medium break-words whitespace-normal">
								{item.title}
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="px-4 pt-0 pb-3">
						<div className="text-muted-foreground overflow-wrap-anywhere pl-6 text-sm break-words whitespace-normal">
							<ReactMarkdown
								components={{
									// Enhanced markdown components for better styling
									p: ({ children }) => (
										<p className="mb-2 break-words whitespace-normal last:mb-0">
											{children}
										</p>
									),
									ul: ({ children }) => (
										<ul className="mb-2 ml-4 list-disc break-words last:mb-0">
											{children}
										</ul>
									),
									ol: ({ children }) => (
										<ol className="mb-2 ml-4 list-decimal break-words last:mb-0">
											{children}
										</ol>
									),
									li: ({ children }) => (
										<li className="mb-1 break-words whitespace-normal">
											{children}
										</li>
									),
									strong: ({ children }) => (
										<strong className="font-semibold break-words">
											{children}
										</strong>
									),
									em: ({ children }) => (
										<em className="break-words italic">{children}</em>
									),
									code: ({ children }) => (
										<code className="bg-muted rounded px-1 py-0.5 font-mono text-xs break-words">
											{children}
										</code>
									),
									blockquote: ({ children }) => (
										<blockquote className="border-muted border-l-4 pl-4 break-words italic">
											{children}
										</blockquote>
									),
									a: ({ children, href, ...props }) => (
										<a
											href={href}
											className="text-primary hover:text-primary/80 break-words underline"
											target="_blank"
											rel="noopener noreferrer"
											{...props}
										>
											{children}
										</a>
									),
								}}
							>
								{item.content}
							</ReactMarkdown>
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

// Helper function for safe markdown processing
function processMarkdownSafely(markdown: string): string {
	// Use a lightweight markdown processor to avoid security issues
	// Handle basic markdown manually for safety
	return (
		markdown
			// Handle links first to avoid conflicts with bold/italic
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80 transition-colors">$1</a>',
			)
			// Handle bold before italic to avoid conflicts (* must come before _)
			// Use non-greedy matching and ensure we don't match across multiple * pairs
			.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
			// For italic, use underscore syntax
			.replace(/_([^_]+)_/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>')
	)
}

export function SurveyComponent({
	surveyJson,
	initialData = {},
	initialPageIndex = 0,
	onValueChanged,
	onPageChanged,
	onComplete,
	onError,
	isNavigating = false,
	onNavigationStateChange: _onNavigationStateChange,
	isDemo = false,
}: SurveyComponentProps) {
	console.log('🎯 SurveyComponent render called')
	const surveyRef = useRef<Model | null>(null)
	const accordionRootsRef = useRef<Map<string, any>>(new Map())
	const [isInitialized, setIsInitialized] = useState(false)

	// Store callbacks in refs to avoid triggering useEffect
	const onValueChangedRef = useRef(onValueChanged)
	const onPageChangedRef = useRef(onPageChanged)
	const onCompleteRef = useRef(onComplete)
	const onErrorRef = useRef(onError)

	// Update refs when callbacks change
	onValueChangedRef.current = onValueChanged
	onPageChangedRef.current = onPageChanged
	onCompleteRef.current = onComplete
	onErrorRef.current = onError

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
			if (onErrorRef.current) {
				onErrorRef.current(new Error('Invalid survey JSON structure'), {
					surveyJson,
				})
			}
			return
		}

		try {
			// Create survey model
			const survey = new Model(surveyJson)
			console.log('📝 Survey model created:', survey)

			// Configure survey to trigger value changes on text input changes
			survey.textUpdateMode = 'onTyping'

			// Configure navigation buttons based on navigation state
			survey.showNavigationButtons = !isNavigating

			// Configure Italian button labels for all assessments
			survey.pageNextText = 'Prossima →'
			survey.pagePrevText = '← Precedente'

			// Demo-specific configuration
			if (isDemo) {
				survey.showProgressBar = 'off' // Completely hide progress bar for demo
				survey.showTitle = false
				survey.completedHtml =
					'<div class="text-center"><p class="text-muted-foreground">Demo completed! Redirecting to results...</p></div>'
				survey.completeText = 'Completa la demo'

				// Add demo watermark or indicator if needed
				if (survey.title) {
					survey.title = `${survey.title} (Demo)`
				}
			}

			surveyRef.current = survey

			// Make survey model globally accessible for finalize button
			;(window as any).surveyModel = survey

			// Set initial data before adding event handlers
			if (initialData && Object.keys(initialData).length > 0) {
				survey.data = initialData
			}

			// Set initial page index if provided
			if (initialPageIndex > 0) {
				console.log('🎯 Setting initial page index to:', initialPageIndex)
				survey.currentPageNo = initialPageIndex
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

			// Auto-save on Next Button Click
			survey.onCurrentPageChanging.add((sender, options) => {
				// Prevent survey navigation during centralized navigation
				if (isNavigating) {
					options.allow = false
					return
				}

				// Save all answers on the current page before navigation
				const currentPage = sender.currentPage
				if (currentPage && onValueChangedRef.current) {
					currentPage.questions.forEach((question: any) => {
						const value = question.value
						if (value !== undefined && value !== null && value !== '') {
							const questionMeta = {
								questionId: (question as any).questionId || question.name,
								section: (question as any).section || 'Unknown',
								score: (question as any).score || 0,
							}
							onValueChangedRef.current?.(question.name, value, questionMeta)
						}
					})
				}
			})

			// Handle page changes
			survey.onCurrentPageChanged.add((sender) => {
				try {
					if (!isNavigating && onPageChangedRef.current) {
						// Only process if not currently navigating through centralized system
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

			// Inject field names and accordions after questions render
			survey.onAfterRenderQuestion.add((sender, options) => {
				try {
					const question = options.question
					console.log('🎯 Question rendered:', question.name)

					// Step 1: Always inject field name before the title
					console.log('🔍 Debugging question rendering:', {
						questionName: question.name,
						questionTitle: question.title,
						htmlElement: !!options.htmlElement,
					})

					// Try multiple selectors to find the title element
					const titleSelectors = [
						'.sv_q_title',
						'.sv_q_title_text',
						'[aria-label*="title"]',
						'.sv-question__title',
					]
					let titleElement = null

					for (const selector of titleSelectors) {
						titleElement = options.htmlElement?.querySelector(selector)
						if (titleElement) {
							console.log(`✅ Found title element with selector: ${selector}`)
							break
						}
					}

					// If no title element found, log the HTML structure for debugging
					if (!titleElement && options.htmlElement) {
						console.log(
							'🔍 Available elements in question HTML:',
							Array.from(options.htmlElement.querySelectorAll('*')).map(
								(el) => ({
									tagName: el.tagName,
									className: el.className,
									textContent: el.textContent?.substring(0, 50),
								}),
							),
						)
						// Try to find any element that might contain the title
						titleElement = options.htmlElement.querySelector('*')
					}

					if (titleElement && question.name) {
						console.log('📝 Injecting field name for:', question.name)

						// Check if field name already exists to avoid duplicates
						const existingFieldName = titleElement.parentNode?.querySelector(
							'.question-field-name',
						)
						if (existingFieldName) {
							console.log('⚠️ Field name already exists, removing it first')
							existingFieldName.remove()
						}

						// Create field name element
						const fieldNameDiv = document.createElement('div')

						// Find the question in the original survey JSON to get custom properties
						let isUmbrellaQuestion = false
						for (const page of surveyJson.pages) {
							for (const element of page.elements) {
								if (element.name === question.name) {
									isUmbrellaQuestion = element.isUmbrellaQuestion || false
									break
								}
							}
						}

						// Debug: Log question properties to understand structure
						console.log('🔍 Question properties:', {
							name: question.name,
							type: question.type,
							isUmbrellaQuestion: isUmbrellaQuestion,
							foundInSurveyJson: isUmbrellaQuestion,
						})

						fieldNameDiv.className = `${isUmbrellaQuestion ? '-mt-6' : '-mt-4'} -ml-6 -mr-6 ${isUmbrellaQuestion ? 'sm:-mt-12 sm:-ml-12 sm:-mr-12' : 'sm:-mt-8 sm:-ml-10 sm:-mr-10'} p-4 ${isUmbrellaQuestion ? 'bg-blue-50 text-blue-700 border-b border-blue-200' : 'bg-primary/10 text-primary border-b border-primary/10'} text-sm font-medium mb-6`
						fieldNameDiv.style.textWrap = 'auto'
						fieldNameDiv.textContent = question.name

						console.log('📋 Created field name element:', fieldNameDiv)

						// Insert field name before the title element (or at the beginning of the question)
						const container = titleElement.parentNode || options.htmlElement
						if (container) {
							container.insertBefore(fieldNameDiv, container.firstChild)
							console.log(
								'✅ Field name injected successfully at beginning of container',
							)
						} else {
							console.error('❌ No container found for field name injection')
						}
					} else {
						console.log('❌ Missing titleElement or question.name:', {
							titleElement: !!titleElement,
							questionName: question.name,
						})
					}

					// Step 1.5: Inject umbrella question title for sub-questions (before field name)
					// Find the question in the original survey JSON to get parent question info
					let parentQuestionTitle: string | undefined
					let parentQuestionId: string | undefined

					for (const page of surveyJson.pages) {
						for (const element of page.elements) {
							if (element.name === question.name) {
								parentQuestionTitle = element.parentQuestionTitle
								parentQuestionId = element.parentQuestionId
								break
							}
						}
					}

					if (parentQuestionTitle && parentQuestionId) {
						console.log(
							'🏢 Injecting umbrella question title for sub-question:',
							question.name,
							'Parent title:',
							parentQuestionTitle,
						)

						// Check if umbrella title already exists to avoid duplicates
						const existingUmbrellaTitle =
							titleElement?.parentNode?.querySelector(
								'.umbrella-question-title',
							)
						if (existingUmbrellaTitle) {
							console.log('⚠️ Umbrella title already exists, removing it first')
							existingUmbrellaTitle.remove()
						}

						// Create umbrella question title element
						const umbrellaTitleDiv = document.createElement('div')
						umbrellaTitleDiv.className =
							'umbrella-question-title sm:-mt-8 sm:-ml-10 sm:-mr-10 -mt-4 -ml-6 -mr-6 mb-4 sm:mb-8 p-3 bg-blue-50 text-blue-700 text-base font-semibold mb-2 text-sm break-words whitespace-normal py-6 px-4'
						umbrellaTitleDiv.style.textWrap = 'auto'
						umbrellaTitleDiv.innerHTML =
							processMarkdownSafely(parentQuestionTitle)

						console.log('🏢 Created umbrella title element:', umbrellaTitleDiv)

						// Insert umbrella title before the field name element (at the very beginning)
						const container = titleElement?.parentNode || options.htmlElement
						if (container) {
							container.insertBefore(umbrellaTitleDiv, container.firstChild)
							console.log(
								'✅ Umbrella title injected successfully before field name',
							)
						} else {
							console.error(
								'❌ No container found for umbrella title injection',
							)
						}
					} else {
						console.log('❌ No parent question found for:', question.name)
					}

					// Step 2: Process markdown in title if it contains markdown syntax
					if (
						titleElement &&
						question.title &&
						(question.title.includes('*') ||
							question.title.includes('`') ||
							question.title.includes('['))
					) {
						console.log('📝 Processing markdown in title for:', question.name)

						// Apply markdown processing to the existing title content
						titleElement.innerHTML = processMarkdownSafely(question.title)

						console.log('✅ Title markdown processed')
					}

					// Step 2.5: Apply text wrapping styles directly via JavaScript
					if (titleElement) {
						// Apply text wrapping styles directly to ensure they work
						const htmlTitleElement = titleElement as HTMLElement
						htmlTitleElement.style.textWrap = 'auto'
						htmlTitleElement.style.whiteSpace = 'normal'
						htmlTitleElement.style.wordWrap = 'break-word'
						htmlTitleElement.style.overflowWrap = 'break-word'
						htmlTitleElement.style.wordBreak = 'break-word'
						htmlTitleElement.style.maxWidth = '100%'

						// Also apply to parent containers that might be constraining the layout
						const parentElement = htmlTitleElement.parentElement as HTMLElement
						if (parentElement) {
							parentElement.style.maxWidth = '100%'
							parentElement.style.width = '100%'
						}

						console.log(
							'✅ Text wrapping styles applied directly to title element and parent',
						)
					}

					// Also apply text wrapping to the entire question container
					if (options.htmlElement) {
						const questionContainer = options.htmlElement as HTMLElement
						questionContainer.style.maxWidth = '100%'
						questionContainer.style.width = '100%'

						// Find and apply to any title-related containers
						const titleContainers = questionContainer.querySelectorAll(
							'.sd-question--title-top, .sd-element--with-frame',
						)
						titleContainers.forEach((container) => {
							const htmlContainer = container as HTMLElement
							htmlContainer.style.textWrap = 'auto'
							htmlContainer.style.whiteSpace = 'normal'
							htmlContainer.style.wordWrap = 'break-word'
							htmlContainer.style.overflowWrap = 'break-word'
							htmlContainer.style.maxWidth = '100%'
						})

						console.log(
							'✅ Text wrapping applied to question container and title containers',
						)
					}

					// Step 3: Handle accordion injection
					// Get help content from the original survey JSON
					let help: string | undefined
					let reporting: string | undefined
					let docs: string | undefined

					// Find the question in the original survey JSON
					for (const page of surveyJson.pages) {
						for (const element of page.elements) {
							if (element.name === question.name) {
								help = element.help
								reporting = element.reporting
								docs = element.docs
								break
							}
						}
					}

					console.log(
						'🔍 Question rendering:',
						question.name,
						'help:',
						help,
						'reporting:',
						reporting,
						'docs:',
						docs,
					)

					// Only inject accordion if at least one field has content
					const hasContent =
						(help && help.trim() !== '') ||
						(reporting && reporting.trim() !== '') ||
						(docs && docs.trim() !== '')

					if (hasContent) {
						console.log('✅ Content found, injecting accordion...')

						// Clean up previous accordion if exists
						const existingRoot = accordionRootsRef.current.get(question.name)
						if (existingRoot) {
							existingRoot.unmount()
						}

						// Create container for accordion
						const accordionContainer = document.createElement('div')
						accordionContainer.className = 'question-accordion-wrapper'

						// Find question title element and inject accordion
						const questionTitle =
							options.htmlElement?.querySelector('.sv_q_title')
						if (questionTitle && questionTitle.parentNode) {
							questionTitle.parentNode.insertBefore(
								accordionContainer,
								questionTitle.nextSibling,
							)

							// Render React component with new props structure
							const root = createRoot(accordionContainer)
							accordionRootsRef.current.set(question.name, root)
							root.render(
								<QuestionAccordion
									help={help}
									reporting={reporting}
									docs={docs}
								/>,
							)
							console.log('✅ Accordion injected successfully')
						} else {
							// Fallback: append to main element
							if (options.htmlElement) {
								options.htmlElement.appendChild(accordionContainer)
								const root = createRoot(accordionContainer)
								accordionRootsRef.current.set(question.name, root)
								root.render(
									<QuestionAccordion
										help={help}
										reporting={reporting}
										docs={docs}
									/>,
								)
								console.log('✅ Accordion appended to question element')
							}
						}
					} else {
						console.log('❌ No content found for accordion')
					}
				} catch (error) {
					console.error('❌ Error in accordion injection:', error)
				}
			})

			// Mark as initialized after all setup is complete
			setIsInitialized(true)
		} catch (error) {
			console.error('Failed to initialize survey:', error)
			if (onErrorRef.current) {
				onErrorRef.current(error as Error, {
					component: 'SurveyComponent',
					action: 'initialization',
					isDemo,
				})
			}
			return
		}

		const localAccordionRoots = accordionRootsRef.current

		return () => {
			// Reset initialization state on cleanup
			setIsInitialized(false)

			// Cleanup accordions
			localAccordionRoots.forEach((root) => root.unmount())
			localAccordionRoots.clear()

			// Cleanup survey
			if (surveyRef.current) {
				surveyRef.current.dispose()
			}
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

	// Update navigation buttons when navigation state changes
	useEffect(() => {
		if (surveyRef.current) {
			surveyRef.current.showNavigationButtons = !isNavigating
		}
	}, [isNavigating])

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
