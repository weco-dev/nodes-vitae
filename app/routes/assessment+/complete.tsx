/**
 * @fileoverview Assessment Complete Route - Success page for completed ESG assessments
 * 
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 * 
 * This route provides a success confirmation page displayed after users complete
 * an ESG assessment. It validates assessment completion status and offers navigation
 * options for next steps in the assessment workflow.
 * 
 * KEY FEATURES:
 * 1. Assessment completion validation and redirect protection
 * 2. Success confirmation with visual feedback (CheckCircle icon)
 * 3. Clear call-to-action buttons for post-completion workflow
 * 4. Responsive card-based layout for focused user experience
 * 5. Authentication-protected route with automatic redirects
 * 
 * WORKFLOW INTEGRATION:
 * - Validates user has open assessment (prevents direct access)
 * - Provides links to view assessment results and start new assessments
 * - Integrates with assessment dashboard for comprehensive user journey
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires lucide-react
 * @requires react-router
 * @requires #app/components/ui/button
 * @requires #app/components/ui/card
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * 
 * @see {@link app/routes/assessment+/take.tsx} for assessment completion flow
 * @see {@link app/routes/dashboard+/assessments.tsx} for assessment management
 */

import { CheckCircle } from 'lucide-react'
import { redirect, Link, useLoaderData } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { assessmentQuestions } from '#app/utils/assessment-questions.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/complete'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)

	// Get most recently completed assessment
	const assessment = await prisma.assessment.findFirst({
		where: {
			userId,
			status: 'completed'
		},
		orderBy: {
			completedAt: 'desc'
		},
		include: {
			answers: true
		}
	})

	if (!assessment) {
		return redirect('/dashboard/assessments')
	}

	// Calculate basic score
	const totalQuestions = assessmentQuestions.length
	const answeredQuestions = assessment.answers.length
	const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100)

	return { assessment, completionPercentage }
}

export default function AssessmentComplete() {
	const { assessment, completionPercentage } = useLoaderData<typeof loader>()

	return (
		<div className="py-8">
			<Card className="max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<CheckCircle className="h-16 w-16 text-green-500 mb-4" />
					<h1 className="text-2xl font-bold mb-2">Assessment Completed!</h1>
					<p className="text-muted-foreground text-center mb-4">
						Thank you for completing your ESG assessment. Your responses have been
						saved and you can now view your results.
					</p>

					{/* Score summary */}
					<div className="bg-muted rounded-lg p-6 mb-8">
						<p className="text-center text-sm text-muted-foreground mb-2">
							Overall Completion
						</p>
						<p className="text-center text-4xl font-bold">
							{completionPercentage}%
						</p>
					</div>

					<div className="flex gap-4">
						<Button asChild variant="outline">
							<Link to="/dashboard/assessments">View All Assessments</Link>
						</Button>
						<Button asChild>
							<Link to={`/dashboard/assessment/${assessment.id}/summary`}>
								View Detailed Results
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}