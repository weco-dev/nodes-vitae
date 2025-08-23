/**
 * @fileoverview Demo Questions Import Script
 * 
interface DemoQuestion {
  questionId: string
  name: string
  type: 'radiogroup' | 'text'
  title: string
  help: string
  reporting: string
  docs: string
  section: string
  choices: string[]
  isRequired: boolean
  score: number
} imports ESG assessment demo questions from Excel files and generates
 * TypeScript configuration files for use in the demo assessment system.
 * 
 * Based on the main import-questions.ts but adapted for demo purposes with:
 * - 25 questions across all 7 ESG sections
 * - Simplified choices (Sì/No for radiogroup questions)
 * - localStorage-friendly data structure
 * - Separate demo questions file generation
 * - Full support for accordion system (help, reporting, docs fields)
 * - Markdown support in question titles and content
 * 
 * USAGE: npm run import-demo-questions
 * INPUT: data/uploads/demo-assessment-questions.xlsx
 * OUTPUT: app/utils/demo-questions.ts
 */

import * as fs from 'fs'
import { join } from 'path'
import XLSX from 'xlsx'

// Constants
const DEFAULT_RADIOGROUP_CHOICES = [
	'Non adottato',
	'Parzialmente adottato',
	'Totalmente adottato',
	'Non applicabile',
]
const EXCEL_FILE_PATH = join(
	process.cwd(),
	'data/uploads/demo-assessment-questions.xlsx',
)
const OUTPUT_FILE_PATH = join(process.cwd(), 'app/utils/demo-questions.ts')

// Excel column name constants for validation and mapping
const EXCEL_COLUMNS = {
	QUESTION_ID: 'questionId',
	NAME: 'name',
	TYPE: 'type',
	TITLE: 'title',
	HELP: 'help',
	REPORTING: 'reporting',
	DOCS: 'docs',
	SECTION: 'section',
	CHOICES: 'choices',
	IS_REQUIRED: 'isRequired',
	SCORE: 'score',
	IGNORE: 'ignore',
	PARENT_QUESTION_ID: 'parentQuestionId',
} as const

// Interfaces
interface ExcelRow {
	[key: string]: any
}

interface DemoQuestion {
	questionId: string
	name: string
	type: 'radiogroup' | 'text' | 'group'
	title: string
	help?: string
	reporting?: string
	docs?: string
	section: string
	choices: string[]
	isRequired: boolean
	score: number
	parentQuestionId?: string
}

