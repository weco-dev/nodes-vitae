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
 * - SEZIONE 0: Company identification and basic information
 * - SEZIONE I: Commitment to human rights and responsible management
 * - SEZIONE II: Risk assessment and supply chain mapping
 * - SEZIONE III: Implementation of preventive and mitigation measures
 * - SEZIONE IV: Monitoring and effectiveness evaluation
 * - SEZIONE V: Communication and transparency
 * - SEZIONE VI: Remediation and complaint mechanisms
 *
 * ==================================================================================
 * QUESTION TYPE SYSTEM
 * ==================================================================================
 *
 * SUPPORTED QUESTION TYPES:
 * - radiogroup: Single choice selection with standardized options
 * - text: Open-ended text responses for company-specific information
 *
 * SCORING SYSTEM:
 * - Each question has weighted score (typically 1 point)
 * - Questions are organized by implementation phases
 * - Assessment focuses on due diligence process completeness
 *
 * HELP CONTENT SYSTEM:
 * - Each question includes 0-3 description strings
 * - Descriptions provide context and examples
 * - Support accordion UI for progressive disclosure
 *
 * DATA IMPORT:
 * - Questions are imported from Excel files using scripts/import-questions.ts
 * - Italian boolean values ("VERO"/"FALSO") are converted to JavaScript booleans
 * - Descriptions are split on "-----" delimiter from Excel cells
 * - Default radiogroup choices are applied when not specified
 *
 * @version 3.0.0
 * @author ESG Assessment Team
 * @since 2025-07-18
 * @updated 2025-07-28 - Added umbrella question support with parent-child relationships
 * @see {@link app/components/assessment/survey-component.tsx} for UI integration
 * @see {@link app/routes/assessment+/take.tsx} for usage example
 * @see {@link scripts/import-questions.ts} for data import process
 */

/**
 * @interface QuestionConfig
 * @description Configuration structure for individual assessment questions
 *
 * This interface defines the complete specification for an assessment question,
 * including content, behavior, scoring, and UI integration requirements.
 *
 * ==================================================================================
 * RECENT ENHANCEMENTS (v3.0 - July 2025)
 * ==================================================================================
 *
 * ### Umbrella Question Support:
 * - **New Question Type**: Added `'group'` type for umbrella questions
 * - **Hierarchy System**: Questions can reference parents via `parentQuestionId`
 * - **Navigation Structure**: Umbrella questions provide organizational hierarchy
 * - **Progress Filtering**: Group questions excluded from completion calculations
 *
 * ### Restructured Help System:
 * - **Replaced**: Generic `descriptions: string[]` field
 * - **With**: Three semantic fields for better content organization:
 *   - `help?: string` - Contextual guidance for question understanding
 *   - `reporting?: string` - Compliance and regulatory requirements
 *   - `docs?: string` - Additional documentation and resources
 *
 * ### Markdown Support:
 * - **Title Field**: Now supports markdown formatting in question titles
 * - **Help Fields**: All text fields support markdown with proper escaping
 * - **Safe Processing**: XSS-safe markdown rendering in UI components
 *
 * ### Data Migration:
 * - **88+ Questions Migrated**: All existing questions converted to new structure
 * - **Backward Compatibility**: Maintained through proper interface versioning
 * - **Excel Integration**: Import scripts updated for new column structure
 *
 * @example
 * ```typescript
 * // Regular answerable question
 * const regularQuestion: QuestionConfig = {
 *   questionId: 'env-001',
 *   name: 'water_usage',
 *   type: 'radiogroup',
 *   title: 'How do you assess your vineyard\'s *water usage*?',
 *   help: 'Consider irrigation systems and water recycling',
 *   reporting: 'Report monthly usage to environmental agency',
 *   docs: 'See water management guidelines document',
 *   section: 'Environmental Impact',
 *   choices: ['Excellent', 'Good', 'Fair', 'Poor'],
 *   isRequired: true,
 *   score: 10,
 *   parentQuestionId: 'env-umbrella-001' // Optional: if this is a sub-question
 * }
 *
 * // Umbrella question for grouping
 * const umbrellaQuestion: QuestionConfig = {
 *   questionId: 'env-umbrella-001',
 *   name: 'environmental_overview',
 *   type: 'group',
 *   title: 'Environmental Impact Assessment Overview',
 *   help: 'This section covers environmental considerations',
 *   section: 'Environmental Impact',
 *   isRequired: false,
 *   score: 0
 *   // Note: No choices array for group type, no parentQuestionId
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
	 * @type {'radiogroup' | 'checkbox' | 'text' | 'rating' | 'boolean' | 'group'}
	 * @description SurveyJS question type determining UI and validation
	 *
	 * TYPE BEHAVIORS:
	 * - radiogroup: Single selection from choices array
	 * - checkbox: Multiple selections from choices array
	 * - text: Free-form text input (short answers)
	 * - rating: Numeric scale from 1 to rateMax
	 * - boolean: Yes/No toggle selection
	 * - group: Umbrella question for navigation only (no input)
	 */
	type: 'radiogroup' | 'checkbox' | 'text' | 'rating' | 'boolean' | 'group'

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
	 * @property help
	 * @type {string}
	 * @optional
	 * @description Contextual help content for question understanding
	 *
	 * PURPOSE:
	 * - Provides user guidance for complex questions
	 * - Explains terminology and context
	 * - Offers examples and clarifications
	 *
	 * CONTENT GUIDELINES:
	 * - Clear, concise explanations
	 * - Include examples where helpful
	 * - Avoid technical jargon
	 * - Support markdown formatting
	 */
	help?: string

	/**
	 * @property reporting
	 * @type {string}
	 * @optional
	 * @description Reporting requirements and compliance information
	 *
	 * PURPOSE:
	 * - Details regulatory reporting obligations
	 * - Explains compliance requirements
	 * - Links to relevant standards or frameworks
	 *
	 * CONTENT GUIDELINES:
	 * - Reference specific regulations or standards
	 * - Provide compliance context
	 * - Include relevant deadlines or requirements
	 * - Support markdown formatting for links
	 */
	reporting?: string

	/**
	 * @property docs
	 * @type {string}
	 * @optional
	 * @description Additional documentation and resources
	 *
	 * PURPOSE:
	 * - Links to external documentation
	 * - References to best practices
	 * - Additional reading materials
	 *
	 * CONTENT GUIDELINES:
	 * - Provide relevant external links
	 * - Reference industry best practices
	 * - Include technical documentation links
	 * - Support markdown formatting for proper link handling
	 */
	docs?: string

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

	/**
	 * @property parentQuestionId
	 * @type {string}
	 * @optional
	 * @description Reference to umbrella question for grouped sub-questions
	 *
	 * GROUPING BEHAVIOR:
	 * - Links sub-questions to their parent umbrella question
	 * - Used for navigation hierarchy and UI organization
	 * - Only required for sub-questions (questions with parents)
	 * - Umbrella questions (type: 'group') should not have this field
	 *
	 * Used for:
	 * - Question hierarchy navigation
	 * - Umbrella title display on sub-questions
	 * - Progress calculation filtering
	 * - Question group organization
	 */
	parentQuestionId?: string
}

