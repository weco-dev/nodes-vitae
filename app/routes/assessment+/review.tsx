/**
 * @fileoverview Assessment Review Route - Pre-submission review page for ESG assessments
 * 
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 * 
 * This route provides users with a comprehensive review interface before final
 * assessment submission. It displays all answered questions organized by section,
 * allowing users to verify their responses and make corrections if needed.
 * 
 * KEY FEATURES:
 * 1. Section-organized answer display for easy review
 * 2. JSON answer parsing and human-readable formatting
 * 3. Navigation back to assessment for modifications
 * 4. Final submission confirmation workflow
 * 5. Authentication and assessment validation
 * 
 * DATA PROCESSING:
 * - Loads open assessment with all answers
 * - Groups answers by ESG section (Environmental, Social, Governance)
 * - Parses JSON answer data for display formatting
 * - Provides survey data context for comprehensive review
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires react-router
 * @requires #app/components/ui/button
 * @requires #app/components/ui/card
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * 
 * @see {@link app/routes/assessment+/take.tsx} for assessment completion flow
 * @see {@link app/routes/assessment+/complete.tsx} for post-submission page
 */

import { redirect, useLoaderData, useNavigate  } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card.tsx'
import { getUserOpenAssessment } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/review'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getUserOpenAssessment(userId)

	if (!assessment) {
		return redirect('/assessment/take')
	}

	const surveyData = JSON.parse(assessment.surveyData || '{}')
	const answersBySection = assessment!.answers.reduce((acc, answer) => {
		if (!acc[answer.section]) {
			acc[answer.section] = []
		}
		acc[answer.section]!.push({
			...answer,
			parsedAnswer: JSON.parse(answer.answer)
		})
		return acc
	}, {} as Record<string, any[]>)

	return { assessment: assessment!, surveyData, answersBySection }
}

export default function AssessmentReview() {
	const { answersBySection } = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Review Your Assessment</h1>
				<p className="text-muted-foreground">
					Review your answers before final submission.
				</p>
			</div>

			<div className="space-y-6">
				{Object.entries(answersBySection).map(([section, answers]) => (
					<Card key={section}>
						<CardHeader>
							<CardTitle>{section}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{answers.map((answer: any) => (
									<div key={answer.id} className="border-b pb-4 last:border-0">
										<p className="font-medium mb-1">{answer.questionName}</p>
										<p className="text-muted-foreground">
											{typeof answer.parsedAnswer === 'object'
												? JSON.stringify(answer.parsedAnswer)
												: answer.parsedAnswer}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="mt-8 flex gap-4">
				<Button
					variant="outline"
					onClick={() => navigate('/assessment/take')}
				>
					Back to Assessment
				</Button>
				<Button onClick={() => navigate('/assessment/complete')}>
					Submit Assessment
				</Button>
			</div>
		</div>
	)
}