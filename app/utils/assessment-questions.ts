/**
 * @fileoverview Assessment Questions Configuration - Central definition for ESG assessment questions
 * 
 * ==================================================================================
 * MODULE OVERVIEW
 * ==================================================================================
 * 
 * This module serves as the authoritative source for all ESG assessment questions
 * and their configuration. It defines the structure, content, and behavior of
 * assessment questions used throughout the application.
 * 
 * KEY RESPONSIBILITIES:
 * 1. Define question structure and validation rules
 * 2. Provide conversion utilities for SurveyJS integration
 * 3. Maintain assessment content versioning and consistency
 * 4. Support multiple question types with standardized interfaces
 * 5. Enable scoring and categorization systems
 * 
 * QUESTION CATEGORIES:
 * - Environmental Impact: Water usage, soil management, energy efficiency
 * - Social Responsibility: Worker conditions, community engagement, safety
 * - Governance: Transparency, reporting, improvement planning
 * 
 * ==================================================================================
 * QUESTION TYPE SYSTEM
 * ==================================================================================
 * 
 * SUPPORTED QUESTION TYPES:
 * - radiogroup: Single choice selection (Excellent/Good/Fair/Poor)
 * - checkbox: Multiple choice selection (practices, certifications)
 * - text: Open-ended text responses (plans, descriptions)
 * - rating: Numeric scale ratings (1-10 scales)
 * - boolean: Yes/No questions (compliance, reporting)
 * 
 * SCORING SYSTEM:
 * - Each question has weighted score (5-20 points)
 * - Environmental questions: Typically 10-15 points
 * - Social questions: Typically 15-20 points (higher impact)
 * - Governance questions: Typically 5-15 points
 * 
 * HELP CONTENT SYSTEM:
 * - Each question includes 1-3 description strings
 * - Descriptions provide context and examples
 * - Support accordion UI for progressive disclosure
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @see {@link app/components/assessment/survey-component.tsx} for UI integration
 * @see {@link app/routes/assessment+/take.tsx} for usage example
 */

/**
 * @interface QuestionConfig
 * @description Configuration structure for individual assessment questions
 * 
 * This interface defines the complete specification for an assessment question,
 * including content, behavior, scoring, and UI integration requirements.
 * 
 * @example
 * ```typescript
 * const sampleQuestion: QuestionConfig = {
 *   questionId: 'env-001',
 *   name: 'water_usage',
 *   type: 'radiogroup',
 *   title: 'How do you assess your vineyard\'s water usage?',
 *   descriptions: [
 *     'Consider irrigation systems and water recycling',
 *     'Include seasonal variations and drought planning'
 *   ],
 *   section: 'Environmental Impact',
 *   choices: ['Excellent', 'Good', 'Fair', 'Poor'],
 *   isRequired: true,
 *   score: 10
 * }
 * ```
 */
export interface QuestionConfig {
	/**
	 * @property questionId
	 * @type {string}
	 * @description Unique identifier for database persistence and analytics
	 * 
	 * FORMAT: category-###
	 * - env: Environmental questions
	 * - soc: Social responsibility questions  
	 * - gov: Governance questions
	 * 
	 * Used for:
	 * - Database foreign key relationships
	 * - Answer tracking and history
	 * - Analytics and reporting
	 * - Question versioning and migration
	 */
	questionId: string

	/**
	 * @property name
	 * @type {string}
	 * @description SurveyJS question name (used as form field name)
	 * 
	 * NAMING CONVENTIONS:
	 * - Use snake_case format
	 * - Descriptive and concise
	 * - Unique within assessment
	 * 
	 * Used for:
	 * - Form field identification
	 * - Survey data object keys
	 * - Client-server communication
	 */
	name: string

	/**
	 * @property type
	 * @type {'radiogroup' | 'checkbox' | 'text' | 'rating' | 'boolean'}
	 * @description SurveyJS question type determining UI and validation
	 * 
	 * TYPE BEHAVIORS:
	 * - radiogroup: Single selection from choices array
	 * - checkbox: Multiple selections from choices array
	 * - text: Free-form text input (short answers)
	 * - rating: Numeric scale from 1 to rateMax
	 * - boolean: Yes/No toggle selection
	 */
	type: 'radiogroup' | 'checkbox' | 'text' | 'rating' | 'boolean'

	/**
	 * @property title
	 * @type {string}
	 * @description Main question text displayed to users
	 * 
	 * CONTENT GUIDELINES:
	 * - Clear and specific language
	 * - Avoid technical jargon
	 * - Include context when necessary
	 * - Keep under 100 characters when possible
	 */
	title: string

