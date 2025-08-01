/**
 * @fileoverview Demo Assessment Questions Configuration
 * 
 * This file contains 25 demo questions across all 7 ESG sections for the
 * standalone demo experience. Generated automatically from Excel data.
 * 
 * DO NOT EDIT MANUALLY - Use 'npm run import-demo-questions' to regenerate
 */

export interface DemoQuestionConfig {
  questionId: string
  name: string
  type: 'radiogroup' | 'text'
  title: string
  help: string
  reporting: string
  docs: string
  section: string
  choices?: Array<{ value: string; text: string }>
  isRequired: boolean
  score: number
}

// Generated demo questions - do not edit manually
export const demoAssessmentQuestions: DemoQuestionConfig[] = [
	{
		questionId: 'demo-000-01',
		name: 'company_info',
		type: 'text' as const,
		title: 'Informazioni sulla tua azienda: settore di attività, dimensioni e struttura organizzativa',
		help: 'Fornisci una breve descrizione del settore in cui opera la tua azienda, le dimensioni approssimative (numero di dipendenti, fatturato) e la struttura organizzativa generale.',
		reporting: 'Queste informazioni sono essenziali per contestualizzare la valutazione ESG rispetto al settore e alle caratteristiche specifiche dell\'azienda.',
		docs: 'Consulta la documentazione aziendale standard per le informazioni di base sull\'organizzazione.',
		section: 'SEZIONE 0',
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-000-02',
		name: 'sustainability_commitment',
		type: 'radiogroup' as const,
		title: 'La vostra azienda ha un impegno formale documentato verso la sostenibilità e la responsabilità sociale?',
		help: 'Un impegno formale può includere una politica di sostenibilità, una dichiarazione di responsabilità sociale d\'impresa, o l\'adesione a standard internazionali.',
		reporting: 'Documenta l\'esistenza di politiche formali e la loro integrazione nella strategia aziendale.',
		docs: 'Esempi: UN Global Compact, GRI Standards, ISO 26000',
		section: 'SEZIONE 0',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-001-01',
		name: 'due_diligence_policy',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha adottato una politica per la due diligence sui diritti umani?',
		help: 'Una politica di due diligence stabilisce l\'impegno dell\'azienda a identificare, prevenire e mitigare gli impatti negativi sui diritti umani.',
		reporting: 'Richiesta dalle Linee Guida OCSE e dai Principi Guida ONU su Imprese e Diritti Umani.',
		docs: 'Vedi: UN Guiding Principles on Business and Human Rights, OECD Guidelines',
		section: 'SEZIONE I',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-001-02',
		name: 'board_oversight',
		type: 'radiogroup' as const,
		title: 'Il Consiglio di Amministrazione o l\'organo di governo supervisiona la gestione dei rischi ESG?',
		help: 'La supervisione a livello di governance assicura che i temi ESG siano integrati nella strategia aziendale e nel processo decisionale.',
		reporting: 'Documenta il coinvolgimento degli organi di governo nella gestione dei rischi ESG.',
		docs: 'Standard di riferimento: ISO 31000, COSO Framework',
		section: 'SEZIONE I',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-001-03',
		name: 'stakeholder_engagement',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha implementato processi strutturati di coinvolgimento degli stakeholder?',
		help: 'Il coinvolgimento degli stakeholder include consultazioni regolari con parti interessate interne ed esterne per identificare aspettative e preoccupazioni.',
		reporting: 'Documenta le modalità e la frequenza del coinvolgimento degli stakeholder.',
		docs: 'Standard AA1000 Stakeholder Engagement Standard',
		section: 'SEZIONE I',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-001-04',
		name: 'training_programs',
		type: 'radiogroup' as const,
		title: 'Sono previsti programmi di formazione sui diritti umani per i dipendenti?',
		help: 'La formazione deve coprire i principi dei diritti umani rilevanti per l\'attività aziendale e le responsabilità dei dipendenti.',
		reporting: 'Documenta la copertura, frequenza e contenuti dei programmi formativi.',
		docs: 'Riferimento: UN Global Compact Learning Platform',
		section: 'SEZIONE I',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-002-01',
		name: 'risk_assessment_process',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha implementato un processo sistematico di valutazione dei rischi ESG?',
		help: 'Un processo sistematico include metodologie standardizzate per identificare, valutare e prioritizzare i rischi ESG.',
		reporting: 'Descrivi la metodologia utilizzata e la frequenza delle valutazioni.',
		docs: 'ISO 31000, COSO ERM Framework, TCFD Recommendations',
		section: 'SEZIONE II',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-002-02',
		name: 'supply_chain_mapping',
		type: 'radiogroup' as const,
		title: 'È stata effettuata una mappatura dei fornitori e partner commerciali critici?',
		help: 'La mappatura identifica i fornitori chiave e valuta i relativi rischi ESG nella catena di fornitura.',
		reporting: 'Documenta l\'ampiezza della mappatura e i criteri di criticità utilizzati.',
		docs: 'Supply Chain Due Diligence Guidelines, OECD Due Diligence Guidance',
		section: 'SEZIONE II',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-002-03',
		name: 'geographic_risk_analysis',
		type: 'radiogroup' as const,
		title: 'L\'azienda analizza i rischi ESG specifici per le aree geografiche di operazione?',
		help: 'L\'analisi geografica considera i rischi paese, la stabilità politica, i framework normativi e le condizioni socio-economiche locali.',
		reporting: 'Specifica le metodologie utilizzate per l\'analisi geografica dei rischi.',
		docs: 'Country Risk Assessments, Political Risk Insurance Guidelines',
		section: 'SEZIONE II',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-002-04',
		name: 'impact_assessment',
		type: 'radiogroup' as const,
		title: 'Vengono condotte valutazioni d\'impatto per i progetti significativi?',
		help: 'Le valutazioni d\'impatto analizzano gli effetti potenziali di progetti, investimenti o attività sui diritti umani e l\'ambiente.',
		reporting: 'Documenta la tipologia di progetti soggetti a valutazione e le metodologie utilizzate.',
		docs: 'Environmental and Social Impact Assessment (ESIA), Human Rights Impact Assessment (HRIA)',
		section: 'SEZIONE II',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-01',
		name: 'preventive_measures',
		type: 'radiogroup' as const,
		title: 'Sono state implementate misure preventive per i rischi ESG identificati?',
		help: 'Le misure preventive includono politiche, procedure, controlli e sistemi per prevenire il verificarsi di impatti negativi.',
		reporting: 'Specifica le tipologie di misure implementate e la loro copertura.',
		docs: 'Risk Management Standards, Internal Control Frameworks',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-02',
		name: 'supplier_requirements',
		type: 'radiogroup' as const,
		title: 'I contratti con fornitori includono clausole specifiche sui diritti umani e sostenibilità?',
		help: 'Le clausole contrattuali stabiliscono requisiti vincolanti per i fornitori in materia di diritti umani, lavoro e ambiente.',
		reporting: 'Documenta la tipologia di clausole utilizzate e la percentuale di contratti che le includono.',
		docs: 'Supplier Code of Conduct Templates, UN Global Compact Supply Chain Sustainability',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-03',
		name: 'employee_rights',
		type: 'radiogroup' as const,
		title: 'Sono garantiti i diritti fondamentali dei lavoratori (libertà di associazione, non discriminazione, salario equo)?',
		help: 'I diritti fondamentali includono quelli riconosciuti dalle convenzioni ILO e dalla Dichiarazione Universale dei Diritti Umani.',
		reporting: 'Documenta le politiche implementate e i meccanismi di garanzia dei diritti.',
		docs: 'ILO Core Conventions, UN Universal Declaration of Human Rights',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-04',
		name: 'environmental_management',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha implementato un sistema di gestione ambientale?',
		help: 'Un sistema di gestione ambientale struttura l\'approccio dell\'azienda alla gestione degli impatti ambientali.',
		reporting: 'Specifica se il sistema è certificato e secondo quali standard.',
		docs: 'ISO 14001, EMAS (Eco-Management and Audit Scheme)',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-05',
		name: 'data_protection',
		type: 'radiogroup' as const,
		title: 'Sono implementate misure di protezione dei dati personali e privacy?',
		help: 'Le misure includono politiche, procedure tecniche e organizzative per la protezione dei dati personali.',
		reporting: 'Documenta la conformità alle normative applicabili (GDPR, normative locali).',
		docs: 'GDPR, ISO 27001, Privacy by Design Principles',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-003-06',
		name: 'community_development',
		type: 'radiogroup' as const,
		title: 'L\'azienda contribuisce allo sviluppo delle comunità locali dove opera?',
		help: 'Il contributo può includere programmi di sviluppo, investimenti sociali, creazione di opportunità locali.',
		reporting: 'Descrivi i programmi implementati e il loro impatto misurato.',
		docs: 'Community Development Guidelines, Social Investment Frameworks',
		section: 'SEZIONE III',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-004-01',
		name: 'monitoring_system',
		type: 'radiogroup' as const,
		title: 'È operativo un sistema di monitoraggio dell\'efficacia delle misure ESG implementate?',
		help: 'Il sistema di monitoraggio include KPI, metriche di performance e revisioni periodiche dell\'efficacia delle misure.',
		reporting: 'Specifica gli indicatori utilizzati e la frequenza del monitoraggio.',
		docs: 'KPI Frameworks, Balanced Scorecard, ESG Reporting Standards',
		section: 'SEZIONE IV',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-004-02',
		name: 'third_party_audits',
		type: 'radiogroup' as const,
		title: 'Vengono condotti audit o verifiche da parte terza sulle performance ESG?',
		help: 'Gli audit di terza parte forniscono una valutazione indipendente dell\'efficacia dei sistemi e delle pratiche ESG.',
		reporting: 'Documenta la frequenza degli audit e le tipologie di verifiche condotte.',
		docs: 'Third-party Audit Standards, ESG Assurance Guidelines',
		section: 'SEZIONE IV',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-005-01',
		name: 'esg_reporting',
		type: 'radiogroup' as const,
		title: 'L\'azienda pubblica report di sostenibilità o ESG?',
		help: 'I report di sostenibilità comunicano le performance ESG dell\'azienda agli stakeholder seguendo standard riconosciuti.',
		reporting: 'Specifica la frequenza di pubblicazione e gli standard utilizzati (GRI, SASB, TCFD).',
		docs: 'GRI Standards, SASB Standards, TCFD Framework, EU Taxonomy',
		section: 'SEZIONE V',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-005-02',
		name: 'stakeholder_communication',
		type: 'radiogroup' as const,
		title: 'Esiste un piano di comunicazione strutturato verso gli stakeholder sui temi ESG?',
		help: 'Il piano include canali di comunicazione, frequenza, contenuti e target di stakeholder per la comunicazione ESG.',
		reporting: 'Documenta i canali utilizzati e la copertura degli stakeholder.',
		docs: 'Stakeholder Communication Best Practices, Integrated Reporting Framework',
		section: 'SEZIONE V',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-005-03',
		name: 'transparency_policy',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha adottato una politica di trasparenza per la divulgazione di informazioni ESG?',
		help: 'La politica definisce criteri, tempi e modalità per la divulgazione di informazioni rilevanti sui temi ESG.',
		reporting: 'Specifica i principi di trasparenza adottati e le procedure di divulgazione.',
		docs: 'Transparency Guidelines, Disclosure Frameworks, Materiality Assessment',
		section: 'SEZIONE V',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-005-04',
		name: 'public_commitments',
		type: 'radiogroup' as const,
		title: 'L\'azienda ha assunto impegni pubblici su target ESG specifici e verificabili?',
		help: 'Gli impegni pubblici includono target quantitativi con scadenze definite su temi come emissioni, diversità, diritti umani.',
		reporting: 'Documenta gli impegni assunti, i target specifici e i progressi verso il raggiungimento.',
		docs: 'Science-Based Targets, Net Zero Commitments, UN Global Compact',
		section: 'SEZIONE V',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-006-01',
		name: 'grievance_mechanism',
		type: 'radiogroup' as const,
		title: 'È operativo un meccanismo di reclamo accessibile per segnalare violazioni dei diritti umani?',
		help: 'Il meccanismo deve essere facilmente accessibile, riservato, imparziale e fornire risposte tempestive alle segnalazioni.',
		reporting: 'Descrivi le modalità di accesso, i tempi di risposta e le garanzie di riservatezza.',
		docs: 'UN Guiding Principles Effectiveness Criteria, Grievance Mechanism Guidelines',
		section: 'SEZIONE VI',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-006-02',
		name: 'remediation_process',
		type: 'radiogroup' as const,
		title: 'Sono definiti processi per la rimediazione in caso di impatti negativi identificati?',
		help: 'I processi di rimediazione includono investigazione, azioni correttive, riparazione del danno e misure per prevenire la ricorrenza.',
		reporting: 'Documenta le procedure per la gestione dei casi e i tempi standard di risoluzione.',
		docs: 'Remediation Guidelines, Corrective Action Procedures',
		section: 'SEZIONE VI',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	},
	{
		questionId: 'demo-006-03',
		name: 'continuous_improvement',
		type: 'radiogroup' as const,
		title: 'L\'azienda implementa processi di miglioramento continuo basati sui feedback ricevuti?',
		help: 'Il miglioramento continuo include l\'analisi sistematica dei feedback, l\'aggiornamento di politiche e procedure, e la formazione.',
		reporting: 'Descrivi come i feedback vengono analizzati e integrati nei processi aziendali.',
		docs: 'Continuous Improvement Frameworks, PDCA Cycle, Kaizen Principles',
		section: 'SEZIONE VI',
		choices: [
			{ value: 'non adottato', text: 'Non adottato' },
			{ value: 'parzialmente adottato', text: 'Parzialmente adottato' },
			{ value: 'totalmente adottato', text: 'Totalmente adottato' },
			{ value: 'non applicabile', text: 'Non applicabile' }
		],
		isRequired: true,
		score: 1
	}
] as const

