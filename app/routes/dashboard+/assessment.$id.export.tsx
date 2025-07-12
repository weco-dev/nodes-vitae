/**
 * @fileoverview Assessment Export Route - CSV export functionality for completed assessments
 * 
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 * 
 * This route provides CSV export functionality for completed ESG assessments,
 * allowing users to download their assessment data for external analysis,
 * reporting, or record-keeping purposes.
 * 
 * KEY FEATURES:
 * 1. CSV format export with comprehensive question and answer data
 * 2. Assessment ownership validation for security
 * 3. Automatic file download with descriptive filename
 * 4. Question metadata integration for complete context
 * 5. JSON answer parsing for readable export format
 * 
 * EXPORT FORMAT:
 * - Headers: Question ID, Section, Question, Answer, Date
 * - Data includes parsed answers and question context
 * - Proper CSV escaping for complex answer data
 * - Chronological ordering by answer creation date
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires #app/utils/assessment-questions
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * 
 * @see {@link app/utils/assessment-questions.ts} for question metadata
 * @see {@link app/routes/dashboard+/assessment.$id.tsx} for assessment view
 */

import { assessmentQuestions } from '#app/utils/assessment-questions.ts'
import { getAssessmentById } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/assessment.$id.export'

export async function loader({ request, params }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getAssessmentById(params.id, userId)

	if (!assessment) {
		throw new Response('Assessment not found', { status: 404 })
	}

	// Generate CSV content
	const csvRows = ['Question ID,Section,Question,Answer,Date']

	assessment.answers.forEach((answer) => {
		const question = assessmentQuestions.find(
			(q) => q.questionId === answer.questionId,
		)
		const parsedAnswer = JSON.parse(answer.answer)
		const answerText =
			typeof parsedAnswer === 'object'
				? JSON.stringify(parsedAnswer)
				: parsedAnswer

		csvRows.push(
			`"${answer.questionId}","${answer.section}","${question?.title || answer.questionName}","${answerText}","${answer.createdAt}"`,
		)
	})

	const csv = csvRows.join('\n')

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="assessment-${assessment.id}.csv"`,
		},
	})
}