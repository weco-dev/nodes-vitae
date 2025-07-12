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
	// Environmental Impact (10 questions)
	{
		questionId: 'env-001',
		name: 'water_usage',
		type: 'radiogroup',
		title: "How do you assess your vineyard's water usage efficiency?",
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
		score: 12,
	},
	{
		questionId: 'env-003',
		name: 'energy_sources',
		type: 'radiogroup',
		title: 'What percentage of your energy comes from renewable sources?',
		descriptions: [
			'Include solar, wind, and other renewable energy systems',
			'Consider both vineyard operations and winery facilities',
			'Account for grid purchases and on-site generation',
		],
		section: 'Environmental Impact',
		choices: ['76-100%', '51-75%', '26-50%', '0-25%'],
		isRequired: true,
		score: 15,
	},
	{
		questionId: 'env-004',
		name: 'pesticide_use',
		type: 'radiogroup',
		title: 'How would you classify your pesticide and herbicide use?',
		descriptions: [
			'Consider organic, biodynamic, or integrated pest management approaches',
			'Include frequency of application and types of chemicals used',
			'Evaluate alternatives and reduction strategies implemented',
		],
		section: 'Environmental Impact',
		choices: ['Organic/None', 'Minimal/IPM', 'Moderate', 'Conventional'],
		isRequired: true,
		score: 13,
	},
	{
		questionId: 'env-005',
		name: 'biodiversity_protection',
		type: 'checkbox',
		title: 'Which biodiversity conservation measures do you practice?',
		descriptions: [
			'Select all habitat preservation and enhancement activities',
			'Include wildlife corridors and native species protection',
			'Consider pollinator support and ecosystem services',
		],
		section: 'Environmental Impact',
		choices: [
			'Native plant restoration',
			'Wildlife habitat creation',
			'Pollinator gardens',
			'Water feature preservation',
			'Organic certification',
		],
		isRequired: false,
		score: 11,
	},
	{
		questionId: 'env-006',
		name: 'carbon_footprint',
		type: 'boolean',
		title: 'Do you measure and track your carbon footprint?',
		descriptions: [
			'Consider greenhouse gas emissions from all operations',
			'Include vineyard management, production, and transportation',
			'Evaluate carbon offset or reduction programs',
		],
		section: 'Environmental Impact',
		choices: ['Yes', 'No'],
		isRequired: true,
		score: 14,
	},
	{
		questionId: 'env-007',
		name: 'packaging_sustainability',
		type: 'radiogroup',
		title: 'How sustainable are your packaging materials?',
		descriptions: [
			'Consider bottle weight, cork alternatives, and label materials',
			'Include recycling programs and packaging waste reduction',
			'Evaluate lifecycle impact of packaging choices',
		],
		section: 'Environmental Impact',
		choices: ['Fully sustainable', 'Mostly sustainable', 'Some efforts', 'Traditional'],
		isRequired: true,
		score: 9,
	},
	{
		questionId: 'env-008',
		name: 'transportation_impact',
		type: 'rating',
		title: 'Rate your efforts to reduce transportation environmental impact',
		descriptions: [
			'Consider local distribution networks and shipping efficiency',
			'Include fuel-efficient vehicles and route optimization',
			'Evaluate packaging density and transportation partnerships',
		],
		section: 'Environmental Impact',
		rateMax: 10,
		isRequired: false,
		score: 8,
	},
	{
		questionId: 'env-009',
		name: 'climate_adaptation',
		type: 'checkbox',
		title: 'Which climate change adaptation strategies do you employ?',
		descriptions: [
			'Select all measures to adapt to changing climate conditions',
			'Include varietal selection and planting timing adjustments',
			'Consider infrastructure and operational modifications',
		],
		section: 'Environmental Impact',
		choices: [
			'Drought-resistant varietals',
			'Flexible harvest timing',
			'Temperature control systems',
			'Soil moisture retention',
			'Microclimate management',
		],
		isRequired: false,
		score: 10,
	},
	{
		questionId: 'env-010',
		name: 'environmental_certifications',
		type: 'checkbox',
		title: 'Which environmental certifications do you hold?',
		descriptions: [
			'Select all current certifications and standards',
			'Include organic, biodynamic, and sustainability programs',
			'Consider third-party verified environmental standards',
		],
		section: 'Environmental Impact',
		choices: [
			'Organic (USDA/EU)',
			'Biodynamic (Demeter)',
			'Sustainable Wine (SIP/LIVE)',
			'Carbon Neutral',
			'Local sustainability program',
		],
		isRequired: false,
		score: 16,
	},

	// Resource Management (5 questions)
	{
		questionId: 'res-001',
		name: 'water_conservation',
		type: 'rating',
		title: 'Rate your water conservation and efficiency measures',
		descriptions: [
			'Consider drip irrigation, soil moisture monitoring, and recycling systems',
			'Include rainwater harvesting and greywater reuse programs',
			'Evaluate water usage tracking and reduction targets',
		],
		section: 'Resource Management',
		rateMax: 10,
		isRequired: true,
		score: 14,
	},
	{
		questionId: 'res-002',
		name: 'energy_efficiency',
		type: 'radiogroup',
		title: 'How energy-efficient are your winery operations?',
		descriptions: [
			'Consider equipment efficiency and energy management systems',
			'Include lighting, cooling, and processing energy use',
			'Evaluate energy monitoring and reduction programs',
		],
		section: 'Resource Management',
		choices: ['Highly efficient', 'Moderately efficient', 'Some efficiency', 'Standard'],
		isRequired: true,
		score: 13,
	},
	{
		questionId: 'res-003',
		name: 'waste_reduction',
		type: 'checkbox',
		title: 'Which waste reduction strategies do you implement?',
		descriptions: [
			'Select all waste minimization and diversion practices',
			'Include pomace composting and byproduct utilization',
			'Consider packaging waste and circular economy approaches',
		],
		section: 'Resource Management',
		choices: [
			'Grape pomace composting',
			'Wastewater treatment',
			'Packaging reduction',
			'Recycling programs',
			'Byproduct sales',
		],
		isRequired: true,
		score: 12,
	},
	{
		questionId: 'res-004',
		name: 'supply_chain',
		type: 'radiogroup',
		title: 'How sustainable is your supply chain management?',
		descriptions: [
			'Consider supplier environmental and social standards',
			'Include local sourcing and transportation efficiency',
			'Evaluate supplier sustainability requirements and monitoring',
		],
		section: 'Resource Management',
		choices: ['Fully integrated', 'Well managed', 'Basic standards', 'Minimal oversight'],
		isRequired: false,
		score: 11,
	},
	{
		questionId: 'res-005',
		name: 'resource_monitoring',
		type: 'boolean',
		title: 'Do you use technology to monitor resource usage?',
		descriptions: [
			'Consider smart sensors, IoT devices, and monitoring systems',
			'Include water, energy, and material usage tracking',
			'Evaluate data collection and analysis capabilities',
		],
		section: 'Resource Management',
		isRequired: false,
		score: 10,
	},

	// Waste & Emissions (5 questions)
	{
		questionId: 'was-001',
		name: 'waste_management',
		type: 'radiogroup',
		title: 'How comprehensive is your waste management program?',
		descriptions: [
			'Consider solid waste, organic waste, and hazardous material handling',
			'Include waste reduction, reuse, and recycling initiatives',
			'Evaluate waste stream monitoring and diversion rates',
		],
		section: 'Waste & Emissions',
		choices: ['Comprehensive', 'Good coverage', 'Basic program', 'Minimal'],
		isRequired: true,
		score: 13,
	},
	{
		questionId: 'was-002',
		name: 'emissions_reduction',
		type: 'rating',
		title: 'Rate your greenhouse gas emissions reduction efforts',
		descriptions: [
			'Consider scope 1, 2, and 3 emissions across operations',
			'Include transportation, energy use, and production emissions',
			'Evaluate reduction targets and progress tracking',
		],
		section: 'Waste & Emissions',
		rateMax: 10,
		isRequired: true,
		score: 15,
	},
	{
		questionId: 'was-003',
		name: 'chemical_management',
		type: 'radiogroup',
		title: 'How do you manage agricultural chemicals and cleaners?',
		descriptions: [
			'Consider storage, application, and disposal practices',
			'Include worker safety and environmental protection measures',
			'Evaluate chemical reduction and alternative programs',
		],
		section: 'Waste & Emissions',
		choices: ['Excellent controls', 'Good practices', 'Standard compliance', 'Basic handling'],
		isRequired: true,
		score: 12,
	},
	{
		questionId: 'was-004',
		name: 'air_quality',
		type: 'boolean',
		title: 'Do you monitor and manage air quality impacts?',
		descriptions: [
			'Consider dust control, emissions monitoring, and air quality management',
			'Include equipment emissions and agricultural practices',
			'Evaluate community impact and mitigation measures',
		],
		section: 'Waste & Emissions',
		isRequired: false,
		score: 9,
	},
	{
		questionId: 'was-005',
		name: 'circular_economy',
		type: 'checkbox',
		title: 'Which circular economy practices do you implement?',
		descriptions: [
			'Select all practices that create closed-loop systems',
			'Include material reuse, sharing, and regenerative approaches',
			'Consider partnerships and collaborative initiatives',
		],
		section: 'Waste & Emissions',
		choices: [
			'Material sharing with other wineries',
			'Byproduct partnerships',
			'Equipment sharing cooperatives',
			'Community composting programs',
			'Regenerative agriculture practices',
		],
		isRequired: false,
		score: 11,
	},

	// Social Responsibility (5 questions)
	{
		questionId: 'soc-001',
		name: 'worker_conditions',
		type: 'rating',
		title: 'Rate your worker safety and welfare conditions',
		descriptions: [
			'Consider workplace safety measures and training programs',
			'Include fair wages, benefits, and working hours',
			'Evaluate housing conditions if provided to workers',
		],
		section: 'Social Responsibility',
		rateMax: 10,
		isRequired: true,
		score: 18,
	},
	{
		questionId: 'soc-002',
		name: 'fair_labor',
		type: 'radiogroup',
		title: 'How do you ensure fair labor practices?',
		descriptions: [
			'Consider wage equity, working conditions, and worker rights',
			'Include seasonal worker treatment and contractor oversight',
			'Evaluate compliance with labor standards and certifications',
		],
		section: 'Social Responsibility',
		choices: ['Exemplary', 'Above average', 'Meets standards', 'Basic compliance'],
		isRequired: true,
		score: 17,
	},
	{
		questionId: 'soc-003',
		name: 'diversity_inclusion',
		type: 'checkbox',
		title: 'Which diversity and inclusion practices do you implement?',
		descriptions: [
			'Select all efforts to promote workplace diversity and inclusion',
			'Include hiring practices, leadership development, and culture initiatives',
			'Consider representation across all levels of the organization',
		],
		section: 'Social Responsibility',
		choices: [
			'Diverse hiring practices',
			'Leadership development programs',
			'Cultural competency training',
			'Equal opportunity policies',
			'Mentorship programs',
		],
		isRequired: false,
		score: 15,
	},
	{
		questionId: 'soc-004',
		name: 'training_development',
		type: 'rating',
		title: 'Rate your employee training and development programs',
		descriptions: [
			'Consider safety training, skill development, and career advancement',
			'Include technical training and professional development opportunities',
			'Evaluate training frequency, quality, and accessibility',
		],
		section: 'Social Responsibility',
		rateMax: 10,
		isRequired: true,
		score: 14,
	},
	{
		questionId: 'soc-005',
		name: 'health_benefits',
		type: 'radiogroup',
		title: 'What level of health and wellness benefits do you provide?',
		descriptions: [
			'Consider health insurance, wellness programs, and mental health support',
			'Include both full-time and seasonal worker benefits',
			'Evaluate accessibility and comprehensiveness of programs',
		],
		section: 'Social Responsibility',
		choices: ['Comprehensive', 'Good coverage', 'Basic benefits', 'Minimal'],
		isRequired: true,
		score: 16,
	},

	// Employee Relations (2 questions)
	{
		questionId: 'emp-001',
		name: 'communication_feedback',
		type: 'radiogroup',
		title: 'How effective are your employee communication and feedback systems?',
		descriptions: [
			'Consider regular meetings, feedback mechanisms, and open communication',
			'Include grievance procedures and conflict resolution processes',
			'Evaluate employee satisfaction and engagement measurement',
		],
		section: 'Employee Relations',
		choices: ['Excellent', 'Good', 'Adequate', 'Needs improvement'],
		isRequired: true,
		score: 12,
	},
	{
		questionId: 'emp-002',
		name: 'work_life_balance',
		type: 'rating',
		title: 'Rate your support for employee work-life balance',
		descriptions: [
			'Consider flexible scheduling, time off policies, and family support',
			'Include seasonal work demands and overtime management',
			'Evaluate employee retention and satisfaction related to balance',
		],
		section: 'Employee Relations',
		rateMax: 10,
		isRequired: false,
		score: 11,
	},

	// Community Engagement (3 questions)
	{
		questionId: 'com-001',
		name: 'community_involvement',
		type: 'checkbox',
		title: 'Which community engagement activities do you participate in?',
		descriptions: [
			'Select all ways you actively engage with your local community',
			'Include economic, social, and environmental community benefits',
			'Consider partnerships with local organizations and initiatives',
		],
		section: 'Community Engagement',
		choices: [
			'Local hiring preferences',
			'Community event sponsorship',
			'Educational programs',
			'Environmental restoration projects',
			'Local supplier partnerships',
		],
		isRequired: false,
		score: 14,
	},
	{
		questionId: 'com-002',
		name: 'economic_impact',
		type: 'rating',
		title: 'Rate your positive economic impact on the local community',
		descriptions: [
			'Consider local employment, supplier relationships, and tourism',
			'Include tax contributions and infrastructure investments',
			'Evaluate multiplier effects and community economic development',
		],
		section: 'Community Engagement',
		rateMax: 10,
		isRequired: true,
		score: 13,
	},
	{
		questionId: 'com-003',
		name: 'stakeholder_engagement',
		type: 'radiogroup',
		title: 'How do you engage with community stakeholders?',
		descriptions: [
			'Consider regular communication with neighbors, officials, and groups',
			'Include feedback mechanisms and collaborative decision-making',
			'Evaluate transparency and responsiveness to community concerns',
		],
		section: 'Community Engagement',
		choices: ['Proactive engagement', 'Regular communication', 'Responsive to issues', 'Minimal contact'],
		isRequired: true,
		score: 12,
	}
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
					isRequired: false, // Change from q.isRequired to false for free navigation
					
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
		 * @description Disable built-in progress bar (using custom responsive component)
		 * 
		 * OPTIONS: 'top' | 'bottom' | 'both' | 'off'
		 * CHOICE: 'off' since we use custom responsive progress bar
		 */
		showProgressBar: 'off',
		
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
		
		/**
		 * @property checkErrorsMode
		 * @description Only validate on final submission for free navigation
		 * 
		 * OPTIONS: 'onNextPage' | 'onValueChanged' | 'onComplete'
		 * CHOICE: 'onComplete' to allow free navigation between questions
		 */
		checkErrorsMode: 'onComplete',
		
		/**
		 * @property showCompletedPage
		 * @description Disable built-in completion page (we handle it ourselves)
		 * 
		 * RATIONALE: Custom completion flow with assessment results
		 */
		showCompletedPage: false,
	}
}