/**
 * Convert demo questions to SurveyJS format
 */
export function convertDemoToSurveyJsFormat(questions: typeof demoAssessmentQuestions) {
  const surveyConfig = {
	title: 'ESG Assessment Demo',
	description: 'Experience our ESG assessment with 25 sample questions',
	logoPosition: 'right',
	showProgressBar: 'bottom',
	progressBarType: 'questions',
	showQuestionNumbers: 'off',
	showNavigationButtons: 'bottom',
	goNextPageAutomatic: false,
	allowCompleteSurveyAutomatic: false,
	showTitle: false,
	focusFirstQuestionAutomatic: false,
	pages: [] as any[]
  }


  // One question per page: each question gets its own page
  questions.forEach(function(question, idx) {
	const page = {
	  name: (question.section ? question.section.toLowerCase().replace(/s+/g, '_') : 'section') + '_' + (idx + 1),
	  title: question.section,
	  elements: [] as any[]
	};

	const element: any = {
	  type: question.type === 'text' ? 'text' : 'radiogroup',
	  name: question.name,
	  title: question.title,
	  isRequired: question.isRequired
	};

	if (question.type === 'radiogroup' && question.choices.length > 0) {
	  element.choices = question.choices;
	}
	
	// Add accordion content for the survey component
	if (question.help) {
	  element.help = question.help;
	}
	if (question.reporting) {
	  element.reporting = question.reporting;
	}
	if (question.docs) {
	  element.docs = question.docs;
	}

	page.elements.push(element);
	surveyConfig.pages.push(page);
  });

  return surveyConfig
}

/**
 * Get only the answerable questions (excludes umbrella/group questions)
 */
export function getDemoAnswerableQuestions() {
  return demoAssessmentQuestions.filter(q => q.type !== 'group')
}

/**
 * Get questions by section
 */
export function getDemoQuestionsBySection(section: string) {
  return demoAssessmentQuestions.filter(q => q.section === section)
}

/**
 * Get total number of answerable questions
 */
export function getDemoAnswerableQuestionsCount() {
  return getDemoAnswerableQuestions().length
}