	/**
	 * @property descriptions
	 * @type {string[]}
	 * @description Additional help content for question context
	 * 
	 * USAGE PATTERNS:
	 * - Maximum 3 descriptions (UI limitation)
	 * - Provide examples and clarifications
	 * - Include edge cases and considerations
	 * - Support progressive disclosure via accordion
	 * 
	 * @example
	 * ```typescript
	 * descriptions: [
	 *   'Consider all irrigation systems including drip and sprinkler',
	 *   'Include water recycling and rainwater collection practices',
	 *   'Evaluate drought contingency and seasonal planning'
	 * ]
	 * ```
	 */
	descriptions: string[]

	/**
	 * @property section
	 * @type {string}
	 * @description Category grouping for progress tracking and reporting
	 * 
	 * STANDARD SECTIONS:
	 * - "Environmental Impact"
	 * - "Social Responsibility" 
	 * - "Governance"
	 * 
	 * Used for:
	 * - Progress tracking UI
	 * - Section-based navigation
	 * - Report categorization
	 * - Analytics grouping
	 */
	section: string

	/**
	 * @property choices
	 * @type {string[]}
	 * @optional
	 * @description Answer options for radiogroup and checkbox questions
	 * 
	 * DESIGN PRINCIPLES:
	 * - Mutually exclusive for radiogroup
	 * - Comprehensive coverage of expected answers
	 * - Consistent ordering (best to worst for ratings)
	 * - Clear and unambiguous language
	 * 
	 * COMMON PATTERNS:
	 * - Quality scales: ['Excellent', 'Good', 'Fair', 'Poor']
	 * - Frequency: ['Always', 'Often', 'Sometimes', 'Never']
	 * - Practices: Specific implementation options
	 */
	choices?: string[]

	/**
	 * @property rateMax
	 * @type {number}
	 * @optional
	 * @description Maximum value for rating questions (1 is always minimum)
	 * 
	 * COMMON SCALES:
	 * - 5: Simple satisfaction scales
	 * - 10: Detailed evaluation scales (most common)
	 * - 100: Percentage-based assessments
	 * 
	 * UI BEHAVIOR:
	 * - Renders as interactive scale with labels
	 * - Includes hover states and accessibility
	 * - Shows numeric value to user
	 */
	rateMax?: number

	/**
	 * @property isRequired
	 * @type {boolean}
	 * @description Whether question must be answered to proceed
	 * 
	 * BUSINESS RULES:
	 * - Core assessment questions should be required
	 * - Optional questions for additional context
	 * - Affects form validation and submission
	 * - Impacts completion percentage calculations
	 */
	isRequired: boolean

	/**
	 * @property score
	 * @type {number}
	 * @description Point weight for scoring algorithms
	 * 
	 * SCORING STRATEGY:
	 * - Higher scores for critical ESG factors
	 * - Social questions weighted higher (15-20 points)
	 * - Environmental questions moderate weight (10-15 points)
	 * - Governance questions lower weight (5-15 points)
	 * 
	 * Used for:
	 * - Final assessment scoring
	 * - Industry benchmarking
	 * - Progress measurement
	 * - Report generation
	 */
	score: number
}

export const assessmentQuestions: QuestionConfig[] = [
	{
		questionId: 'env-001',
		name: 'water_usage',
		type: 'radiogroup',
		title: "How do you assess your vineyard's water usage?",
		descriptions: [
			'Consider irrigation systems, rainwater collection, and water recycling practices',
			'Include both direct vineyard irrigation and winery operations water usage',
			'Evaluate seasonal variations and drought contingency planning',
		],
		section: 'Environmental Impact',
		choices: ['Excellent', 'Good', 'Fair', 'Poor'],
		isRequired: true,
		score: 10,
	},
	{
		questionId: 'env-002',
		name: 'soil_management',
		type: 'checkbox',
		title: 'Which soil management practices do you implement?',
		descriptions: [
			'Select all sustainable soil practices currently in use',
			'Consider both vineyard and surrounding land management',
			'Include organic and regenerative agriculture methods',
		],
		section: 'Environmental Impact',
		choices: [
			'Cover crops',
			'Composting',
			'No-till farming',
			'Organic fertilizers',
			'Erosion control',
		],
		isRequired: true,
		score: 15,
	},
	{
		questionId: 'soc-001',
		name: 'worker_conditions',
		type: 'rating',
		title: 'Rate your worker safety and welfare conditions',
		descriptions: [
			'Consider workplace safety measures and training programs',
			'Include fair wages, benefits, and working hours',
			'Evaluate housing conditions if provided',
		],
		section: 'Social Responsibility',
		rateMax: 10,
		isRequired: true,
		score: 20,
	},
	{
		questionId: 'gov-001',
		name: 'transparency_reporting',
		type: 'boolean',
		title: 'Do you publish annual sustainability reports?',
		descriptions: [
			'Consider public disclosure of environmental metrics',
			'Include social impact and governance practices',
			'Evaluate third-party certifications and audits',
		],
		section: 'Governance',
		isRequired: true,
		score: 10,
	},
	{
		questionId: 'gov-002',
		name: 'improvement_plans',
		type: 'text',
		title: 'Describe your ESG improvement plans for next year',
		descriptions: [
			'Outline specific, measurable goals',
			'Include timeline and resource allocation',
			'Consider stakeholder engagement strategies',
		],
		section: 'Governance',
		isRequired: false,
		score: 5,
	},
]

