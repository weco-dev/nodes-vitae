/**
 * @fileoverview Demo Assessment Questions Configuration
 *
 * This file contains 25 demo questions across all 7 ESG sections for the
 * standalone demo experience. Generated automatically from Excel data.
 *
 * DO NOT EDIT MANUALLY - Use 'npm run import-demo-questions' to regenerate
 */

import { demoRadio01, demoRadio02 } from "./assessment/radiogroup-answers"

export interface DemoQuestionConfig {
	questionId: string
	name: string
	type: 'radiogroup' | 'text' | 'group'
	title: string
	help?: string
	reporting?: string
	docs?: string
	section: string
	choices?: Array<{ value: string; text: string }>
	isRequired: boolean
	score: number
}

// Generated demo questions - do not edit manually
export const demoAssessmentQuestions: DemoQuestionConfig[] = [
	{
		questionId: 'demo-01-01',
		name: 'I. Documentazione e trasparenza | Domanda 1.1',
		type: 'radiogroup' as const,
		title:
			`Conosci i nomi delle persone che hanno lavorato per te (anche se dipendenti di cooperative)?`,
		section: 'I. Documentazione e trasparenza',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-01-02',
		name: 'I. Documentazione e trasparenza | Domanda 1.1',
		type: 'radiogroup' as const,
		title:
			`Sai quali documenti ha firmato ciascun lavoratore e se le condizioni di contratto sono spiegate in modo comprensibile per chi non parla italiano?`,
		section: 'I. Documentazione e trasparenza',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-02-01',
		name: 'II. Orari e stagionalità | Domanda 2.1',
		type: 'radiogroup' as const,
		title:
			`In certi periodi di raccolta può capitare che i lavoratori superino le 8 ore al giorno. Ti sei mai accertato se sanno esattamente quanto devono lavorare e quanto devono essere pagati per eventuali straordinari?`,
		section: 'II. Orari e stagionalità',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-03-01',
		name: 'III. Reclami e problemi interni | Domanda 3.1',
		type: 'radiogroup' as const,
		title:
			`Se un lavoratore avesse un problema (es. paga, alloggio, disagio con un caposquadra), saprebbe a chi rivolgersi e sentirebbe di poterlo fare senza timore?`,
		section: 'III. Reclami e problemi interni',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-04-01',
		name: 'IV. Sicurrezza | Domanda 4.1',
		type: 'radiogroup' as const,
		title:
			`Ti accerti che i lavoratori che arrivano nella tua azienda abbiano/indossino i dispositivi di sicurezza (guanti, occhiali o visiera, elmetto, tuta da lavoro, calzature di sicurezza)?`,
		section: 'IV. Sicurrezza',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-04-02',
		name: 'IV. Sicurrezza | Domanda 4.2',
		type: 'radiogroup' as const,
		title:
			`Sei consapevole dei vantaggi che avresti nel promuovere un ambiente di lavoro più sicuro e stabile? Come ad esempio la riduzione del turnover del personale, l'aumento di l’efficienza produttiva e un impatto positivo sulla sostenibilità economica del territorio.`,
		section: 'IV. Sicurrezza',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-05-01',
		name: 'V. Vita fuori dal campo | Domanda 5.1',
		type: 'radiogroup' as const,
		title:
			`Sai in che condizioni vivono i lavoratori stagionali quando non sono nei campi? Hanno accesso ad acqua, bagni, una doccia, un posto dignitoso dove stare?`,
		section: 'V. Vita fuori dal campo',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-05-02',
		name: 'V. Vita fuori dal campo | Domanda 5.1',
		type: 'radiogroup' as const,
		title:
			`Sei a conoscenza e puoi indicare quali mezzi di trasporto abbiano usato le persone che hanno lavorato o lavorano per te nel 2025?`,
		section: 'V. Vita fuori dal campo',
		choices: demoRadio01,
		isRequired: true,
		score: 1,
	},
	// {
	// 	questionId: 'demo-06-01',
	// 	name: 'VI. Vantaggi | Domanda 6.1',
	// 	type: 'group' as const,
	// 	title:
	// 		`Riconosci i vantaggi di un percorso mirato al miglioramento della condotta responsabile della tua impresa? Quanto è importante per la tua azienda:`,
	// 	section: 'VI. Vantaggi',
	// 	choices: demoRadio01,
	// 	isRequired: true,
	// 	score: 1,
	// },
	{
		questionId: 'demo-06-01-01',
		name: 'VI. Vantaggi | Domanda 6.1.1',
		type: 'radiogroup' as const,
		title:
			`Quanto è importante per la tua azienda: Prevenire il rischio di sanzioni legali legate a situazioni di sfruttamento lavorativo, anche quando queste coinvolgono fornitori esterni o intermediari di manodopera?`,
		section: 'VI. Vantaggi',
		choices: demoRadio02,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-06-01-02',
		name: 'VI. Vantaggi | Domanda 6.1.2',
		type: 'radiogroup' as const,
		title:
			`Quanto è importante per la tua azienda: Rispondere in modo efficace alle richieste di trasparenza di acquirenti nazionali e internazionali, così come alle aspettative di trasparenza dei consumatori finali?`,
		section: 'VI. Vantaggi',
		choices: demoRadio02,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-06-01-03',
		name: 'VI. Vantaggi | Domanda 6.1.3',
		type: 'radiogroup' as const,
		title:
			`Quanto è importante per la tua azienda: Tutelare la reputazione aziendale, prevenendo danni d’immagine e rafforzando la percezione positiva da parte di clienti, partner e istituzioni?`,
		section: 'VI. Vantaggi',
		choices: demoRadio02,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-06-01-04',
		name: 'VI. Vantaggi | Domanda 6.1.4',
		type: 'radiogroup' as const,
		title:
			`Adottare pratiche organizzative che facilitano il raggiungimento degli standard richiesti dalle principali certificazioni di settore, come Equalitas?`,
		section: 'VI. Vantaggi',
		choices: demoRadio02,
		isRequired: true,
		score: 1,
	},
	{
		questionId: 'demo-06-01-05',
		name: 'VI. Vantaggi | Domanda 6.1.5',
		type: 'radiogroup' as const,
		title:
			`Contrastare la concorrenza sleale da parte di aziende che basano i loro prezzi su pratiche di sfruttamento, tutelando così il valore del lavoro regolare e la competitività delle imprese virtuose?`,
		section: 'VI. Vantaggi',
		choices: demoRadio02,
		isRequired: true,
		score: 1,
	},
	
] as const

