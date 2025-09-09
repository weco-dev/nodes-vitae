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
		questionId: 'assessment-0.1',
		name: 'Anagrafica | Domanda 0.1',
		type: 'text' as const,
		title: 'Inserisci la *Ragione sociale* della tua impresa:',
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.2',
		name: 'Anagrafica | Domanda 0.2',
		type: 'text' as const,
		title: 'Inserisci la *Partita IVA* della tua impresa:',
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [],
		isRequired: false,
		score: 0,
	},
	{
		questionId: 'assessment-0.3',
		name: 'Anagrafica | Domanda 0.3',
		type: 'radiogroup' as const,
		title: 'Indica la *forma giuridica* della tua impresa:',
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [
			'Ditta individuale',
			'Società semplice (S.s.)e 2',
			'Società in nome collettivo (S.n.c.)',
			'Società in accomandita semplice (S.a.s.)',
			'Società a responsabilità limitata (S.r.l.)',
			'Società per azioni (S.p.A.)',
			'Società cooperativa',
			'Impresa sociale',
			'Azienda agricola individuale',
			'Società agricola di persone',
			'Società cooperativa agricola',
			'Altro',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.4',
		name: 'Anagrafica | Domanda 0.4',
		type: 'text' as const,
		title: "Indica l'*indirizzo della sede legale*:",
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.5',
		name: 'Anagrafica | Domanda 0.5',
		type: 'radiogroup' as const,
		title: 'Indicare il numero di *lavoratori dipendenti*:',
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: ['Nessuno', 'Da 1 a 3', 'Da 3 a 10', 'Più di 10'],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.6',
		name: 'Anagrafica | Domanda 0.6',
		type: 'radiogroup' as const,
		title:
			"La tua impresa ricorre a società esterne per l'appalto della manodopera?",
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: ['Sì', 'No', 'A volte'],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.7',
		name: 'Anagrafica | Domanda 0.7',
		type: 'radiogroup' as const,
		title: 'Superficie agricola coltivata:',
		help: '',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [
			'Da 1 a 5 ettari',
			'Da 5 a 10 ettari',
			'Da 10 a 20 ettari',
			'Da 20 a 40 ettari',
			'Più di 40 ettari',
		],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-0.8',
		name: 'Anagrafica | Domanda 0.8',
		type: 'text' as const,
		title:
			"Indica tutte le fasi della filiera svolte direttamente dall'impresa",
		help: 'Per fasi della filiera si intende: \n- coltivazione\n- produzione\n- trasformazione\n- commercializzazione',
		reporting: '',
		docs: '',
		section: 'Anagrafica',
		choices: [],
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-1.1',
		name: 'I. Impegnarsi | Domanda 1.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha formalizzato all'interno di un documento scritto e reso disponibile a tutte le parti interessate, il proprio *impegno a rispettare i diritti umani* in coerenza con gli standard internazionali (Principi Guida Onu / Linee Guida OCSE)?",
		help: "Il primo passo è impegnarsi pubblicamente a rispettare i diritti umani. Per fare questo occorre:\n- sensibilizzare la direzione e il personale\n- sviluppare e sottoscrivere un impegno al rispetto dei diritti umani\n- assegnare le responsabilità ai membri rilevanti dell'alta dirigenza e del personale\n- sensibilizzare il personale, i soci e i lavoratori agricoli",
		reporting: '',
		docs: '[Allegato 1 | Condotta responsabile](../downloads/1-condotta-responsabile.pdf)',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.2',
		name: 'I. Impegnarsi | Domanda 1.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha definito, anche in modo semplice, dei principi *(policy)* e delle regole *(procedure)* che descrivano  l'impegno, gli obiettivi, le attività che intende portare avanti per una gestione responsabile della manodopera estesa anche ai propri fornitori / collaboratori?",
		help: "Una politica è un testo in cui un'organizzazione si pone un obiettivo e concorda principi generali e procedure per raggiungerlo. \nLe politiche sono utili, perché chiariscono gli obiettivi e guidano le decisioni e le attività successive, più dettagliate. \nLe politiche devono delineare le procedure, che forniscono istruzioni passo-passo per specifiche attività di routine.\nPossono anche includere una lista di controllo o le fasi del processo da seguire.",
		reporting:
			"Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).\nC6 par. 61 - l'impresa deve sviluppare un sistema di gestione che copra almeno i settori cruciali \n1. lavoro forzato \n2. lavoro minorile \n3. tratta di esseri umani \n4. discriminazione \n5. salute e sicurezza sul lavoro",
		docs: '[Allegato 8a | Come scrivere una policy?](..downloads/8a-come-scrivere-policy.pdf)',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.3',
		name: 'I. Impegnarsi | Domanda 1.3',
		type: 'group' as const,
		title:
			'Le policy e le procedure (del punto precedente) devono includere le principali tematiche in materia di diritti umani e gestione responsabile della manodopera quali: lavoro forzato, lavoro minorile, disuguaglianza e discriminazione, salute e sicurezza dei lavoratori, tratta di esseri umani. Dunque:',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-1.3.1',
		name: 'I. Impegnarsi | Domanda 1.3.1',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha una politica e delle procedure per prevenire il lavoro forzato e per assicurarsi che lavoratrici e lavoratori *siano reclutati e assunti in modo etico*?",
		help: '',
		reporting: '',
		docs: '[Allegato 2 | Politica per il reclutamento e il lavoro etico](../downloads/2-policy-lavoro-forzato.pdf)\n\n[Allegato 2a | Indicatori per lo sfruttamento lavorativo](../downloads/2a-indicatori-sfruttamento.pdf)',
		section: 'I. Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-1.3',
	},
	{
		questionId: 'assessment-1.3.2',
		name: 'I. Impegnarsi | Domanda 1.3.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha una politica e delle procedure per assicurarsi che non si faccia ricorso al *lavoro minorile*?",
		help: '',
		reporting: '',
		docs: '[Allegato 3 | Politica contro il lavoro minorile](../downloads/3-lavoro-minorile.pdf)',
		section: 'I. Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-1.3',
	},
	{
		questionId: 'assessment-1.3.3',
		name: 'I. Impegnarsi | Domanda 1.3.3',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha una politica e delle procedure per prevenire ogni forma di *disuguaglianza e discriminazione*?",
		help: '',
		reporting: '',
		docs: '[Allegato 4 | Politica contro le discriminazioni](../downloads/4-policy-discriminazioni.pdf)',
		section: 'I. Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-1.3',
	},
	{
		questionId: 'assessment-1.3.4',
		name: 'I. Impegnarsi | Domanda 1.3.4',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha una politica e delle procedure che sanciscano l’impegno a tutelare la *salute e la sicurezza di lavoratori*, visitatori, collaboratori e appaltatori?",
		help: '',
		reporting: '',
		docs: '[Allegato 5 | Politica sulla salute e sicurezza dei lavoratori](../downloads/5-policy-salute-sicurezza.pdf)',
		section: 'I. Impegnarsi',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-1.3',
	},
	{
		questionId: 'assessment-1.4.1',
		name: 'I. Impegnarsi | Domanda 1.4.1',
		type: 'radiogroup' as const,
		title:
			"I principi (policy) e le regole (procedure) sono state approvate dal titolare/responsabile legale dell'azienda?",
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.4.2',
		name: 'I. Impegnarsi | Domanda 1.4.2',
		type: 'radiogroup' as const,
		title:
			'C’è una persona/responsabile, in azienda, incaricata di controllare che le regole sul rispetto dei diritti umani siano seguite?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.4.3',
		name: 'I. Impegnarsi | Domanda 1.4.3',
		type: 'radiogroup' as const,
		title:
			"Quando sono state scritte le regole sul rispetto dei diritti dei lavoratori e collaboratori, l'impresa ha coinvolto o ascoltato:\n- esperti o consulenti del settore\n- persone che lavorano per l'impresa (dipendenti, collaboratori, fornitori)\n- sindacati o associazioni di tutela dei lavoratori",
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.4.4',
		name: 'I. Impegnarsi | Domanda 1.4.4',
		type: 'radiogroup' as const,
		title:
			"L'impresa ha previsto un modo per *aggiornare* le regole nel tempo, in base a nuovi rischi o cambiamenti delle normative o degli standard internazionali?",
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.5.1',
		name: 'I. Impegnarsi | Domanda 1.5.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha aderito a una *certificazione* o partecipa a progetti insieme ad altri attori della filiera (es. associazioni o iniziative/progetti territoriali o multi attore) per garantire buone condizioni di lavoro e rispetto dei diritti umani?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.5.2',
		name: 'I. Impegnarsi | Domanda 1.5.2',
		type: 'radiogroup' as const,
		title:
			"L'impresa è già in possesso di una certificazione che includa dei requisiti sul rispetto dei diritti umani come ad esempio: \n- SA8000 \n- ISO 26000 \n- Fair Trade / Commercio equo e solidale\n- Global GAP GRASP \n- Sedex/SMETA \n- Equalitas",
		help: '',
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).\nSezione B1 punto 25 VSMEs – Comunicare se in possesso di certificazioni o label di sostenibilità con breve descrizione, indicare il soggetto che ha rilasciato la certificazione o l’etichetta, la data e la valutazione ottenuta',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.6.1',
		name: 'I. Impegnarsi | Domanda 1.6.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa inserisce nei *contratti con i principali fornitori* (quelli con cui ha un rapporto consolidato e continuativo) un impegno chiaro sul rispetto dei diritti delle persone che lavorano?',
		help: '',
		reporting: '',
		docs: '[Allegato 7 | Clausole per i contratti con i fornitori](../downloads/7-clausole-fornitori.pdf)',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.6.2',
		name: 'I. Impegnarsi | Domanda 1.6.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha spiegato ai propri fornitori e collaboratori cosa si aspetta da loro in termini di rispetto dei lavoratori e condizioni dignitose?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.6.3',
		name: 'I. Impegnarsi | Domanda 1.6.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa sceglie i fornitori anche in base al modo in cui trattano i loro lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.6.4',
		name: 'I. Impegnarsi | Domanda 1.6.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un modo (anche semplice) per ricevere informazioni dai fornitori o dai collaboratori sul rispetto dei lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-1.6.5',
		name: 'I. Impegnarsi | Domanda 1.6.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa controlla, su base periodica, che i propri fornitori rispettino le regole che ha definito per garantire buone condizioni di lavoro?',
		help: '',
		reporting: '',
		docs: '',
		section: 'I. Impegnarsi',
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
		questionId: 'assessment-2.1',
		name: 'II. Valutare | Domanda 2.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha raccolto in un documento o schema l’elenco di tutti i fornitori e collaboratori coinvolti nel processo produttivo, dalla vigna fino alla vendita?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.1.2',
		name: 'II. Valutare | Domanda 2.1.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha fatto una *mappa dei propri processi e attività* (come raccolta, lavorazione, vendita) per capire in quali fasi lavora con soggetti esterni come clienti, fornitori o distributori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.1.3',
		name: 'II. Valutare | Domanda 2.1.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha mappato le proprie sedi operative e sa dove operano i suoi fornitori e collaboratori e ha raccolto le informazioni principali sulle loro sedi e attività?',
		help: 'Nello standard Equalitas, ad esempio, richiedono di tenere appositi registri con i dati rilevanti per produttore agricolo: \n- nome del produttore\n- identificazione del sito e indirizzo\n- contatti del referente\n- dati della produzione\n- numero di lavoratori per genere\n- lista delle pratiche di gestione del rischio\n- vie di trasporto\n- valutazioni del rischio effettuate',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.1',
		name: 'II. Valutare | Domanda 2.2.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha cominciato a raccogliere informazioni e analizzarle per capire *se le attività dei fornitori* possono comportare rischi per i diritti dei lavoratori (es. lavoro non tutelato, sfruttamento, sicurezza)?',
		help: "Per effettuare una valutazione del rischio si dovrebbero:\n- mappare i rischi e i problemi legati ai diritti umani e all'ambiente nel vostro Paese e nel vostro settore di produzione\n- identificare e valutare almeno tre sfide più importanti per le vostre operazioni\n- identificare i gruppi di persone più vulnerabili",
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME). \nPunti 2.1‑2.8',
		docs: '[Allegato 8b | Risk assessment e rischi di filiera](../downloads/8b-risk-assessment.pdf)',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.2',
		name: 'II. Valutare | Domanda 2.2.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha considerato, nel valutare i possibili rischi per i diritti umani, elementi come *l’area geografica*, *il tipo di attività svolta/settore* e fattori specifici di rischio per ciascun fornitore o partner commerciale?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.3',
		name: 'II. Valutare | Domanda 2.2.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha *coinvolto*, nel valutare i rischi sui propri fornitori, anche *le persone potenzialmente più vulnerabili* (es. stagionali, migranti, donne, giovani), o le associazioni che li rappresentano?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.4.1',
		name: 'II. Valutare | Domanda 2.2.4.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha identificato dei *segnali d’allarme* (“red flags”) per evidenziare attività o situazioni aziendali che possono nascondere problemi o rischi per i lavoratori?',
		help: 'L’identificazione delle “red flags” può derivare da diversi tipi di valutazione del rischio. \n_Ad esempio:\n- *red flags geografiche*: aree di conflitto o di governi instabili; aree in cui ci sono forme di sfruttamento riportate; aree in cui sono contestati i diritti proprietari sulla terra; aree in cui vi è carenza di cibo o acqua\n- *red flags relative a prodotti specifici*: produzioni agricole notoriamente connesse a impatti negativi sui diritti umani\n- *red flags relative a partner commerciali/fornitori*: storico di inosservanza delle pratiche di condotta d’impresa responsabile (ad esempio segnalazioni di pratiche commerciali sleali in agricoltura ai sensi della Direttiva 633/2019 recepite in Italia nel D.L. 198/2021 o politiche dei prezzi insufficienti a coprire i costi di produzione); pratiche di fornitura da aree a rischio negli ultimi 12 mesi; partecipazioni o quote in imprese che non rispettano gli standard di condotta d’impresa responsabile._',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.4.2',
		name: 'II. Valutare | Domanda 2.2.4.2',
		type: 'radiogroup' as const,
		title:
			'Per ogni segnale d’allarme individuato, l’impresa ha previsto un’analisi più approfondita, ad esempio attraverso controlli sul campo o raccolta diretta di informazioni?',
		help: '_Ad esempio: ha verificato, anche intervistando i lavoratori, che il fornitore di manodopera paghi salari equi e con regolarità?_',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.5',
		name: 'II. Valutare | Domanda 2.2.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha stabilito (anche per iscritto) che la valutazione dei rischi venga *aggiornata periodicamente* e ogni qualvolta cambi qualcosa di rilevante (nuovi prodotti, nuovi mercati, nuovi partner)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.6',
		name: 'II. Valutare | Domanda 2.2.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha previsto una *scala di priorità* per i rischi, in modo da dare più attenzione a quelli più gravi o più probabili?',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.7',
		name: 'II. Valutare | Domanda 2.2.7',
		type: 'radiogroup' as const,
		title:
			"Nella valutazione del rischio l'impresa tiene conto delle *attività agricole*, aggiornandole in base alle circostanze attuali?",
		help: "L'impresa può attivare dei sistemi di raccolta delle informazioni che monitorino le attività agricole e riportino osservazioni legate alla gestione dei lavoratori e a circostanze ambientali.\n_Ad esempio: far compilare al responsabile di campo una scheda di controllo con informazioni su:\n- condizioni climatiche\n- trattamenti agronomici\n- attività svolte in campo nella giornata\n- turni di lavoro e orari\n- dotazioni di sicurezza (guanti, scarpe antinfortunistiche, ecc.)\n- presenza di lavoratori nuovi o vulnerabili (es. minorenni, migranti non ancora formati)_\n\nSe i dati vengono conservati su un file condiviso e aggiornati durante tutta la stagione di raccolta in caso di anomalie il titolare attiva una verifica interna o un colloquio con i lavoratori.\n*Grazie a questo sistema, l’azienda riesce a prevenire criticità, rispondere in modo tempestivo a situazioni di rischio* (orari eccessivi o condizioni non sicure ecc.), e tenere traccia delle condizioni reali di lavoro, dimostrando attenzione alla tutela dei diritti.",
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.8',
		name: 'II. Valutare | Domanda 2.2.8',
		type: 'radiogroup' as const,
		title:
			'Nel valutare i rischi, l’impresa distingue se un problema dipende direttamente dalle sue attività, se contribuisce al problema insieme ad altri, o se riguarda un fornitore o un collaboratore?',
		help: "L'impresa potrebbe avere gradi di coinvolgimento diversi: \n- *Essere direttamente responsabile* quando causa direttamente il rischio o la violazione.\n_Ad esempio: l'impresa ha assunto direttamente dei lavoratori stagionali senza contratto, oppure non garantisce loro pause, acqua potabile o accesso ai servizi._\n- *Contribuire al rischio o alla violazione* se il comportamento dell'impresa rende possibile o facilita l’abuso, anche se non è l’unica responsabile.\n_Ad esempio: l'impresa si affida a un intermediario per trovare manodopera, senza controllare come vengono trattati o retribuiti i lavoratori. Anche se non è causa diretta, il suo modo di operare contribuisce a una situazione di sfruttamento._\n- *Avere un legame diretto con un soggetto che causa una violazione*, anche se non ha contribuito attivamente.\n_Ad esempio: l'impresa acquista cassette o contenitori da un fornitore che impiega lavoratori in condizioni di sfruttamento. Non è direttamente coinvolta nella violazione, ma il suo legame commerciale con il fornitore la rende comunque responsabile di verificare e prevenire il rischio._\n\n*NB:* l’impresa dovrebbe adottare misure ragionevoli per individuare e gestire i rischi nella propria catena del valore, anche se non è direttamente responsabile della violazione.",
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-2.2.9',
		name: 'II. Valutare | Domanda 2.2.9',
		type: 'radiogroup' as const,
		title:
			'L’impresa raccoglie informazioni sui rischi delle attività dei partner commerciali attraverso una o più di queste modalità:\n- direttamente (con visite o controlli in azienda)\n- indirettamente (verificando certificazioni o documenti)\n- con il supporto di altri soggetti, come fornitori o intermediari',
		help: '',
		reporting: '',
		docs: '',
		section: 'II. Valutare',
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
		questionId: 'assessment-3.1',
		name: 'III. Agire | Domanda 3.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un modo veloce di comunicare i risultati (frutto della valutazione sui rischi) in modo da attivare dei rimedi in modo tempestivo?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.2',
		name: 'III. Agire | Domanda 3.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha deciso chi, tra i responsabili o soci, si occupa di intervenire per evitare problemi legati ai diritti umani?',
		help: "_Ad esempio: c'è qualcuno responsabile di controllare turni di lavoro eccessivi, pagamenti irregolari, mancanza di sicurezza ecc._",
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.3',
		name: 'III. Agire | Domanda 3.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha preparato un piano per prevenire o ridurre problemi futuri sui diritti dei lavoratori in base al suo grado di coinvolgimento?',
		help: 'I diversi livelli di coinvolgimento dell’impresa  includono la causa, il contributo o il collegamento diretto:\n*Cosa succede se:*\n- *se* l’impresa *causa* la violazione, *allora* dovrà cessare e rimediare all’impatto negativo causato\n- *se* l’impresa *contribuisce* alla violazione *allora* dovrà cessare e rimediare l’impatto negativo e/o utilizzare le leve che ha disposizione (leverage) nei confronti del soggetto terzo che ha co-causato l’impatto negativo\n- se l’impresa non ha né causato né contribuito all’impatto negativo, ma vi è direttamente *collegata* in virtù dei propri prodotti, servizi o operazioni, *allora* dovrà utilizzare il _leverage_ nei confronti del soggetto che causa la violazione al fine della cessazione del comportamento lesivo; in mancanza, incrementare detto leverage e, in ultima istanza, interrompere la relazione commerciale',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.4.1',
		name: 'III. Agire | Domanda 3.4.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa tiene un registro con i dati principali di chi lavora, inclusi stagionali e lavoratori esterni e/o in subbalto, dove annota almeno: \n- nome \n- genere \n- età \n- nazionalità \n- inizio e fine rapporto\n- tipo di rapporto di lavoro\n- compenso (giornaliero/mensile)\n- giornate lavorate',
		help: 'L’impresa dovrebbe verificare che i dati dei lavoratori siano corretti confrontando i documenti originali e controllando che la persona corrisponda ai documenti presentati.',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.4.2',
		name: 'III. Agire | Domanda 3.4.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa fa un controllo iniziale sui fornitori di manodopera per assicurarsi che siano in regola, abbiano le autorizzazioni allo svolgimento delle attività e non abbiano procedimenti aperti?',
		help: "L'impresa dovrebbe, inoltre, tenere traccia delle verifiche effettuate.",
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.4.3',
		name: 'III. Agire | Domanda 3.4.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un metodo per assegnare ruoli e incarichi basato sulle competenze e pari opportunità, e si impegna a formare i lavoratori per crescere nel lavoro?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.4.4',
		name: 'III. Agire | Domanda 3.4.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa tiene traccia dei motivi per cui assume, promuove o interrompe un contratto di lavoro?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.4.5',
		name: 'III. Agire | Domanda 3.4.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha messo in piedi un sistema per permettere ai lavoratori di segnalare problemi legati a discriminazioni o molestie di genere, con garanzie per chi segnala?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.5.2',
		name: 'III. Agire | Domanda 3.5.2',
		type: 'radiogroup' as const,
		title:
			'Se impiega ragazzi tra i 16 e i 18 anni, l’impresa si assicura che non svolgano mansioni pericolose o che interferiscano con la loro salute o scuola?',
		help: 'Esempi di lavoro pericoloso includono: \n- maneggiare e applicare sostanze chimiche, pesticidi e insetticidi\n- lavoro agricolo a temperature o in luoghi pericolosi per la salute\n- utilizzo di macchinari e attrezzi pericolosi\n- maneggiare o gestire rifiuti pericolosi',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.1',
		name: 'III. Agire | Domanda 3.6.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa evita di trattenere documenti o compensi o beni dei lavoratori e garantisce che possano interrompere il contratto senza vincoli ingiusti?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.2',
		name: 'III. Agire | Domanda 3.6.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa adotta misure per evitare lo sfruttamento lavorativo, come previsto dal Codice Penale (articolo 603 bis)?',
		help: '*Cosa prevede l’articolo 603-bis del Codice Penale?*\nLa legge italiana vieta severamente qualsiasi forma di sfruttamento lavorativo. \n*Un’azienda agricola può essere ritenuta responsabile se:*\n- i lavoratori sono pagati molto meno di quanto previsto dal contratto nazionale, oppure il salario è sproporzionato rispetto al lavoro svolto\n- non vengono rispettati i diritti sul lavoro, come pause, giorni di riposo, ferie, permessi\n- le condizioni di sicurezza sono assenti o inadeguate, mettendo a rischio la salute o la sicurezza dei lavoratori \n- i lavoratori vivono o lavorano in condizioni degradanti o umilianti.\n\n*Inoltre, le pene previste aumentano se:*\n- i lavoratori sfruttati sono più di tre\n- sono coinvolti minorenni\n- i lavoratori sono messi in situazioni di grave pericolo.\n\n*Attenzione: chi viene condannato per sfruttamento può subire sanzioni molto gravi:*\n- perdita della possibilità di ricevere fondi pubblici o europei (fino a 5 anni)\n- divieto di partecipare ad appalti pubblici\n- interdizione da ruoli di responsabilità in azienda',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.3',
		name: 'III. Agire | Domanda 3.6.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che anche gli *intermediari e gli appaltatori* applichino le stesse misure (ovvero che non venga trattenuta parte del compenso dei lavoratori, o beni e documenti di questi ultimi, al fine di forzare la permanenza dei lavoratori nel rapporto lavorativo e garantire la possibilità di risolvere il contratto di lavoro, non imponendo termini irragionevoli di preavviso)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.4',
		name: 'III. Agire | Domanda 3.6.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa paga i lavoratori seguendo il *CCNL* applicabile?\nSe non applica un CCNL, si assicura che i compensi siano comunque *equi e sufficienti* a coprire i bisogni dei lavoratori e delle loro famiglie?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.5',
		name: 'III. Agire | Domanda 3.6.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa si assicura che anche gli intermediari e gli appaltatori (o altri fornitori rilevanti) siano pagati abbastanza per coprire i costi del lavoro e avere un margine equo?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.6',
		name: 'III. Agire | Domanda 3.6.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa paga i lavoratori con regolarità e tiene registri sulle ore lavorate e sui compensi corrisposti?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.6.7',
		name: 'III. Agire | Domanda 3.6.7',
		type: 'radiogroup' as const,
		title:
			'L’impresa firma un contratto scritto con ogni lavoratore chiaro su diritti, doveri, orari e compenso?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.7.1',
		name: 'III. Agire | Domanda 3.7.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa comunica con i rappresentanti dei lavoratori in caso di cambiamenti importanti che possono avere impatti sull’occupazione (es. chiusura di uno stabilimento, interruzione delle attività in campo)?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.7.2',
		name: 'III. Agire | Domanda 3.7.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa consulta in modo regolare i lavoratori e/o i loro rappresentanti?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.7.3',
		name: 'III. Agire | Domanda 3.7.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa condivide con i lavoratori informazioni utili per facilitare buone relazioni e negoziazioni interne?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.7.4',
		name: 'III. Agire | Domanda 3.7.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa tiene traccia del motivo per cui un contratto è stato chiuso e se il lavoratore era iscritto a un sindacato?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.8.1',
		name: 'III. Agire | Domanda 3.8.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa garantisce ai propri dipendenti la formazione per svolgere bene il loro lavoro e per crescere professionalmente?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.8.2',
		name: 'III. Agire | Domanda 3.8.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa promuove la formazione di giovani e donne per facilitarne l’accesso al lavoro o all’imprenditorialità?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.8.3',
		name: 'III. Agire | Domanda 3.8.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un piano di formazione/informazione continua sui diritti e i doveri dei lavoratori, svolto durante l’orario di lavoro retribuito?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.1',
		name: 'III. Agire | Domanda 3.9.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha adottato misure per proteggere i lavoratori da sostanze chimiche pericolose?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.2',
		name: 'III. Agire | Domanda 3.9.2',
		type: 'radiogroup' as const,
		title: 'L’impresa garantisce un uso sicuro di macchinari e attrezzature?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.3',
		name: 'III. Agire | Domanda 3.9.3',
		type: 'radiogroup' as const,
		title:
			"L’impresa fornisce i dispositivi di protezione personale (DPI) e verifica che vengano usati correttamente dai lavoratori propri/e e da quelli che operano all'interno della proprietà aziendale?",
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.4',
		name: 'III. Agire | Domanda 3.9.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha formato i lavoratori che usano sostanze o attrezzature pericolose, assicurandosi che anche chi non parla bene italiano capisca bene i rischi e le istruzioni?',
		help: 'In particolare, la formazione include indicazioni su come stoccare in maniera appropriata pesticidi e sostanze chimiche, come comprendere le etichette e istruzioni di prodotto, come gestire gli incidenti, come smaltire i contenitori vuoti, eventuali intervalli nell’utilizzo delle sostanze chimiche, attraverso istruzioni chiare, illustrate e visibili sul luogo di lavoro.',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.5',
		name: 'III. Agire | Domanda 3.9.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa fa attenzione a non usare pesticidi e sostanze chimiche a meno di 10 metri da zone frequentate da persone, a meno che ci siano barriere protettive?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.6',
		name: 'III. Agire | Domanda 3.9.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa garantisce acqua potabile e servizi igienici (separati per donne e uomini) in numero sufficiente per i lavoratori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.9.7',
		name: 'III. Agire | Domanda 3.9.7',
		type: 'radiogroup' as const,
		title:
			'L’impresa evita di assegnare lavori pericolosi a persone vulnerabili come minorenni, donne in gravidanza, disabili o lavoratori con patologie?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.10.1',
		name: 'III. Agire | Domanda 3.10.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha una policy scritta contro la violenza e la discriminazione di genere sul luogo di lavoro?',
		help: 'Una policy contro la violenza e la discriminazione di genere dovrebbe indicare chiaramente che l’impresa non tollera comportamenti violenti, offensivi o discriminatori nei confronti di donne e uomini sul posto di lavoro.\nÈ utile che l’impresa raccolga dati separati per genere (numero di lavoratori e lavoratrici, ruoli ricoperti, salari, ecc.) per capire se esistono differenze o situazioni di svantaggio.\nDovrebbe inoltre promuovere la partecipazione attiva e paritaria delle donne in momenti importanti della vita aziendale, come riunioni, consultazioni o decisioni sul lavoro.',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.10.2',
		name: 'III. Agire | Domanda 3.10.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha informato lavoratori e partner sull’esistenza della policy e ha formato il personale sui suoi contenuti?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-3.10.3',
		name: 'III. Agire | Domanda 3.10.3',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un sistema di segnalazione per casi di violenza o discriminazione di genere che garantisca riservatezza e protezione per chi segnala?',
		help: '',
		reporting: '',
		docs: '',
		section: 'III. Agire',
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
		questionId: 'assessment-4.1',
		name: 'IV. Monitorare | Domanda 4.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa verifica almeno una volta all’anno che quando scritto nelle policy (soprattutto in materia di discriminazione, violenza di genere, salute e sicurezza, lavoro forzato, lavoro minorile) venga applicato e rispettato attraverso controlli interni, colloqui con i lavoratori e sindacati?',
		help: '',
		reporting: '',
		docs: '',
		section: 'IV. Monitorare',
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
		questionId: 'assessment-4.2',
		name: 'IV. Monitorare | Domanda 4.2',
		type: 'radiogroup' as const,
		title:
			'Se le misure adottate non funzionano, l’impresa ha un processo per rivederle e migliorarle?',
		help: 'Il processo può concentrarsi su nodi chiave della filiera o "colli di bottiglia" identificando alcuni attori nella filiera sulla base di:\n- punti chiave di trasformazione nella filiera\n- punti della filiera in cui ci sono meno attori o punti di aggregazione dei prodotti\n- punti in cui le aziende che vendono o distribuiscono il prodotto finale hanno più forza o strumenti per influenzare il mercato o i fornitori\n- punti di operatività di schemi di certificazione e programmi di audit',
		reporting: '',
		docs: '',
		section: 'IV. Monitorare',
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
		questionId: 'assessment-5.1',
		name: 'V. Comunicare | Domanda 5.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa pubblica un rapporto (anche semplice) che spiega cosa fa per tutelare i diritti umani e prevenire i rischi?',
		help: '',
		reporting: '',
		docs: '',
		section: 'V. Comunicare',
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
		questionId: 'assessment-5.2',
		name: 'V. Comunicare | Domanda 5.2',
		type: 'radiogroup' as const,
		title:
			'L’impresa aggiorna periodicamente clienti, fornitori, istituzioni o comunità locali sui progressi fatti nella gestione dei rischi?',
		help: '',
		reporting: '',
		docs: '',
		section: 'V. Comunicare',
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
		questionId: 'assessment-5.3',
		name: 'V. Comunicare | Domanda 5.3',
		type: 'group' as const,
		title: 'L’impresa ha un sistema per raccogliere e comunicare dati su:',
		help: '',
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).',
		docs: '',
		section: 'V. Comunicare',
		isRequired: false,
		score: 1,
	},
	{
		questionId: 'assessment-5.3.1',
		name: 'V. Comunicare | Domanda 5.3.1',
		type: 'radiogroup' as const,
		title:
			'il numero dei dipendenti con indicazione del tipo di contratto (temporaneo o permanente), genere, paese di impiego?',
		help: '',
		reporting: '',
		docs: '',
		section: 'V. Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-5.3',
	},
	{
		questionId: 'assessment-5.3.2',
		name: 'V. Comunicare | Domanda 5.3.2',
		type: 'radiogroup' as const,
		title:
			'il numero e la percentuale di incidenti e/o malattie collegati al lavoro?',
		help: "*Come vanno calcolati?*\nSulla base del numero di incidenti per anno rendicontato / numero totale delle ore lavorate nell’anno da tutti i dipendenti x 200.000*.\n\n*200.000 è un un'unità comparativa e rappresenta il totale di ore lavorate da 100 dipendenti a tempo pieno in un anno",
		reporting: '',
		docs: '',
		section: 'V. Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-5.3',
	},
	{
		questionId: 'assessment-5.3.3',
		name: 'V. Comunicare | Domanda 5.3.3',
		type: 'radiogroup' as const,
		title:
			"l'allineamento delle paghe con i compensi minimi previsto dalla legge nazionale o dal CCNL applicabile, la percentuale di differenza della paga per genere, la percentuale di dipendenti coperti da CCNL, il numero medio di ore di formazione per dipendente diviso per genere?",
		help: '',
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).\n[cfr. formule par. 200 e 203 VSMEs per calcolare inserire in box]',
		docs: '',
		section: 'V. Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-5.3',
	},
	{
		questionId: 'assessment-5.3.4',
		name: 'V. Comunicare | Domanda 5.3.4',
		type: 'radiogroup' as const,
		title:
			'la presenza di eventuali incidenti gravi confermati oppure denunce o reclami ricevuti, irregolarità accertate tramite controlli, o altre segnalazioni formali.',
		help: 'Il sistema dovrebbe anche documentare quali azioni sono state intraprese dall’impresa per affrontare questi problemi.\nQuesto vale sia per episodi che coinvolgono direttamente i lavoratori dell’azienda, sia per fatti noti che riguardano fornitori, clienti, comunità locali o consumatori.',
		reporting: '',
		docs: '',
		section: 'V. Comunicare',
		choices: [
			'Non adottato',
			'Parzialmente adottato',
			'Totalmente adottato',
			'Non applicabile',
		],
		isRequired: false,
		score: 1,
		parentQuestionId: 'assessment-5.3',
	},
	{
		questionId: 'assessment-6.1',
		name: 'VI. Rimediare | Domanda 6.1',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha un sistema (documentato) per permettere ai lavoratori di segnalare problemi legati ai diritti umani?',
		help: 'Occorre dare la possibilità ai lavoratori di *accedere a meccanismi di reclamo in modo riservato*.\nLe segnalazioni possono essere inviate:\n- per iscritto o a voce a un rappresentante dei lavoratori formato e fidato\n- attraverso i referenti dei dipendenti, come ad esempio supervisori, dirigenti, risorse\numane, ecc.\n- in una cassetta dei suggerimenti disponibile presso i luoghi di lavoro\n- attraverso applicazioni telefoniche, risposte vocali interattive o applicazioni mobili\n- con una linea di assistenza indipendente, specializzata, multilingue, confidenziale ed\nanonima\n\n*Esempi di reclami/segnalazioni* possono riguardare questioni come violenza, comportamenti abusivi, bullismo, intimidazione, corruzione, discriminazione, molestie, vittimizzazione, spese di assunzione, alloggio inadeguato, lavoro forzato e sfruttamento del lavoro. \nPossono concernere anche la violenza e le molestie di genere, compresa la violenza verbale, fisica e sessuale.',
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).\nParagrafo 61',
		docs: '[Allegato 8c | Piano di risposta e rimedio in caso di sfruttamento](../downloads/8c-risposta-rimedio.pdf)',
		section: 'VI. Rimediare',
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
		questionId: 'assessment-6.2',
		name: 'VI. Rimediare | Domanda 6.2',
		type: 'radiogroup' as const,
		title:
			"Il sistema di reclamo è accessibile anche ad altri soggetti esterni che possono subire danni o conseguenze negative dalle attività dell'impresa (es. fornitori, comunità)?",
		help: '',
		reporting: '',
		docs: '',
		section: 'VI. Rimediare',
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
		questionId: 'assessment-6.3',
		name: 'VI. Rimediare | Domanda 6.3',
		type: 'radiogroup' as const,
		title:
			'Il sistema garantisce anonimato, accessibilità e protezione per chi segnala?',
		help: "L'impresa dovrebbe inoltre prevedere l'esistenza di un garante esterno all'impresa. \n*Chi può fare da garante?*\n- consulente del lavoro o commercialista di fiducia dell’azienda \n- associazione agricola di categoria se offre uno sportello o funzione di mediazione indipendente\n- rappresentante sindacale territoriale (anche per lavoratori stranieri), se disponibile e riconosciuto da ambo le parti\n- organizzazioni del terzo settore attive sul territorio in tutela di lavoratori o migranti (es. cooperative sociali, sportelli diritti)\n- mediatore culturale o volontario di una associazione di supporto ai braccianti o ai migranti\n- organismo paritetico o ente bilaterale agricolo provinciale, se attivo sul territorio",
		reporting: '',
		docs: '',
		section: 'VI. Rimediare',
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
		questionId: 'assessment-6.4',
		name: 'VI. Rimediare | Domanda 6.4',
		type: 'radiogroup' as const,
		title:
			'L’impresa tiene un registro delle segnalazioni e aggiorna i propri documenti in base ai problemi emersi?',
		help: '',
		reporting: '',
		docs: '',
		section: 'VI. Rimediare',
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
		questionId: 'assessment-6.5',
		name: 'VI. Rimediare | Domanda 6.5',
		type: 'radiogroup' as const,
		title:
			'L’impresa ha una procedura per gestire i reclami ricevuti legati ai diritti dei lavoratori?',
		help: '',
		reporting:
			'Requisito previsto dal report di sostenibilità Voluntary reporting standard for SMEs (VSME).\nParagrafo 61',
		docs: '',
		section: 'VI. Rimediare',
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
		questionId: 'assessment-6.6',
		name: 'VI. Rimediare | Domanda 6.6',
		type: 'radiogroup' as const,
		title:
			'L’impresa collabora con le autorità se vengono riscontrate irregolarità nei propri processi o in quelli dei suoi fornitori?',
		help: '',
		reporting: '',
		docs: '',
		section: 'VI. Rimediare',
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