// Helper Functions
function sanitizeString(str: string): string {
	if (!str) return ''
	return str
		.replace(/\r\n/g, ' ')
		.replace(/\n/g, ' ')
		.replace(/\r/g, ' ')
		.replace(/\t/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

function sanitizeMarkdownString(str: string): string {
	if (!str) return ''
	return str
		.replace(/\r\n/g, '\n') // Convert Windows line endings to Unix
		.replace(/\r/g, '\n') // Convert Mac line endings to Unix
		.replace(/\t/g, ' ') // Convert tabs to spaces
		.trim()
}

function processChoices(type: string): string[] {
	// For demo, we only support text and radiogroup questions (no group/umbrella questions)
	if (type === 'group') {
		console.warn(
			'⚠️  Group/umbrella questions are not supported in demo mode and will be filtered out',
		)
		return []
	}

	if (type === 'text') {
		return []
	}

	// For demo, always use the fixed Italian choices for radiogroup
	if (type === 'radiogroup') {
		return DEFAULT_RADIOGROUP_CHOICES
	}

	return []
}

function mapExcelRowToStandardRow(row: ExcelRow): any {
	return {
		questionId: sanitizeString(row[EXCEL_COLUMNS.QUESTION_ID]),
		name: sanitizeString(row[EXCEL_COLUMNS.NAME]),
		type: row[EXCEL_COLUMNS.TYPE],
		title: sanitizeMarkdownString(row[EXCEL_COLUMNS.TITLE]),
		help: sanitizeMarkdownString(row[EXCEL_COLUMNS.HELP] || ''),
		reporting: sanitizeMarkdownString(row[EXCEL_COLUMNS.REPORTING] || ''),
		docs: sanitizeMarkdownString(row[EXCEL_COLUMNS.DOCS] || ''),
		section: sanitizeString(row[EXCEL_COLUMNS.SECTION]),
		choices: sanitizeString(row[EXCEL_COLUMNS.CHOICES] || ''),
		isRequired: row[EXCEL_COLUMNS.IS_REQUIRED],
		score: row[EXCEL_COLUMNS.SCORE] || 0,
		ignore: row[EXCEL_COLUMNS.IGNORE] || false,
		parentQuestionId: sanitizeString(
			row[EXCEL_COLUMNS.PARENT_QUESTION_ID] || '',
		),
	}
}

function validateQuestion(row: any, index: number): string[] {
	const errors: string[] = []
	const rowNum = index + 2 // Excel rows start at 1, plus header row

	if (!row.questionId) errors.push(`Row ${rowNum}: Missing questionId`)
	if (!row.name) errors.push(`Row ${rowNum}: Missing name`)
	if (!row.type) errors.push(`Row ${rowNum}: Missing type`)
	if (!row.title) errors.push(`Row ${rowNum}: Missing title`)
	if (!row.section) errors.push(`Row ${rowNum}: Missing section`)
	if (row.isRequired === undefined)
		errors.push(`Row ${rowNum}: Missing isRequired`)
	if (row.score === undefined || isNaN(row.score))
		errors.push(`Row ${rowNum}: Invalid score`)

	// For demo, only allow radiogroup and text types (no group/umbrella questions)
	if (row.type && !['radiogroup', 'text'].includes(row.type)) {
		if (row.type === 'group') {
			console.warn(
				`⚠️  Row ${rowNum}: Group/umbrella question '${row.questionId}' will be filtered out for demo`,
			)
		} else {
			errors.push(
				`Row ${rowNum}: Invalid type '${row.type}'. Demo only supports 'radiogroup' and 'text'`,
			)
		}
	}

	return errors
}

function generateTypeScriptFile(questions: DemoQuestion[]): string {
	// Helper function to safely escape strings for TypeScript
	function escapeString(str: string): string {
		return str
			.replace(/\\/g, '\\\\') // Escape backslashes first
			.replace(/'/g, "\\'") // Escape single quotes
			.replace(/\n/g, '\\n') // Escape newlines
			.replace(/\r/g, '\\r') // Escape carriage returns
			.replace(/\t/g, '\\t') // Escape tabs
	}

	// Helper function to escape markdown strings (preserves newlines)
	function escapeMarkdownString(str: string): string {
		return str
			.replace(/\\/g, '\\\\') // Escape backslashes first
			.replace(/'/g, "\\'") // Escape single quotes
			.replace(/\n/g, '\\n') // Escape newlines for JavaScript string literals
	}

	// Helper function to generate optional string field
	function generateOptionalField(
		fieldName: string,
		value?: string,
		isMarkdown: boolean = false,
	): string {
		if (!value || value.trim() === '') {
			return `\t\t${fieldName}: '',`
		}
		const escapedValue = isMarkdown
			? escapeMarkdownString(value)
			: escapeString(value)
		return `\t\t${fieldName}: '${escapedValue}',`
	}

	// Generate TypeScript object literals manually for safety
	const questionsArray = questions
		.map((q) => {
			const choices =
				q.choices.length > 0
					? q.choices
							.map(
								(c) =>
									`\t\t\t{ value: '${escapeString(c.toLowerCase())}', text: '${escapeString(c)}' }`,
							)
							.join(',\n')
					: ''

			// Build the question object with conditional fields
			let questionObject = `\t{
\t\tquestionId: '${escapeString(q.questionId)}',
\t\tname: '${escapeString(q.name)}',
\t\ttype: '${q.type}' as const,
\t\ttitle: '${escapeMarkdownString(q.title)}',
${generateOptionalField('help', q.help, true)}
${generateOptionalField('reporting', q.reporting, true)}
${generateOptionalField('docs', q.docs, true)}
\t\tsection: '${escapeString(q.section)}',`

			// Add choices array only for question types that need it
			if (q.type !== 'group' && q.choices.length > 0) {
				questionObject += `\n\t\tchoices: [${choices ? '\n' + choices + '\n\t\t' : ''}],`
			}

			questionObject += `
\t\tisRequired: ${q.isRequired},
\t\tscore: ${q.score}
\t}`

			return questionObject
		})
		.join(',\n')

	// Generate the complete TypeScript file
	return `/**
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
${questionsArray}
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
	  name: (question.section ? question.section.toLowerCase().replace(/\s+/g, '_') : 'section') + '_' + (idx + 1),
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
`
}

// Main import function
async function importDemoQuestions() {
	console.log('🚀 Starting demo questions import process...\n')

	try {
		// Check if Excel file exists
		if (!fs.existsSync(EXCEL_FILE_PATH)) {
			throw new Error(`Excel file not found at: ${EXCEL_FILE_PATH}`)
		}

		// Read Excel file
		console.log('📖 Reading demo Excel file...')
		const workbook = XLSX.readFile(EXCEL_FILE_PATH)
		const sheetName = workbook.SheetNames[0]
		if (!sheetName) {
			throw new Error('No sheets found in the Excel file')
		}
		const worksheet = workbook.Sheets[sheetName]
		if (!worksheet) {
			throw new Error(`Worksheet '${sheetName}' not found in the Excel file`)
		}
		const rawData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet)

		console.log(`✅ Found ${rawData.length} rows in demo Excel\n`)

		// Process and validate data
		const questions: DemoQuestion[] = []
		const skippedQuestions: string[] = []
		const validationErrors: string[] = []
		const questionIds = new Set<string>()

		rawData.forEach((row, index) => {
			// Map Excel row to standard format
			const mappedRow = mapExcelRowToStandardRow(row)

			// Skip if ignore is true
			if (mappedRow.ignore === true) {
				skippedQuestions.push(
					`Row ${index + 2}: ${mappedRow.questionId || 'Unknown'} - ${mappedRow.title || 'No title'}`,
				)
				return
			}

			// Skip group/umbrella questions for demo (one question per page)
			if (mappedRow.type === 'group') {
				skippedQuestions.push(
					`Row ${index + 2}: ${mappedRow.questionId} - Group/umbrella question (skipped for demo)`,
				)
				return
			}

			// Validate row
			const errors = validateQuestion(mappedRow, index)
			if (errors.length > 0) {
				validationErrors.push(...errors)
				return
			}

			// Check for duplicate questionId
			if (questionIds.has(mappedRow.questionId)) {
				validationErrors.push(
					`Row ${index + 2}: Duplicate questionId '${mappedRow.questionId}'`,
				)
				return
			}
			questionIds.add(mappedRow.questionId)

			// Transform row to question (no parent-child relationships for demo)
			const question: DemoQuestion = {
				questionId: mappedRow.questionId,
				name: mappedRow.name,
				type: mappedRow.type as 'radiogroup' | 'text',
				title: mappedRow.title,
				help: mappedRow.help || '',
				reporting: mappedRow.reporting || '',
				docs: mappedRow.docs || '',
				section: mappedRow.section,
				choices: processChoices(mappedRow.type),
				isRequired: mappedRow.isRequired === true,
				score: Number(mappedRow.score),
			}

			questions.push(question)
		})

		// Report validation errors
		if (validationErrors.length > 0) {
			console.error('❌ Validation errors found:')
			validationErrors.forEach((error) => console.error(`   ${error}`))
			throw new Error('Validation failed. Please fix the errors above.')
		}

		// Generate TypeScript file
		console.log('📝 Generating demo TypeScript file...')
		const tsContent = generateTypeScriptFile(questions)

		// Write file
		fs.writeFileSync(OUTPUT_FILE_PATH, tsContent, 'utf-8')
		console.log(`✅ File written to: ${OUTPUT_FILE_PATH}\n`)

		// Report statistics
		console.log('📊 Demo Import Statistics:')
		console.log(`   ✅ Imported questions: ${questions.length}`)
		console.log(
			`   ⏭️  Skipped questions (ignore=true): ${skippedQuestions.length}`,
		)

		if (skippedQuestions.length > 0) {
			console.log('\n   Skipped questions:')
			skippedQuestions.forEach((q) => console.log(`     - ${q}`))
		}

		// Report sections found
		const sections = [...new Set(questions.map((q) => q.section))]
		console.log(`\n   📁 Sections found (${sections.length}):`)
		sections.forEach((section) => {
			const count = questions.filter((q) => q.section === section).length
			const answerableCount = questions.filter(
				(q) => q.section === section && q.type !== 'group',
			).length
			console.log(
				`     - ${section}: ${count} questions (${answerableCount} answerable)`,
			)
		})

		console.log('\n✨ Demo questions import completed successfully!')
	} catch (error) {
		console.error(
			'\n❌ Demo import failed:',
			error instanceof Error ? error.message : String(error),
		)
		process.exit(1)
	}
}

// Run the import
void importDemoQuestions()