/**
 * Convert demo questions to SurveyJS format
 */
export function convertDemoToSurveyJsFormat(
	questions: typeof demoAssessmentQuestions,
) {
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
		pages: [] as any[],
	}

	// One question per page: each question gets its own page
	questions.forEach(function (question, idx) {
		const page = {
			name:
				(question.section
					? question.section.toLowerCase().replace(/s+/g, '_')
					: 'section') +
				'_' +
				(idx + 1),
			title: question.section,
			elements: [] as any[],
		}

		const element: any = {
			type: question.type === 'text' ? 'text' : 'radiogroup',
			name: question.name,
			title: question.title,
			isRequired: question.isRequired,
		}

		if (
			question.type === 'radiogroup' &&
			question.choices &&
			question.choices.length > 0
		) {
			element.choices = question.choices
		}

		// Add accordion content for the survey component
		if (question.help) {
			element.help = question.help
		}
		if (question.reporting) {
			element.reporting = question.reporting
		}
		if (question.docs) {
			element.docs = question.docs
		}

		page.elements.push(element)
		surveyConfig.pages.push(page)
	})

	return surveyConfig
}

/**
 * Get only the answerable questions (excludes umbrella/group questions)
 */
export function getDemoAnswerableQuestions() {
	//return demoAssessmentQuestions
	return demoAssessmentQuestions.filter(question => 
		question.type !== 'group'  // Exclude group/umbrella questions
	)
}

/**
 * Get questions by section
 */
export function getDemoQuestionsBySection(section: string) {
	return demoAssessmentQuestions.filter((q) => q.section === section)
}

/**
 * Get total number of answerable questions
 */
export function getDemoAnswerableQuestionsCount() {
	return getDemoAnswerableQuestions().length
}