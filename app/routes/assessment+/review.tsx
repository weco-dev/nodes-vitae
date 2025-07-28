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
 * 1. Statistics dashboard showing answered vs unanswered questions
 * 2. Section-organized answer display for easy review
 * 3. Beautiful UI/UX with visual progress indicators
 * 4. JSON answer parsing and human-readable formatting
 * 5. Navigation back to assessment for modifications
 * 6. Final submission confirmation workflow
 * 7. Authentication and assessment validation
 *
 * DATA PROCESSING:
 * - Loads open assessment with all answers
 * - Groups answers by ESG section (Environmental, Social, Governance)
 * - Calculates completion statistics
 * - Parses JSON answer data for display formatting
 * - Provides survey data context for comprehensive review
 *
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-23
 * @requires react-router
 * @requires #app/components/ui/button
 * @requires #app/components/ui/card
 * @requires #app/components/ui/badge
 * @requires #app/components/ui/progress
 * @requires #app/components/ui/separator
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * @requires #app/utils/assessment-questions
 *
 * @see {@link app/routes/assessment+/take.tsx} for assessment completion flow
 * @see {@link app/routes/assessment+/complete.tsx} for post-submission page
 */

import { redirect, useLoaderData, useNavigate, Form } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Progress } from '#app/components/ui/progress.tsx'
import { assessmentQuestions } from '#app/utils/assessment-questions.ts'
import {
	getUserOpenAssessment,
	completeAssessment,
} from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/review'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getUserOpenAssessment(userId)

	if (!assessment) {
		return redirect('/assessment/take')
	}

	const surveyData = JSON.parse(assessment.surveyData || '{}')

	// Calculate statistics
	const totalQuestions = assessmentQuestions.length
	const answeredQuestions = assessment.answers.length
	const unansweredQuestions = totalQuestions - answeredQuestions
	const completionPercentage = Math.round(
		(answeredQuestions / totalQuestions) * 100,
	)

	return {
		assessment: assessment!,
		surveyData,
		stats: {
			totalQuestions,
			answeredQuestions,
			unansweredQuestions,
			completionPercentage,
		},
	}
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const assessment = await getUserOpenAssessment(userId)

	if (!assessment) {
		return redirect('/assessment/take')
	}

	// Complete the assessment
	await completeAssessment(assessment.id)

	// Redirect to the dashboard with the specific assessment
	return redirect(`/dashboard/assessments/${assessment.id}`)
}

export default function AssessmentReview() {
	const { stats } = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Icon name="file-text" className="text-primary h-8 w-8" />
					<div>
						<h1 className="text-foreground text-4xl font-bold">
							Assessment Review
						</h1>
						<p className="text-muted-foreground mt-1 text-lg">
							Review your responses before final submission
						</p>
					</div>
				</div>
			</div>

			{/* Statistics Dashboard */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				<Card className="border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-br">
					<CardHeader className="pb-3">
						<CardTitle className="text-primary flex items-center gap-2 text-sm font-medium">
							<Icon name="file-text" className="h-4 w-4" />
							Total Questions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-primary text-3xl font-bold">
							{stats.totalQuestions}
						</div>
						<p className="text-primary/70 mt-1 text-xs">Assessment questions</p>
					</CardContent>
				</Card>

				<Card className="border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-br">
					<CardHeader className="pb-3">
						<CardTitle className="text-primary flex items-center gap-2 text-sm font-medium">
							<Icon name="plus" className="h-4 w-4" />
							Answered
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-primary text-3xl font-bold">
							{stats.answeredQuestions}
						</div>
						<p className="text-primary/70 mt-1 text-xs">Questions completed</p>
					</CardContent>
				</Card>

				<Card className="border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-br">
					<CardHeader className="pb-3">
						<CardTitle className="text-primary flex items-center gap-2 text-sm font-medium">
							<Icon name="clock" className="h-4 w-4" />
							Remaining
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-primary text-3xl font-bold">
							{stats.unansweredQuestions}
						</div>
						<p className="text-primary/70 mt-1 text-xs">Questions pending</p>
					</CardContent>
				</Card>

				<Card className="border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-br">
					<CardHeader className="pb-3">
						<CardTitle className="text-primary flex items-center gap-2 text-sm font-medium">
							<Icon name="pencil-2" className="h-4 w-4" />
							Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-primary text-3xl font-bold">
							{stats.completionPercentage}%
						</div>
						<Progress value={stats.completionPercentage} className="mt-2 h-2" />
						<p className="text-primary/70 mt-1 text-xs">Assessment complete</p>
					</CardContent>
				</Card>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-col gap-4 border-t pt-8 sm:flex-row">
				<Button
					variant="outline"
					size="lg"
					onClick={() => navigate('/assessment/take')}
					className="flex items-center gap-2"
				>
					<Icon name="arrow-left" className="h-4 w-4" />
					Continue Assessment
				</Button>
				<Form method="post">
					<Button
						type="submit"
						size="lg"
						className="flex items-center gap-2"
						disabled={stats.answeredQuestions === 0}
					>
						<Icon name="question-mark-circled" className="h-4 w-4" />
						Submit Assessment
					</Button>
				</Form>
			</div>
		</div>
	)
}
