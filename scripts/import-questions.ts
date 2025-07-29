/**
 * @fileoverview Excel to TypeScript Assessment Questions Import Script
 *
 * This script imports ESG assessment questions from Excel files and generates
 * TypeScript configuration files for use in the assessment system.
 *
 * ==================================================================================
 * RECENT ENHANCEMENTS (v3.0 - July 2025)
 * ==================================================================================
 *
 * ### Umbrella Questions Support:
 * - **New Type**: Support for `type: 'group'` umbrella questions
 * - **Parent-Child Relationships**: `parentQuestionId` column for question grouping
 * - **Conditional Processing**: Different handling for umbrella vs regular questions
 * - **Navigation Structure**: Maintains question hierarchy for better UX
 *
 * ### Updated Column Structure:
 * - **Replaced**: Generic `descriptions` column with delimiter splitting
 * - **With**: Three dedicated columns for semantic content:
 *   - `help` - Contextual guidance content
 *   - `reporting` - Compliance and regulatory information
 *   - `docs` - Additional documentation and resources
 * - **Added**: `parentQuestionId` column for umbrella question relationships
 *
 * ### Enhanced Processing:
 * - **Markdown Preservation**: Maintains newlines and formatting in text fields
 * - **Safe Escaping**: Proper TypeScript string escaping with markdown support
 * - **Validation**: Column mapping validation with clear error reporting
 * - **Type Safety**: Full TypeScript interface compliance checking
 * - **Group Type Handling**: Special processing for umbrella questions
 *
 * ### Excel Integration:
 * - **Column Constants**: Centralized column name definitions for validation
 * - **Flexible Mapping**: Robust column header mapping system
 * - **Error Handling**: Comprehensive validation with detailed error messages
 * - **Parent Validation**: Ensures valid parent-child question relationships
 *
 * KEY FEATURES:
 * - Reads Excel files with standardized column structure
 * - Validates question data and checks for duplicates
 * - Converts Italian boolean values ("VERO"/"FALSO") to JavaScript booleans
 * - Preserves markdown formatting in content fields
 * - Applies default choices for radiogroup questions (not for group type)
 * - Handles umbrella question hierarchy with parentQuestionId
 * - Preserves existing file documentation and helper functions
 * - Generates clean TypeScript code with proper escaping
 * - Supports question grouping for better assessment navigation
 *
 * USAGE:
 * npm run import-questions
 *
 * INPUT: data/uploads/assessment-questions.xlsx
 * OUTPUT: app/utils/assessment-questions.ts
 *
 * EXCEL COLUMN STRUCTURE:
 * - questionId: Unique identifier (required)
 * - name: Field name for forms (required)
 * - type: Question type - 'radiogroup', 'text', or 'group' (required)
 * - title: Question text displayed to users (required)
 * - help: Contextual help content (optional)
 * - reporting: Compliance reporting info (optional)
 * - docs: Additional documentation (optional)
 * - section: Category grouping (required)
 * - choices: Answer options for radiogroup (optional, ignored for group type)
 * - isRequired: Boolean flag (required)
 * - score: Point weight (required)
 * - ignore: Skip import flag (optional)
 * - parentQuestionId: Reference to umbrella question (optional)
 *
 * @version 3.0.0
 * @since 2025-07-28
 */

import * as fs from 'fs'
import * as path from 'path'
import XLSX from 'xlsx'

// Constants
const DEFAULT_RADIOGROUP_CHOICES = [
	'Non adottato',
	'Parzialmente adottato',
	'Totalmente adottato',
	'Non applicabile',
]
const EXCEL_FILE_PATH = path.join(
	process.cwd(),
	'data/uploads/assessment-questions.xlsx',
)
const OUTPUT_FILE_PATH = path.join(
	process.cwd(),
	'app/utils/assessment-questions.ts',
)

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
	PARENT_QUESTION_ID: 'parentQuestionId', // New column for umbrella question support
} as const

// Interfaces
interface ExcelRow {
	[key: string]: any
}

interface ImportedQuestion {
	questionId: string
	name: string
	type: 'radiogroup' | 'text' | 'group' // Add 'group' type for umbrella questions
	title: string
	help?: string
	reporting?: string
	docs?: string
	section: string
	choices: string[]
	isRequired: boolean
	score: number
	parentQuestionId?: string // New field for sub-questions that reference umbrella questions
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

function processChoices(type: string, choicesText: string): string[] {
	// Group type questions (umbrella questions) should not have choices
	if (type === 'group') {
		return []
	}

	if (type === 'text') {
		return []
	}

	if (type === 'radiogroup' && (!choicesText || choicesText.trim() === '')) {
		return DEFAULT_RADIOGROUP_CHOICES
	}

	// Parse choices from Excel (assuming comma-separated)
	return choicesText
		.split(',')
		.map((choice) => sanitizeString(choice.trim()))
		.filter((choice) => choice.length > 0)
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
		), // New field mapping
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

	if (row.type && !['radiogroup', 'text', 'group'].includes(row.type)) {
		errors.push(
			`Row ${rowNum}: Invalid type '${row.type}'. Must be 'radiogroup', 'text', or 'group'`,
		)
	}

	return errors
}