/**
 * @function convertToSurveyJsFormat
 * @description Converts QuestionConfig array to SurveyJS-compatible configuration
 * 
 * This function transforms our internal question configuration format into the
 * JSON structure required by SurveyJS library, while preserving custom metadata
 * for our application-specific features.
 * 
 * TRANSFORMATION PROCESS:
 * 1. Maps each question to a SurveyJS page (one question per page)
 * 2. Preserves all SurveyJS-standard properties (type, name, title, etc.)
 * 3. Adds custom properties for integration (questionId, section, descriptions, score)
 * 4. Configures survey-level settings for consistent UX
 * 
 * SURVEY CONFIGURATION:
 * - One question per page for better mobile experience
 * - Top progress bar for completion tracking
 * - Manual navigation (no auto-advance)
 * - Navigation buttons enabled
 * - Question numbers hidden for cleaner UI
 * 
 * CUSTOM PROPERTIES PRESERVED:
 * - questionId: For database persistence and analytics
 * - section: For progress tracking and categorization
 * - descriptions: For accordion help content injection
 * - score: For assessment scoring algorithms
 * 
 * @param {QuestionConfig[]} questions - Array of question configurations
 * @returns {object} SurveyJS-compatible survey configuration
 * 
 * @example
 * ```typescript
 * const questions: QuestionConfig[] = [
 *   {
 *     questionId: 'env-001',
 *     name: 'water_usage',
 *     type: 'radiogroup',
 *     title: 'How do you assess water usage?',
 *     choices: ['Excellent', 'Good', 'Fair', 'Poor'],
 *     section: 'Environmental',
 *     descriptions: ['Consider irrigation systems'],
 *     isRequired: true,
 *     score: 10
 *   }
 * ]
 * 
 * const surveyConfig = convertToSurveyJsFormat(questions)
 * // Returns SurveyJS configuration with pages array
 * ```
 * 
 * @see {@link https://surveyjs.io/form-library/documentation/design-survey} SurveyJS Documentation
 * @see {@link app/components/assessment/survey-component.tsx} for consumption
 */
export function convertToSurveyJsFormat(questions: QuestionConfig[]) {
	return {
		/**
		 * @property pages
		 * @description Array of survey pages, each containing one question
		 * 
		 * DESIGN RATIONALE:
		 * - One question per page improves mobile experience
		 * - Enables granular progress tracking
		 * - Supports better error handling and validation
		 * - Allows for page-specific analytics
		 */
		pages: questions.map((q) => ({
			elements: [
				{
					// Standard SurveyJS properties
					type: q.type,
					name: q.name,
					title: q.title,
					isRequired: q.isRequired,
					
					// Conditional properties based on question type
					...(q.choices && { choices: q.choices }),
					...(q.rateMax && { rateMax: q.rateMax }),
					
					// Custom properties for our application integration
					// These are preserved by SurveyJS and accessible in event handlers
					questionId: q.questionId,
					section: q.section,
					descriptions: q.descriptions,
					score: q.score,
				},
			],
		})),
		
		/**
		 * @property showProgressBar
		 * @description Display progress indicator at top of survey
		 * 
		 * OPTIONS: 'top' | 'bottom' | 'both' | 'off'
		 * CHOICE: 'top' for consistent header placement
		 */
		showProgressBar: 'top',
		
		/**
		 * @property goNextPageAutomatic
		 * @description Disable automatic page advancement
		 * 
		 * RATIONALE: Manual control allows users to review answers
		 * and provides better accessibility for screen readers
		 */
		goNextPageAutomatic: false,
		
		/**
		 * @property showNavigationButtons
		 * @description Enable Previous/Next navigation buttons
		 * 
		 * PROVIDES: Standard navigation UX with clear action buttons
		 */
		showNavigationButtons: true,
		
		/**
		 * @property showQuestionNumbers
		 * @description Hide question numbering for cleaner UI
		 * 
		 * OPTIONS: 'on' | 'onPage' | 'off'
		 * CHOICE: 'off' since progress bar provides position context
		 */
		showQuestionNumbers: 'off',
	}
}