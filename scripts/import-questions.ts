/**
 * @fileoverview Excel to TypeScript Assessment Questions Import Script
 *
 * This script imports ESG assessment questions from Excel files and generates
 * TypeScript configuration files for use in the assessment system.
 *
 * KEY FEATURES:
 * - Reads Excel files with standardized column structure
 * - Validates question data and checks for duplicates
 * - Converts Italian boolean values ("VERO"/"FALSO") to JavaScript booleans
 * - Processes descriptions with delimiter splitting
 * - Applies default choices for radiogroup questions
 * - Preserves existing file documentation and helper functions
 * - Generates clean TypeScript code with proper escaping
 *
 * USAGE:
 * npm run import-questions
 *
 * INPUT: data/uploads/assessment-questions.xlsx
 * OUTPUT: app/utils/assessment-questions.ts
 *
 * @version 1.0.0
 * @since 2025-07-18
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
const DESCRIPTION_DELIMITER = '-----'
const MAX_DESCRIPTIONS = 3

// Interfaces
interface ExcelRow {
	[key: string]: any
}

interface ImportedQuestion {
	questionId: string
	name: string
	type: 'radiogroup' | 'text'
	title: string
	descriptions: string[]
	section: string
	choices: string[]
	isRequired: boolean
	score: number
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

function processDescriptions(descriptionsText: string): string[] {
	if (!descriptionsText || descriptionsText.trim() === '') {
		return []
	}

	const parts = descriptionsText
		.split(DESCRIPTION_DELIMITER)
		.map((desc) => sanitizeString(desc.trim()))
		.filter((desc) => desc.length > 0)
		.slice(0, MAX_DESCRIPTIONS)

	return parts
}

function processChoices(type: string, choicesText: string): string[] {
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
	// The Excel file now has the correct column names, so we can use them directly
	return {
		questionId: sanitizeString(row.questionId),
		name: sanitizeString(row.name),
		type: row.type,
		title: sanitizeString(row.title),
		descriptions: sanitizeString(row.descriptions || ''),
		section: sanitizeString(row.section),
		choices: sanitizeString(row.choices || ''),
		isRequired: row.isRequired,
		score: row.score || 0,
		ignore: row.ignore || false,
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

	if (row.type && !['radiogroup', 'text'].includes(row.type)) {
		errors.push(
			`Row ${rowNum}: Invalid type '${row.type}'. Must be 'radiogroup' or 'text'`,
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

	// Generate TypeScript object literals manually for safety
	const questionsArray = questions
		.map((q) => {
			const descriptions =
				q.descriptions.length > 0
					? q.descriptions.map((d) => `\t\t\t'${escapeString(d)}'`).join(',\n')
					: ''
			const choices =
				q.choices.length > 0
					? q.choices.map((c) => `\t\t\t'${escapeString(c)}'`).join(',\n')
					: ''

			return `\t{
\t\tquestionId: '${escapeString(q.questionId)}',
\t\tname: '${escapeString(q.name)}',
\t\ttype: '${q.type}' as const,
\t\ttitle: '${escapeString(q.title)}',
\t\tdescriptions: [${descriptions ? '\n' + descriptions + '\n\t\t' : ''}],
\t\tsection: '${escapeString(q.section)}',
\t\tchoices: [${choices ? '\n' + choices + '\n\t\t' : ''}],
\t\tisRequired: ${q.isRequired},
\t\tscore: ${q.score},
\t}`
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

			// Transform row to question
			const question: ImportedQuestion = {
				questionId: mappedRow.questionId,
				name: mappedRow.name,
				type: mappedRow.type as 'radiogroup' | 'text',
				title: mappedRow.title,
				descriptions: processDescriptions(mappedRow.descriptions),
				section: mappedRow.section,
				choices: processChoices(mappedRow.type, mappedRow.choices),
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