function generateTypeScriptFile(questions: ImportedQuestion[]): string {
	// Read the existing file to preserve the documentation and convertToSurveyJsFormat function
	const existingContent = fs.readFileSync(OUTPUT_FILE_PATH, 'utf-8')

	// Find the start of the assessmentQuestions array declaration
	const arrayStartPattern =
		'export const assessmentQuestions: QuestionConfig[] = ['
	const arrayStartIndex = existingContent.indexOf(arrayStartPattern)
	if (arrayStartIndex === -1) {
		throw new Error('Could not find assessmentQuestions array in the file')
	}

	// Find the matching closing bracket by counting brackets
	let bracketCount = 0
	let arrayEndIndex = arrayStartIndex + arrayStartPattern.length
	let inString = false
	let stringChar = ''
	let escaped = false

	for (
		let i = arrayStartIndex + arrayStartPattern.length;
		i < existingContent.length;
		i++
	) {
		const char = existingContent[i]

		if (escaped) {
			escaped = false
			continue
		}

		if (char === '\\' && inString) {
			escaped = true
			continue
		}

		if ((char === '"' || char === "'") && !inString) {
			inString = true
			stringChar = char
			continue
		}

		if (char === stringChar && inString) {
			inString = false
			stringChar = ''
			continue
		}

		if (!inString) {
			if (char === '[') {
				bracketCount++
			} else if (char === ']') {
				if (bracketCount === 0) {
					arrayEndIndex = i + 1
					break
				}
				bracketCount--
			}
		}
	}

	// Extract the parts we want to keep
	const beforeArray = existingContent.substring(0, arrayStartIndex)
	const afterArray = existingContent.substring(arrayEndIndex)

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
			return `\t\t${fieldName}: "",`
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
					? q.choices.map((c) => `\t\t\t'${escapeString(c)}'`).join(',\n')
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
			if (q.type !== 'group') {
				questionObject += `\n\t\tchoices: [${choices ? '\n' + choices + '\n\t\t' : ''}],`
			}

			questionObject += `
\t\tisRequired: ${q.isRequired},
\t\tscore: ${q.score}`

			// Add parentQuestionId if it exists
			if (q.parentQuestionId && q.parentQuestionId.trim() !== '') {
				questionObject += `,
\t\tparentQuestionId: '${escapeString(q.parentQuestionId)}'`
			}

			questionObject += `
\t}`

			return questionObject
		})
		.join(',\n')

	// Combine everything
	return (
		beforeArray +
		'export const assessmentQuestions: QuestionConfig[] = [\n' +
		questionsArray +
		'\n]' +
		afterArray
	)
}

// Main import function
async function importQuestions() {
	console.log('🚀 Starting Excel import process...\n')

	try {
		// Check if Excel file exists
		if (!fs.existsSync(EXCEL_FILE_PATH)) {
			throw new Error(`Excel file not found at: ${EXCEL_FILE_PATH}`)
		}

		// Read Excel file
		console.log('📖 Reading Excel file...')
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

		console.log(`✅ Found ${rawData.length} rows in Excel\n`)

		// Process and validate data
		const questions: ImportedQuestion[] = []
		const skippedQuestions: string[] = []
		const validationErrors: string[] = []
		const questionIds = new Set<string>()
		const umbrellaQuestions = new Set<string>()

		// First pass: collect all question IDs and umbrella questions
		rawData.forEach((row) => {
			const mappedRow = mapExcelRowToStandardRow(row)
			if (mappedRow.ignore === true) return

			if (mappedRow.type === 'group') {
				umbrellaQuestions.add(mappedRow.questionId)
			}
		})

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

			// Validate parent-child relationships
			if (
				mappedRow.parentQuestionId &&
				mappedRow.parentQuestionId.trim() !== ''
			) {
				// Check if parent question exists as an umbrella question
				if (!umbrellaQuestions.has(mappedRow.parentQuestionId)) {
					validationErrors.push(
						`Row ${index + 2}: Parent question '${mappedRow.parentQuestionId}' not found or not an umbrella question (type: 'group')`,
					)
					return
				}

				// Umbrella questions should not have parents
				if (mappedRow.type === 'group') {
					validationErrors.push(
						`Row ${index + 2}: Umbrella questions (type: 'group') cannot have a parentQuestionId`,
					)
					return
				}
			}

			// Umbrella questions should not have choices
			if (
				mappedRow.type === 'group' &&
				mappedRow.choices &&
				mappedRow.choices.trim() !== ''
			) {
				console.warn(
					`Row ${index + 2}: Umbrella question '${mappedRow.questionId}' has choices but type 'group' should not have choices. Choices will be ignored.`,
				)
			}

			// Transform row to question
			const question: ImportedQuestion = {
				questionId: mappedRow.questionId,
				name: mappedRow.name,
				type: mappedRow.type as 'radiogroup' | 'text' | 'group',
				title: mappedRow.title,
				help: mappedRow.help || undefined,
				reporting: mappedRow.reporting || undefined,
				docs: mappedRow.docs || undefined,
				section: mappedRow.section,
				choices: processChoices(mappedRow.type, mappedRow.choices),
				isRequired: mappedRow.isRequired === true,
				score: Number(mappedRow.score),
				parentQuestionId:
					mappedRow.parentQuestionId && mappedRow.parentQuestionId.trim() !== ''
						? mappedRow.parentQuestionId
						: undefined,
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
		console.log('📝 Generating TypeScript file...')
		const tsContent = generateTypeScriptFile(questions)

		// Write file
		fs.writeFileSync(OUTPUT_FILE_PATH, tsContent, 'utf-8')
		console.log(`✅ File written to: ${OUTPUT_FILE_PATH}\n`)

		// Report statistics
		console.log('📊 Import Statistics:')
		console.log(`   ✅ Imported questions: ${questions.length}`)
		console.log(
			`   ⏭️  Skipped questions (ignore=VERO): ${skippedQuestions.length}`,
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
			console.log(`     - ${section}: ${count} questions`)
		})

		console.log('\n✨ Import completed successfully!')
	} catch (error) {
		console.error(
			'\n❌ Import failed:',
			error instanceof Error ? error.message : String(error),
		)
		process.exit(1)
	}
}

// Run the import
void importQuestions()