export const assessmentQuestions: QuestionConfig[] = [
	{
		questionId: 'S0.1',
		name: 'question_S0.1',
		type: 'text' as const,
		title: "Ragione sociale e partita iva dell'azienda",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.2',
		name: 'question_S0.2',
		type: 'text' as const,
		title: "Indicare la forma giuridica dell'impresa",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.3',
		name: 'question_S0.3',
		type: 'text' as const,
		title: 'Indicare i comuni dove si svolgono le attività agricole',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.4',
		name: 'question_S0.4',
		type: 'text' as const,
		title: 'Indicare il numero di lavoratori dipendenti',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.5',
		name: 'question_S0.5',
		type: 'text' as const,
		title: "L'impresa ricorre a società esterne per l'appalto della manodopera",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.6',
		name: 'question_S0.6',
		type: 'text' as const,
		title: 'Superficie agricola coltivata',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S0.7',
		name: 'question_S0.7',
		type: 'text' as const,
		title: "Indicare le fasi della filiera svolte direttamente dall'impresa",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE 0',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.1',
		name: 'question_S1.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha formalizzato all'interno di un documento scritto e reso disponibile a tutte le parti interessate, il proprio impegno a rispettare i diritti umani in coerenza con gli standard internazionali (Principi Guida Onu / Linee Guida OCSE)?\n\nTEST TITLE MESSAGE\n\nQuesto è un contenuto di test per verificare varie funzionalità Markdown. \n\nAndare a capo, _italic_, *grassetto*, [link](https://we.co.it/) e una lista: \n- one\n- two\n- three",
		help: "Il primo passo è impegnarsi pubblicamente a rispettare i diritti umani. Per fare questo occorre:\n- Sensibilizzare la direzione e il personale\n- Sviluppare e sottoscrivere un impegno al rispetto dei diritti umani\n- Assegnare le responsabilità ai membri rilevanti dell'alta dirigenza e del personale\n- Sensibilizzare il personale, i soci e i lavoratori agricoli",
		reporting:
			'TEST REPORTING MESSAGE\n\nQuesto è un contenuto di test per verificare varie funzionalità Markdown. \n\nAndare a capo, _italic_, *grassetto*, [link](https://we.co.it/) e una lista: \n- one\n- two\n- three',
		docs: 'TEST DOCS MESSAGE\n\nQuesto è contenuto di test per verificare varie funzionalità Markdown. \n\nAndare a capo, _italic_, *grassetto*, [link](https://we.co.it/) e una lista: \n- one\n- two\n- three',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.2',
		name: 'question_S1.2',
		type: 'radiogroup' as const,
		title:
			'L\'impresa ha formalizzato all\'interno di un corpus documentale dedicato (insieme di "politiche" e "procedure") il proprio impegno, gli obiettivi strategici, le attività operative che intende espletare (piano di attuazione) in materia di diritti umani e gestione responsabile della manodopera sia in riferimento all\'azienda stessa che e nelle relazioni con i propri fornitori e i portatori di interesse?',
		help: "Una politica è un testo in cui un'organizzazione si pone\nun obiettivo e concorda principi generali e procedure per raggiungerlo. Le politiche sono utili,\nperché chiariscono gli obiettivi e guidano le decisioni e le attività successive, più\ndettagliate. Le politiche devono delineare le procedure, che forniscono\nistruzioni passo-passo per specifiche attività di routine.\nPossono anche includere una lista di controllo o le fasi del processo da seguire.",
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.3',
		name: 'question_S1.3',
		type: 'radiogroup' as const,
		title:
			'Il corpus documentale, [così come definito al punto precedente], contiente la trattazione di almeno le seguenti tematiche in materia di diritti umani e gestione responsabile della manodopera:',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.3.1',
		name: 'question_S1.3.1',
		type: 'radiogroup' as const,
		title:
			"Il corpus documentale, [così come definito al punto precedente], contiente la trattazione di almeno le seguenti tematiche in materia di diritti umani e gestione responsabile della manodopera:\n\nNel corpus documentale l'impresa ha incluso una politica e previsto delle procedure per prevenire il lavoro forzato e per assicurarsi che lavoratrici e lavoratori siano reclutati e  assunti in modo etico?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.3.2',
		name: 'question_S1.3.2',
		type: 'radiogroup' as const,
		title:
			"Nel corpus documentale l'impresa ha incluso una politica e previsto delle procedure per assicurarsi che non si faccia ricorso al lavoro minorile?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.3.3',
		name: 'question_S1.3.3',
		type: 'radiogroup' as const,
		title:
			"Nel corpus documentale l'impresa ha incluso una politica e previsto delle procedure per prevenire ogni forma di disuguaglianza e discriminazione?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.3.4',
		name: 'question_S1.3.4',
		type: 'radiogroup' as const,
		title:
			"Nel corpus documentale l'impresa ha incluso una politica e previsto delle procedure che sanciscano l’impegno a tutelare la salute e la sicurezza di lavoratori, visitatori, collaboratori e appaltatori?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.4.1',
		name: 'question_S1.4.1',
		type: 'radiogroup' as const,
		title:
			"Il corpus documentale, [così come definito al punto precedente], è stato approvato da parte del responsabile legale dell'azienda o dai soci o da soggetto terzo a cui è stata delegata dal consiglio di amministrazione la gestione dell'azienda ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.4.2',
		name: 'question_S1.4.2',
		type: 'radiogroup' as const,
		title:
			"All'interno dell'azienda è stato individuato e nominato un soggetto a cui assegnare la responsabilità nel garantire che l'impegno e gli obiettivi contenuti all'interno del corpus documentale (di politiche e procedure) vengano rispettati?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.4.3',
		name: 'question_S1.4.3',
		type: 'radiogroup' as const,
		title:
			'Il corpus documentale [così come definito al punto precedente], è stato redatto:\na) grazie al supporto di esperti in materia di diritti umani e gestione responsabile della manodopera\nb) consultando tutti gli attori con cui l\'azienda ha delle interazioni e su cui esercita influenza e interesse (altresì definiti "portatori di interesse" o "stakeholder" ) ? \nc) oppure consultando organizzazioni che rappresentano gli interessi della società civile e dei lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.4.4',
		name: 'question_S1.4.4',
		type: 'radiogroup' as const,
		title:
			"Per il corpus documentale [così come definito al punto precedente], l'azienda ha previsto la presenza di meccanismi di revisione periodica ed aggiornamento del contenuto al fine di garantire che lo stesso rifletta le varazioni relative a: \na) i rischi a cui la filiera vitivinicola è soggetta\nb) normativa nazionale o internazionale\nc) standard internazionali ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.5.1',
		name: 'question_S1.5.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha deciso di aderire ad un sistema di certificazione o ad uno standard di settore, o partecipa a iniziative multiattore nella filiera, in materia di diritti umani e gestione responsabile della manodopera (o della forza lavoro) ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.5.2',
		name: 'question_S1.5.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa è già in possesso di una certificazione che includa dei requisiti sul rispetto dei diritti umani come ad esempio: \n\nSA8000 \nISO 26000 \nFair Trade / Commercio equo e solidale\nGlobal GAP GRASP \nSedex/SMETA \nEqualitas",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.6.1',
		name: 'question_S1.6.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha comunicato e integrato la sua policy in materia di diritti umani e condotta responsabile nei contratti con i partner commerciali?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.6.2',
		name: 'question_S1.6.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha definito e comunicato chiaramente a fornitori e altri partner commerciali le proprie aspettative in materia di diritti umani e condotta responsabile (o gestione responsabile della manodopera e forza lavoro)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.6.3',
		name: 'question_S1.6.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha definito un processo di selezione dei fornitori che tenga conto delle pratiche di condotta in materia di diritti umani e gestione responsabile della manodopera?',
		help: 'Rapporti a lungo termine, capacity‑building',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.6.4',
		name: 'question_S1.6.4',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha definito e formalizzato all'interno di uno specifico documento (o diversamente inserito all'interno della propria routine lavorativa) un processo o un'insieme di attività che le consenta di ricevere su base periodica, da parte dei propri partner commerciali, le informazioni ritenute rilevanti in materia di diritti umani e gestione responsabile della manodopera ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S1.6.5',
		name: 'question_S1.6.5',
		type: 'radiogroup' as const,
		title:
			"L'impresa è impegnata a verificare su base periodica che i propri fornitori rispettatino gli impegni, gli obiettivi ed i processi definiti dall'impresa stessa in materia di diritti umani e gestione responsabile della manodopera ?",
		help: 'Tracciabilità documenti, decisioni, pagamenti',
		reporting: '',
		docs: '',
		section: 'SEZIONE I | Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.1',
		name: 'question_S2.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha mappato all'interno di uno specifico documento la propria catena di fornitura (ovvero l'insieme coordinato di tutti gli attori che cotribuiscono alla produzione, commercializzazione e vendita dei prodotti - dal fornitore iniziale fino al clienti)?",
		help: 'Rif. UNGPs',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.1.2',
		name: 'question_S2.1.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha effettuato e formalizzato un’analisi mirata ad identificare e mappare tutte le proprie attività e processi aziendali (dalla raccolta fino alla commercializzazione), con specifico riferimento a quali di questi prevedono una relazione con soggetti terzi, siano essi clienti, fornitori , istituzioni, associazioni di categoria o partner commerciali (distributori) ?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.1.3',
		name: 'question_S2.1.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha mappato le proprie sedi operative e quelle di tutti gli attori pubblici e privati con cui collabora e che sono in qualche misura coinvolti nella catena di fornitura, identificandone i dati rilevanti?',
		help: 'Esempi di registri dati produttori, lavoratori, pratiche di gestione rischio',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.1',
		name: 'question_S2.2.1',
		type: 'radiogroup' as const,
		title:
			"L'azienda ha  effetuato una mappatura dei rischi avviando un processo di raccolta informazioni per comprendere i potenziali impatti negativi sui diritti umani derivanti dalle attività dei propri fornitori e degli altri attori con cui collabora a valle della filiera?",
		help: "Effettuare una valutazione del rischio che preveda 3 step:\n1. Mappare i rischi e i problemi legati ai diritti umani e all'ambiente nel vostro Paese e nel vostro settore di produzione.\n2. Identificare e valutare almeno tre sfide più importanti per le vostre operazioni.\n3. Identificare i gruppi di persone più vulnerabili",
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.Group',
		name: 'question_S2.2.Group',
		type: 'group' as const,
		title:
			"Questa è una domanda di gruppo che contiene delle sottodomande. E' creata all'interno del file excel e sarà importata. Sperem ben :)",
		help: "Effettuare una valutazione del rischio che preveda 3 step:\n1. Mappare i rischi e i problemi legati ai diritti umani e all'ambiente nel vostro Paese e nel vostro settore di produzione.\n2. Identificare e valutare almeno tre sfide più importanti per le vostre operazioni.\n3. Identificare i gruppi di persone più vulnerabili",
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.2',
		name: 'question_S2.2.2',
		type: 'radiogroup' as const,
		title:
			"Nell'identificare i rischi di impatti negativi sui diritti umani ha tenuto conto di fattori rilevanti quali: area geografica, settore di appartenenza e per ogni partner commerciale fattori di rischio specifici?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'S2.2.Group',
	},
	{
		questionId: 'S2.2.3',
		name: 'question_S2.2.3',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha previsto nel processo di valutazione del rischio, l’identificazione dei titolari dei diritti e delle parti interessate e il loro coinvolgimento, con particolare riferimento alle categorie vulnerabili per il settore vitivinicolo (donne, migranti, stagionali, minori) nonché relative associazioni di riferimento attive sul territorio?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'S2.2.Group',
	},
	{
		questionId: 'S2.2.4.1',
		name: 'question_S2.2.4.1',
		type: 'radiogroup' as const,
		title:
			"All'interno della procedura di valutazione del rischio, l'impresa ha incluso la presenza di “red flags”, ovvero di \"segnali d'allarme\" al fine di attenzionare alcuni specifici processi o situazioni aziendali che possono nascondere la presenza di un potenziale problema o rischio?",
		help: 'N.b. l’identificazione delle “red flags” può derivare da diversi tipi di valutazione del\nrischio. Ad esempio:\n- red flags geografiche: aree di conflitto o di governi instabili; aree in cui ci\nsono forme di sfruttamento riportate; aree in cui sono contestati i diritti\nproprietari sulla terra; aree in cui vi è carenza di cibo o acqua\n- red flags prodotti: produzioni agricole notoriamente connesse a impatti\nnegativi sui diritti umani\n- red flags partner commerciali: storico di inosservanza pratiche di condotta d’impresa responsabile (ad esempio segnalazioni di pratiche commerciali sleali in agricoltura ai sensi della Direttiva 633/2019 recepite in Italia nel D.L. 198/2021 o politiche dei prezzi insufficienti a coprire i costi di produzione); pratiche di fornitura da aree a rischio negli ultimi 12 mesi; partecipazioni o quote in imprese che non rispettano gli standard di condotta d’impresa responsabile.',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'S2.2.Group',
	},
	{
		questionId: 'S2.2.4.2',
		name: 'question_S2.2.4.2',
		type: 'radiogroup' as const,
		title:
			'Per ognuna delle "red flags" è stata prevista, da parte dell\'azienda, un\'analisi approfondita e sistematica  (che preveda ad esempio verifiche sul campo)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.5',
		name: 'question_S2.2.5',
		type: 'radiogroup' as const,
		title:
			"L'azienda ha previsto (e formalizzato all'interno di apposito documento) che la valutazione del rischio venga aggiornata e ripetuta periodicamente e, in ogni caso, ogni qualvolta l’impresa sviluppi nuove linee di prodotto o cambi metodi di immissione del prodotto sul mercato o intrattenga nuove relazioni commerciali?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.6',
		name: 'question_S2.2.6',
		type: 'radiogroup' as const,
		title:
			"L'azienda ha previsto (e formalizzato all'interno di apposito documento) che l'attività di valutazione del rischio includa una scala di prioritizzazione dei rischi di impatti negativi riscontrati sulla base della gravità e della probabilità?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.7',
		name: 'question_S2.2.7',
		type: 'radiogroup' as const,
		title:
			"L'azienda ha previsto (e formalizzato all'interno di apposito documento) che la valutazione del rischio venga effettuata attraverso un sistema di raccolta informazioni sul campo in grado di generare, raccogliere e aggiornare dati sulle circostanze della produzione agricola?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.8',
		name: 'question_S2.2.8',
		type: 'radiogroup' as const,
		title:
			"Nel processo di valutazione dei rischi l'impresa ha previsto di distinguere se il problema è causato direttamente dalle proprie attività, se contribuisce al problema insieme ad altri, oppure se il problema è legato a un suo fornitore o a qualcuno con cui collabora? Così da differenziare i modelli d'intervento e di risposta in base al livello di coinvolgimento (diretto o indiretto).",
		help: 'Box: i diversi livelli di coinvolgimento dell’impresa  includono la causa, il contributo o il collegamento diretto.\n Se l’impresa causa la violazione, dovrà cessare e rimediare l’impatto negativo causato.\n Se l’impresa contribuisce alla violazione dovrà cessare e rimediare l’impatto negativo e/o utilizzare il proprio leverage nei confronti del soggetto terzo che ha co-causato l’impatto negativo.\n Se l’impresa non ha né causato né contribuito all’impatto negativo, ma vi è direttamente collegata in virtù dei propri prodotti, servizi o operazioni, dovrà utilizzare il leverage nei confronti del soggetto che causa la violazione al fine della cessazione del comportamento lesivo; in mancanza, incrementare detto leverage e, in ultima istanza, interrompere la relazione commerciale.',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S2.2.9',
		name: 'question_S2.2.9',
		type: 'radiogroup' as const,
		title:
			"L'azienda ha previsto (e formalizzato all'interno di apposito documento) che venga effettuata una raccolta di informazioni sui rischi derivanti dalle attività dei partner secondo una delle 3 modalità:\nDiretta (attraverso delle ispezioni o visite in loco) \nIndiretta (attraverso la verifica sulla presenza di schemi di certificazione, due diligence dei partner commerciali)\nIndiretta attraverso la collaborazione con attori intermedi (ad esempio chiedendo ad un fornitore la documentazione sull'attività svolta a sua volta verso i propri fornitori)?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE II | Valutare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.1',
		name: 'question_S3.1',
		type: 'radiogroup' as const,
		title:
			'L\'impresa ha previsto un modo chiaro e veloce per comunicare i risultati dei controlli sui rischi alle persone designate come responsabili in azienda, così che possano subito fermare i problemi, prevenirli o ridurli?"',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.2',
		name: 'question_S3.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha individuato tra i propri vertici (responsabile legale, amministratore unico, amministratore delegato, manager d'azienda, socio amministratore etc.) il personale o le funzioni responsabili di cessare, mitigare e previre gli impatti negativi sui diritti umani ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.3',
		name: 'question_S3.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato un piano di prevenzione e mitigazione dei rischi futuri e potenziali basato sul livello di coinvolgimento identificato (causa – contributo – collegamento diretto)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.4.1',
		name: 'question_S3.4.1',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha previsto la presenza di un sistema di registrazione (un registro) dei lavoratori impiegati, inclusi i lavoratori stagionali, occasionali e in subappalto, che preveda almeno: \n- nome \n- genere \n- età \n- nazionalità \n- inizio e fine rapporto\n- tipo di rapporto di lavoro\n- compenso (giornaliero/mensile)\n- giornate lavorate?\n\nL'impresa si è inoltre presa cura di verificare che le informazioni anagrafiche registrate corrispondano a quanto riportati sui documenti presentati in originale ed inoltre che vi sia corrispondenza tra il lavoratore e il documento presentato ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.4.2',
		name: 'question_S3.4.2',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha previsto un sistema di verifiche preliminari e selezione dei soggetti terzi coinvolti nel reclutamento/fornitura di manodopera (cooperative)? \nAd esempio verificandone le condizioni di operatività (autorizzazione allo svolgimento dell’attività, procedimenti pendenti, politiche dell’impresa ecc.) e tendone traccia all'interno di apposito registro ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.4.3',
		name: 'question_S3.4.3',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha previsto (e formalizzato all'interno di apposito documento) un sistema di reclutamento, attribuzione degli incarichi e delle mansioni, formazione e avanzamento dei lavoratori basato sulle pari opportunità e che tenga in considerazione qualifiche, abilità ed esperienze del singolo?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.4.4',
		name: 'question_S3.4.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa è dotata di un registro che tenga traccia e dimostri le ragioni di reclutamento, licenziamento e promozione dei lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.4.5',
		name: 'question_S3.4.5',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha previsto (e formalizzato all'interno di apposito documento) un sistema di vigilanza e segnalazione sulle questioni di genere con appropriato sistema di protezione per le segnalazioni in materia di discriminazioni di genere?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.5.2',
		name: 'question_S3.5.2',
		type: 'radiogroup' as const,
		title:
			'In caso di impiego di minori (età 16-18) l’impresa si è assicura di non destinare a tali lavoratori mansioni che, per la natura o per le circostanze, siano in grado di mettere in pericolo la salute, la sicurezza e lo sviluppo fisico e mentale del minore e la frequenza scolastica dello stesso?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.1',
		name: 'question_S3.6.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa evita di trattenere parte del compenso dei lavoratori, o beni e documenti di questi ultimi, al fine di forzare la permanenza dello stesso nel rapporto lavorativo e garantisce la possibilità di risolvere il contratto di lavoro, non imponendo termini irragionevoli di preavviso ?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.2',
		name: 'question_S3.6.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa previene ed evita condotte riconducibili agli indicatori di sfruttamento lavorativo previsti dall’articolo 603 bis del codice penale?',
		help: "Box: riporterei per intero l’articolo del codice. Ve lo incollo qua e valutiamo se inserire punto per p unto gli indici previsti dall’articolo come domande specifiche:\nArt. 603-bis (Intermediazione illecita e sfruttamento del lavoro). Salvo che il fatto costituisca piu' grave  reato,  chiunque  svolga un'attivita' organizzata di intermediazione, reclutando manodopera  o organizzandone l'attivita' lavorativa caratterizzata da sfruttamento, mediante violenza, minaccia,  o  intimidazione,  approfittando  dello stato di bisogno o di necessita' dei lavoratori,  e'  punito  con  la reclusione da cinque a otto anni e con la multa da 1.000 a 2.000 euro per ciascun lavoratore reclutato.\n Ai fini del primo comma,  costituisce  indice  di  sfruttamento  la sussistenza di una o piu' delle seguenti circostanze: \n    1) la sistematica retribuzione dei lavoratori in modo palesemente difforme dai contratti collettivi nazionali o comunque sproporzionato rispetto alla quantita' e qualita' del lavoro prestato; \n    2) la sistematica violazione della normativa relativa  all'orario di lavoro, al riposo settimanale, all'aspettativa obbligatoria,  alle ferie; \n    3) la sussistenza di violazioni della  normativa  in  materia  di sicurezza  e  igiene  nei  luoghi  di  lavoro,  tale  da  esporre  il lavoratore a pericolo per la salute,  la  sicurezza  o  l'incolumita' personale; \n    4) la sottoposizione  del  lavoratore  a  condizioni  di  lavoro, metodi di sorveglianza, o a situazioni  alloggiative  particolarmente degradanti. \n  Costituiscono aggravante specifica  e  comportano  l'aumento  della pena da un terzo alla meta': \n    1) il fatto che il numero di lavoratori reclutati sia superiore a tre; \n    2) il fatto che uno o piu' dei soggetti reclutati siano minori in eta' non lavorativa; \n    3) l'aver commesso il fatto esponendo i lavoratori intermediati a situazioni di grave pericolo,  avuto  riguardo  alle  caratteristiche delle prestazioni da svolgere e delle condizioni di lavoro. \n  Art. 603-ter (Pene accessorie). - La condanna per i delitti di  cui agli articoli 600, limitatamente ai casi in cui lo sfruttamento ha ad oggetto prestazioni lavorative,  e  603-bis,  importa  l'interdizione dagli uffici direttivi delle  persone  giuridiche  o  delle  imprese, nonche' il divieto di concludere contratti  di  appalto,  di  cottimo fiduciario, di fornitura di opere,  beni  o  servizi  riguardanti  la pubblica amministrazione, e relativi subcontratti.  La condanna per i delitti di cui al primo  comma  importa  altresi' l'esclusione  per  un  periodo   di   due   anni   da   agevolazioni, finanziamenti, contributi o sussidi da parte dello Stato o  di  altri enti pubblici, nonche' dell'Unione europea, relativi  al  settore  di attivita' in cui ha avuto luogo lo sfruttamento.   L'esclusione di cui al secondo comma e'  aumentata  a  cinque  anni quando il fatto e' commesso da soggetto al quale sia stata  applicata la recidiva ai sensi dell'articolo 99, secondo  comma,  numeri  1)  e 3)",
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.3',
		name: 'question_S3.6.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che tali standard siano rispettati dai fornitori di manodopera (ovvero che non venga trattenuta parte del compenso dei lavoratori, o beni e documenti di questi ultimi, al fine di forzare la permanenza dei lavoratori nel rapporto lavorativo e garantire la possibilità di risolvere il contratto di lavoro, non imponendo termini irragionevoli di preavviso) ?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.4',
		name: 'question_S3.6.4',
		type: 'radiogroup' as const,
		title:
			"In materia di compensi, l’impresa osserva gli standard previsti dal CCNL applicabile? \nIn mancanza di CCNL applicabile, per la determinazione dei compensi, l'azienda si assicura che gli standard di lavoro applicati siano almeno comparabili e sufficienti per assicurare al lavoratore il soddisfacimento dei bisogni propri e della propria famiglia?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.5',
		name: 'question_S3.6.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che i compensi corrisposti agli appaltatori, agli intermediari per la fornitura di manodopera e ad altri attori della filiera rilevanti siano sufficienti per coprire i costi di produzione (inclusivo del costo del lavoro e di un ragionevole margine di profitto)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.6',
		name: 'question_S3.6.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa corrisponde i compensi ai propri lavoratori a intervalli regolari e ne garantisce la tracciabilità attraverso un sistema di registri delle ore di lavoro svolte da ciascun lavoratore impiegato e del compenso corrisposto?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.7',
		name: 'question_S3.6.7',
		type: 'radiogroup' as const,
		title:
			'a) L’impresa sigla un contratto per iscritto legalmente vincolante con tutti i lavoratori e si assicura che i lavoratori siano consapevoli dei propri diritti, doveri, mansioni, compensi e orari di lavoro quali parti integranti del contratto di lavoro ?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.6.8',
		name: 'question_S3.6.8',
		type: 'radiogroup' as const,
		title:
			"b) L'impresa fornisce copia firmata del contratto di lavoro al lavoratore in una lingua che sia per lo stesso comprensibile?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.7.1',
		name: 'question_S3.7.1',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha previsto (e formalizzato all'interno di apposito documento) di comunicare tempestivamente con i rappresentanti dei lavoratori in caso di operazioni che possono avere effetti importanti sull’impiego dei lavoratori?\nAd esempio, in caso di ristrutturazioni o chiusure di stabilimenti, l’impresa adotta e attua una procedura di collaborazione con sindacati e gruppi rappresentativi al fine della mitigazione dei potenziali effetti negativi sui lavoratori?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.7.2',
		name: 'question_S3.7.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un sistema di consultazione e cooperazione regolare con i lavoratori e i loro rappresentanti?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.7.3',
		name: 'question_S3.7.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa comunica regolarmente informazioni utili a favorire le relazioni e negoziazioni tra le parti sociali?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.7.4',
		name: 'question_S3.7.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa tiene un registro dove scrive perché un contratto di lavoro è stato chiuso e se il lavoratore era iscritto a un sindacato?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.8.1',
		name: 'question_S3.8.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa si impegna ad assicurare la formazione dei dipendenti a tutti i livelli affinché questi siano messi nelle condizioni di poter svolgere i compiti ad essi assegnati e per promuovere opportunità di carriera?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.8.2',
		name: 'question_S3.8.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa si impegna a favorire la formazione di giovani e donne in modo da aumentare le possibilità di accesso a un lavoro dignitoso ed al fine di promuovere l’imprenditoria giovanile e femminile?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.8.3',
		name: 'question_S3.8.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un piano di formazione e informazione continua dei lavoratori in merito ai propri diritti e doveri, svolto durante l’orario di lavoro retribuito?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.1',
		name: 'question_S3.9.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato tutte le misure necessarie per prevenire e mitigare il rischio di esposizione dei lavoratori a sostanze tossiche?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.2',
		name: 'question_S3.9.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato tutte le misure necessarie per assicurare il corretto uso dei macchinari e delle attrezzature da lavoro da parte dei lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.3',
		name: 'question_S3.9.3',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha fornito ai lavoratori tutti i dispositivi di protezione necessari e si assicura che tutti i lavoratori propri e/o che lavorino all'interno delle proprietà dell'azienda indossino dispositivi di protezione personale appropriati durante l’utilizzo di sostanze tossiche o macchinari/attrezzi pericolosi?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.4',
		name: 'question_S3.9.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adeguatamente formato i lavoratori che utilizzano attrezzature, materiali e sostanze pericolose sui rischi specifici che questi possano causare alla salute e ha fornito una formazione adeguata su come utilizzarli in modo appropriato e cosa fare in caso di incidenti, assicurandosi la comprensione delle indicazioni da parte dei lavoratori stranieri?\n\nIn particolare, la formazione include indicazioni su come stoccare in maniera appropriata pesticidi e sostanze chimiche, come comprendere le etichette e istruzioni di prodotto, come gestire gli incidenti, come smaltire i contenitori vuoti, eventuali intervalli nell’utilizzo delle sostanze chimiche, attraverso istruzioni chiare, illustrate e visibili sul luogo di lavoro',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.5',
		name: 'question_S3.9.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che l’applicazione di pesticidi e altre sostanze chimiche pericolose non avvenga al di sotto di un raggio di 10 metri da altre attività umane, a meno che non vi sia una barriera fisica che riduca l’esposizione di soggetti terzi.',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.6',
		name: 'question_S3.9.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che i lavoratori sul campo abbiano accesso ad acqua potabile e servizi igienici separati per donne e uomini e in numero adeguato al numero dei lavoratori stessi?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.9.7',
		name: 'question_S3.9.7',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che i lavoratori under 18, le donne in stato di gravidanza o in allattamento, i lavoratori disabili o con malattie croniche non siano adibiti a mansioni potenzialmente pericolose per la loro condizione psico-fisica?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.10.1',
		name: 'question_S3.10.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa si è dotata di un documento formale (di seguito chiamata policy) in materia di violenza di genere, abusi sessuali e violenza sul luogo di lavoro? \n\nEs. inclusivo di sistemi di raccolta e valutazione dei dati disaggregati per genere per comprendere gli impatti di genere dell’attività dell’impresa; di processi che favoriscano l’inclusione e la partecipazione delle donne es. sostenere la partecipazione paritetica e significativa delle donne in consultazioni e negoziazioni',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.10.2',
		name: 'question_S3.10.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha informato i propri lavoratori e i propri partner commerciali in merito all’esistenza e ai contenuti della policy e formato i propri lavoratori al rispetto delle disposizioni in essa contenute?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.10.3',
		name: 'question_S3.10.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato un sistema di vigilanza relativo alle tematiche di genere inclusivo di un sistema di segnalazione violazioni e irregolarità ad hoc che garantisca l’accesso e la protezione per i soggetti che vi accedono?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S3.10.4',
		name: 'question_S3.10.4',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha adottato un processo di verifica periodico [almeno annuale] circa l'efficacia delle disposizioni contenute all'interno delle policy e procedure (in materia di discriminazione, violenza di genere, salute e sicurezza, lavoro forzato lavoro minorile) che include attività di auditing, verifiche on-site e consultazioni con gli stakeholders (es. interviste con lavoratori e rappresentanze sindacali)?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE III | Agire',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S4.1',
		name: 'question_S4.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa controlla almeno una volta all'anno se il sistema di controllo dei rischi (due diligence) funziona bene, facendo controlli in azienda, verifiche sul posto e parlando con i lavoratori e i sindacati? \nIl controllo è soprattutto mirato a verificare che all'interno della catena di fornitura non si verifico impatti negativi sui diritti umani ovvero discriminazione, violenza di genere, salute e sicurezza, lavoro forzato lavoro minorile) ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE IV | Monitorare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S4.2',
		name: 'question_S4.2',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha definito (e formalizzato all'interno di un documento specifico) un processo di revisione delle strategie nel caso in cui le misure adottate (per mitigare gli impatti negativi sui diritti umani) non si siano rivelate efficaci al fine di prevenire o mitigare il rischio?",
		help: 'Il processo può concentrarsi su nodi chiave della filiera o "colli di bottiglia" ("choke points") identificando alcuni attori nella filiera sulla base di:\n- punti chiave di trasformazione nella filiera\n- punti della filiera in cui ci sono meno attori o punti di aggregazione dei prodotti\n- punti in cui le aziende che vendono o distribuiscono il prodotto finale hanno più forza o strumenti per influenzare il mercato o i fornitori\n- punti di operatività di schemi di certificazione e programmi di audit',
		reporting: '',
		docs: '',
		section: 'SEZIONE IV | Monitorare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.1',
		name: 'question_S5.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa redige un rapporto pubblico sulle politiche di due diligence attuate?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.2',
		name: 'question_S5.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa comunica periodicamente gli avanzamenti e i monitoraggi della valutazione e gestione dei rischi con le parti interessate (quali ad esempio clienti, fornitori, istituzioni, associazioni di categoria, comunità locale, etc..)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.3',
		name: 'question_S5.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato meccanismi per comunicare efficacemente le seguenti informazioni:',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.3.1',
		name: 'question_S5.3.1',
		type: 'radiogroup' as const,
		title:
			'il numero dei dipendenti con indicazione del tipo di contratto (temporaneo o permanente), genere, paese di impiego?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.3.2',
		name: 'question_S5.3.2',
		type: 'radiogroup' as const,
		title:
			'il numero e la percentuale di incidenti collegati al lavoro e numero di decessi connessi a indicenti e malattie collegate al lavoro (calcolati sulla base del numero di incidenti per anno rendicontato / numero totale delle ore lavorate nell’anno da tutti i dipendenti x 200.000)?',
		help: "200.000 è un un'unità comparativa e rappresenta il totale di ore lavorate da 100 dipendenti a tempo pieno in un anno.",
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.3.3',
		name: 'question_S5.3.3',
		type: 'radiogroup' as const,
		title:
			"l'allineamento delle paghe con i compensi minimi previsto dalla legge nazionale o dal CCNL applicabile, la percentuale di gender pay gap, la percentuale di dipendenti coperti da CCNL, il numero medio di ore di formazione per dipendente diviso per genere?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S5.3.4',
		name: 'question_S5.3.4',
		type: 'radiogroup' as const,
		title:
			'la presenza di eventuali incidenti gravi in materia di diritti umani confermati (azioni legati o reclami registrati presso l’impresa o istanze di non-conformità attraverso procedure stabilite) e le azioni intraprese in conseguenza di tali incidenti, in relazione alla propria forza lavoro o conoscenza di incidenti confermati in relazione ai diritti umani dei lavoratori nella catena del valore, delle comunità o dei consumatori ?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE V | Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.1',
		name: 'question_S6.1',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha definito e formalizzato all'interno di specifico documento una procedura di reclamo (a disposizione dei lavoratori) per conoscere tempestivamente le condotte contrarie agli standard di tutela dei diritti umani?",
		help: 'Occorre dare la possibilità ai lavoratori di accedere a meccanismi di reclamo in modo riservato, ecco alcuni esempi di come possono essere inviate le segnalazioni: \n– Per iscritto o a voce a un rappresentante dei lavoratori formato e fidato;\n– Attraverso i referenti dei dipendenti, come ad esempio supervisori, dirigenti, risorse\numane, ecc.;\n– In una cassetta dei suggerimenti disponibile presso i luoghi di lavoro;\n– Attraverso applicazioni telefoniche, risposte vocali interattive o applicazioni mobili;\n– Con una linea di assistenza indipendente, specializzata, multilingue, confidenziale ed\nanonima.\nEsempi di reclami/segnalazioni possono riguardare questioni come violenza, comportamenti\nabusivi, bullismo, intimidazione, corruzione, discriminazione, molestie, vittimizzazione, spese\ndi assunzione, alloggio inadeguato, lavoro forzato e sfruttamento del lavoro. Possono\nconcernere anche la violenza e le molestie di genere, compresa la violenza verbale, fisica e\nsessuale.',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.2',
		name: 'question_S6.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa si è assicurata che il meccanismo di reclamo sia facilmente accessibile ai lavoratori e a tutti gli stakeholders potenzialmente impattati dall’attività d’impresa?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.3',
		name: 'question_S6.3',
		type: 'radiogroup' as const,
		title:
			"L’impresa si è assicurata che l'utilizzo del meccanismo di reclamo sia garantito e incentivato attraverso presidi quali l’anonimato, l’accessibilità sul luogo di lavoro o in altro luogo protetto, l’esistenza di un riferimento o garante esterno all’impresa?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.4',
		name: 'question_S6.4',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha predisposto un registro dei reclami ricevuti e/o un meccanismo di incorporazione delle istanze emerse nei reclami all'interno del corpus documentale dell'azienda in materia di diritti umani e condotta responsabile ?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.5',
		name: 'question_S6.5',
		type: 'radiogroup' as const,
		title:
			"L’impresa ha definito e formalizzato all'interno di specifico documento un processo per la gestione dei reclami ricevuti in relazione alle violazioni dei diritti umani della propria forza lavoro?",
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'S6.6',
		name: 'question_S6.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa collabora con le autorità pubbliche in caso di irregolarità riscontrate nella propria attività e nell’attività di soggetti nella propria catena di fornitura?',
		help: '',
		reporting: '',
		docs: '',
		section: 'SEZIONE VI | Rimediare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
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
 * - help: Contextual help content for question understanding
 * - reporting: Reporting requirements and compliance information
 * - docs: Additional documentation and resources
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
 *     help: 'Consider irrigation systems',
 *     reporting: 'Report to EPA quarterly',
 *     docs: 'See environmental compliance guide',
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
		pages: questions.map((q, index) => {
			// For umbrella questions (type: 'group'), create navigation-only pages
			if (q.type === 'group') {
				return {
					name: `page_${index}`,
					elements: [
						{
							type: 'html',
							name: `${q.name}`,
							html: `
								<div class="mt-12">
									<div class="question-title text-lg weight-bold mb-4 break-words whitespace-normal markdown-content">
										${q.title
											// Handle links first to avoid conflicts with bold/italic
											.replace(
												/\[([^\]]+)\]\(([^)]+)\)/g,
												'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80 transition-colors">$1</a>',
											)
											// Handle bold before italic to avoid conflicts
											.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
											// Handle italic with underscore syntax
											.replace(/_([^_]+)_/g, '<em>$1</em>')
											// Handle code
											.replace(
												/`([^`]+)`/g,
												'<code class="bg-muted rounded px-1 py-0.5 font-mono text-xs">$1</code>',
											)
											// Handle line breaks
											.replace(/\n/g, '<br>')}
									</div>
								</div>
							`,
							// Preserve custom properties for accordion injection
							questionId: q.questionId,
							section: q.section,
							help: q.help,
							reporting: q.reporting,
							docs: q.docs,
							score: q.score,
							isUmbrellaQuestion: true,
						},
					],
				}
			}

			// For regular questions, check if they have a parent umbrella question
			const parentQuestion = questions.find(
				(parent) => parent.questionId === q.parentQuestionId,
			)

			return {
				name: `page_${index}`,
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
						help: q.help || '',
						reporting: q.reporting || '',
						docs: q.docs || '',
						score: q.score,
						parentQuestionId: q.parentQuestionId,
						parentQuestionTitle: parentQuestion?.title, // For umbrella title injection
					},
				],
			}
		}),

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
