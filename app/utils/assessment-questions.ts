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
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-18
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
		questionId: 'S0.1',
		name: 'question_S0.1',
		type: 'text' as const,
		title: "Ragione sociale e partita iva dell'azienda",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			"L'impresa ha formalizzato all'interno di un documento scritto e reso disponibile a tutte le parti interessate, il proprio impegno a rispettare i diritti umani in coerenza con gli standard internazionali (Principi Guida Onu / Linee Guida OCSE)?",
		descriptions: [
			"Il primo passo è **impegnarsi pubblicamente** a rispettare i diritti umani. Per fare questo occorre:\n\n- Sensibilizzare la direzione e il personale\n- Sviluppare e sottoscrivere un impegno al rispetto dei diritti umani\n- Assegnare le responsabilità ai membri rilevanti dell'alta dirigenza e del personale\n- Sensibilizzare il personale, i soci e i lavoratori agricoli",
		],
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
		descriptions: [
			"Una **politica** è un testo in cui un'organizzazione si pone un obiettivo e concorda principi generali e procedure per raggiungerlo.\n\nLe politiche sono utili, perché:\n- Chiariscono gli obiettivi\n- Guidano le decisioni e le attività successive\n\nLe politiche devono delineare le **procedure**, che forniscono:\n1. Istruzioni passo-passo per specifiche attività di routine\n2. Lista di controllo o fasi del processo da seguire",
		],
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
		descriptions: [],
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
			"Il corpus documentale, [così come definito al punto precedente], contiente la trattazione di almeno le seguenti tematiche in materia di diritti umani e gestione responsabile della manodopera: Nel corpus documentale l'impresa ha incluso una politica e previsto delle procedure per prevenire il lavoro forzato e per assicurarsi che lavoratrici e lavoratori siano reclutati e assunti in modo etico?",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			'Il corpus documentale [così come definito al punto precedente], è stato redatto: a) grazie al supporto di esperti in materia di diritti umani e gestione responsabile della manodopera b) consultando tutti gli attori con cui l\'azienda ha delle interazioni e su cui esercita influenza e interesse (altresì definiti "portatori di interesse" o "stakeholder" ) ? c) oppure consultando organizzazioni che rappresentano gli interessi della società civile e dei lavoratori?',
		descriptions: [],
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
			"Per il corpus documentale [così come definito al punto precedente], l'azienda ha previsto la presenza di meccanismi di revisione periodica ed aggiornamento del contenuto al fine di garantire che lo stesso rifletta le varazioni relative a: a) i rischi a cui la filiera vitivinicola è soggetta b) normativa nazionale o internazionale c) standard internazionali ?",
		descriptions: [],
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
		descriptions: [],
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
			"L'impresa è già in possesso di una certificazione che includa dei requisiti sul rispetto dei diritti umani come ad esempio: SA8000 ISO 26000 Fair Trade / Commercio equo e solidale Global GAP GRASP Sedex/SMETA Equalitas",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: ['Rapporti a lungo termine, capacity‑building'],
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
		descriptions: [],
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
		descriptions: ['Tracciabilità documenti, decisioni, pagamenti'],
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
		descriptions: ['Rif. UNGPs'],
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
		descriptions: [],
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
		descriptions: [
			'Esempi di registri dati produttori, lavoratori, pratiche di gestione rischio',
		],
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
			"L'azienda ha effetuato una mappatura dei rischi avviando un processo di raccolta informazioni per comprendere i potenziali impatti negativi sui diritti umani derivanti dalle attività dei propri fornitori e degli altri attori con cui collabora a valle della filiera?",
		descriptions: [
			"Effettuare una valutazione del rischio che preveda 3 step: 1. Mappare i rischi e i problemi legati ai diritti umani e all'ambiente nel vostro Paese e nel vostro settore di produzione. 2. Identificare e valutare almeno tre sfide più importanti per le vostre operazioni. 3. Identificare i gruppi di persone più vulnerabili",
		],
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
		questionId: 'S2.2.2',
		name: 'question_S2.2.2',
		type: 'radiogroup' as const,
		title:
			"Nell'identificare i rischi di impatti negativi sui diritti umani ha tenuto conto di fattori rilevanti quali: area geografica, settore di appartenenza e per ogni partner commerciale fattori di rischio specifici?",
		descriptions: [],
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
		questionId: 'S2.2.3',
		name: 'question_S2.2.3',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha previsto nel processo di valutazione del rischio, l’identificazione dei titolari dei diritti e delle parti interessate e il loro coinvolgimento, con particolare riferimento alle categorie vulnerabili per il settore vitivinicolo (donne, migranti, stagionali, minori) nonché relative associazioni di riferimento attive sul territorio?",
		descriptions: [],
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
		questionId: 'S2.2.4.1',
		name: 'question_S2.2.4.1',
		type: 'radiogroup' as const,
		title:
			"All'interno della procedura di valutazione del rischio, l'impresa ha incluso la presenza di “red flags”, ovvero di \"segnali d'allarme\" al fine di attenzionare alcuni specifici processi o situazioni aziendali che possono nascondere la presenza di un potenziale problema o rischio?",
		descriptions: [
			'N.b. l’identificazione delle “red flags” può derivare da diversi tipi di valutazione del rischio. Ad esempio: - red flags geografiche: aree di conflitto o di governi instabili; aree in cui ci sono forme di sfruttamento riportate; aree in cui sono contestati i diritti proprietari sulla terra; aree in cui vi è carenza di cibo o acqua - red flags prodotti: produzioni agricole notoriamente connesse a impatti negativi sui diritti umani - red flags partner commerciali: storico di inosservanza pratiche di condotta d’impresa responsabile (ad esempio segnalazioni di pratiche commerciali sleali in agricoltura ai sensi della Direttiva 633/2019 recepite in Italia nel D.L. 198/2021 o politiche dei prezzi insufficienti a coprire i costi di produzione); pratiche di fornitura da aree a rischio negli ultimi 12 mesi; partecipazioni o quote in imprese che non rispettano gli standard di condotta d’impresa responsabile.',
		],
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
		questionId: 'S2.2.4.2',
		name: 'question_S2.2.4.2',
		type: 'radiogroup' as const,
		title:
			'Per ognuna delle "red flags" è stata prevista, da parte dell\'azienda, un\'analisi approfondita e sistematica (che preveda ad esempio verifiche sul campo)?',
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [
			'Box: i diversi livelli di coinvolgimento dell’impresa includono la causa, il contributo o il collegamento diretto.  Se l’impresa causa la violazione, dovrà cessare e rimediare l’impatto negativo causato.  Se l’impresa contribuisce alla violazione dovrà cessare e rimediare l’impatto negativo e/o utilizzare il proprio leverage nei confronti del soggetto terzo che ha co-causato l’impatto negativo.  Se l’impresa non ha né causato né contribuito all’impatto negativo, ma vi è direttamente collegata in virtù dei propri prodotti, servizi o operazioni, dovrà utilizzare il leverage nei confronti del soggetto che causa la violazione al fine della cessazione del comportamento lesivo; in mancanza, incrementare detto leverage e, in ultima istanza, interrompere la relazione commerciale.',
		],
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
			"L'azienda ha previsto (e formalizzato all'interno di apposito documento) che venga effettuata una raccolta di informazioni sui rischi derivanti dalle attività dei partner secondo una delle 3 modalità: Diretta (attraverso delle ispezioni o visite in loco) Indiretta (attraverso la verifica sulla presenza di schemi di certificazione, due diligence dei partner commerciali) Indiretta attraverso la collaborazione con attori intermedi (ad esempio chiedendo ad un fornitore la documentazione sull'attività svolta a sua volta verso i propri fornitori)?",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			"L’impresa ha previsto la presenza di un sistema di registrazione (un registro) dei lavoratori impiegati, inclusi i lavoratori stagionali, occasionali e in subappalto, che preveda almeno: - nome - genere - età - nazionalità - inizio e fine rapporto - tipo di rapporto di lavoro - compenso (giornaliero/mensile) - giornate lavorate? L'impresa si è inoltre presa cura di verificare che le informazioni anagrafiche registrate corrispondano a quanto riportati sui documenti presentati in originale ed inoltre che vi sia corrispondenza tra il lavoratore e il documento presentato ?",
		descriptions: [],
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
			"L’impresa ha previsto un sistema di verifiche preliminari e selezione dei soggetti terzi coinvolti nel reclutamento/fornitura di manodopera (cooperative)? Ad esempio verificandone le condizioni di operatività (autorizzazione allo svolgimento dell’attività, procedimenti pendenti, politiche dell’impresa ecc.) e tendone traccia all'interno di apposito registro ?",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [
			"Box: riporterei per intero l’articolo del codice. Ve lo incollo qua e valutiamo se inserire punto per p unto gli indici previsti dall’articolo come domande specifiche: Art. 603-bis (Intermediazione illecita e sfruttamento del lavoro). Salvo che il fatto costituisca piu' grave reato, chiunque svolga un'attivita' organizzata di intermediazione, reclutando manodopera o organizzandone l'attivita' lavorativa caratterizzata da sfruttamento, mediante violenza, minaccia, o intimidazione, approfittando dello stato di bisogno o di necessita' dei lavoratori, e' punito con la reclusione da cinque a otto anni e con la multa da 1.000 a 2.000 euro per ciascun lavoratore reclutato. Ai fini del primo comma, costituisce indice di sfruttamento la sussistenza di una o piu' delle seguenti circostanze: 1) la sistematica retribuzione dei lavoratori in modo palesemente difforme dai contratti collettivi nazionali o comunque sproporzionato rispetto alla quantita' e qualita' del lavoro prestato; 2) la sistematica violazione della normativa relativa all'orario di lavoro, al riposo settimanale, all'aspettativa obbligatoria, alle ferie; 3) la sussistenza di violazioni della normativa in materia di sicurezza e igiene nei luoghi di lavoro, tale da esporre il lavoratore a pericolo per la salute, la sicurezza o l'incolumita' personale; 4) la sottoposizione del lavoratore a condizioni di lavoro, metodi di sorveglianza, o a situazioni alloggiative particolarmente degradanti. Costituiscono aggravante specifica e comportano l'aumento della pena da un terzo alla meta': 1) il fatto che il numero di lavoratori reclutati sia superiore a tre; 2) il fatto che uno o piu' dei soggetti reclutati siano minori in eta' non lavorativa; 3) l'aver commesso il fatto esponendo i lavoratori intermediati a situazioni di grave pericolo, avuto riguardo alle caratteristiche delle prestazioni da svolgere e delle condizioni di lavoro. Art. 603-ter (Pene accessorie). - La condanna per i delitti di cui agli articoli 600, limitatamente ai casi in cui lo sfruttamento ha ad oggetto prestazioni lavorative, e 603-bis, importa l'interdizione dagli uffici direttivi delle persone giuridiche o delle imprese, nonche' il divieto di concludere contratti di appalto, di cottimo fiduciario, di fornitura di opere, beni o servizi riguardanti la pubblica amministrazione, e relativi subcontratti. La condanna per i delitti di cui al primo comma importa altresi' l'esclusione per un periodo di due anni da agevolazioni, finanziamenti, contributi o sussidi da parte dello Stato o di altri enti pubblici, nonche' dell'Unione europea, relativi al settore di attivita' in cui ha avuto luogo lo sfruttamento. L'esclusione di cui al secondo comma e' aumentata a cinque anni quando il fatto e' commesso da soggetto al quale sia stata applicata la recidiva ai sensi dell'articolo 99, secondo comma, numeri 1) e 3)",
		],
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
		descriptions: [],
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
			"In materia di compensi, l’impresa osserva gli standard previsti dal CCNL applicabile? In mancanza di CCNL applicabile, per la determinazione dei compensi, l'azienda si assicura che gli standard di lavoro applicati siano almeno comparabili e sufficienti per assicurare al lavoratore il soddisfacimento dei bisogni propri e della propria famiglia?",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			"L’impresa ha previsto (e formalizzato all'interno di apposito documento) di comunicare tempestivamente con i rappresentanti dei lavoratori in caso di operazioni che possono avere effetti importanti sull’impiego dei lavoratori? Ad esempio, in caso di ristrutturazioni o chiusure di stabilimenti, l’impresa adotta e attua una procedura di collaborazione con sindacati e gruppi rappresentativi al fine della mitigazione dei potenziali effetti negativi sui lavoratori?",
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			'L’impresa ha adeguatamente formato i lavoratori che utilizzano attrezzature, materiali e sostanze pericolose sui rischi specifici che questi possano causare alla salute e ha fornito una formazione adeguata su come utilizzarli in modo appropriato e cosa fare in caso di incidenti, assicurandosi la comprensione delle indicazioni da parte dei lavoratori stranieri? In particolare, la formazione include indicazioni su come stoccare in maniera appropriata pesticidi e sostanze chimiche, come comprendere le etichette e istruzioni di prodotto, come gestire gli incidenti, come smaltire i contenitori vuoti, eventuali intervalli nell’utilizzo delle sostanze chimiche, attraverso istruzioni chiare, illustrate e visibili sul luogo di lavoro',
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			'L’impresa si è dotata di un documento formale (di seguito chiamata policy) in materia di violenza di genere, abusi sessuali e violenza sul luogo di lavoro? Es. inclusivo di sistemi di raccolta e valutazione dei dati disaggregati per genere per comprendere gli impatti di genere dell’attività dell’impresa; di processi che favoriscano l’inclusione e la partecipazione delle donne es. sostenere la partecipazione paritetica e significativa delle donne in consultazioni e negoziazioni',
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
			"L'impresa controlla almeno una volta all'anno se il sistema di controllo dei rischi (due diligence) funziona bene, facendo controlli in azienda, verifiche sul posto e parlando con i lavoratori e i sindacati? Il controllo è soprattutto mirato a verificare che all'interno della catena di fornitura non si verifico impatti negativi sui diritti umani ovvero discriminazione, violenza di genere, salute e sicurezza, lavoro forzato lavoro minorile) ?",
		descriptions: [],
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
		descriptions: [
			'Il processo può concentrarsi su nodi chiave della filiera o "colli di bottiglia" ("choke points") identificando alcuni attori nella filiera sulla base di: - punti chiave di trasformazione nella filiera - punti della filiera in cui ci sono meno attori o punti di aggregazione dei prodotti - punti in cui le aziende che vendono o distribuiscono il prodotto finale hanno più forza o strumenti per influenzare il mercato o i fornitori - punti di operatività di schemi di certificazione e programmi di audit',
		],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [
			"200.000 è un un'unità comparativa e rappresenta il totale di ore lavorate da 100 dipendenti a tempo pieno in un anno.",
		],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [
			'Occorre dare la possibilità ai lavoratori di accedere a meccanismi di reclamo in modo riservato, ecco alcuni esempi di come possono essere inviate le segnalazioni: – Per iscritto o a voce a un rappresentante dei lavoratori formato e fidato; – Attraverso i referenti dei dipendenti, come ad esempio supervisori, dirigenti, risorse umane, ecc.; – In una cassetta dei suggerimenti disponibile presso i luoghi di lavoro; – Attraverso applicazioni telefoniche, risposte vocali interattive o applicazioni mobili; – Con una linea di assistenza indipendente, specializzata, multilingue, confidenziale ed anonima. Esempi di reclami/segnalazioni possono riguardare questioni come violenza, comportamenti abusivi, bullismo, intimidazione, corruzione, discriminazione, molestie, vittimizzazione, spese di assunzione, alloggio inadeguato, lavoro forzato e sfruttamento del lavoro. Possono concernere anche la violenza e le molestie di genere, compresa la violenza verbale, fisica e sessuale.',
		],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
		descriptions: [],
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
