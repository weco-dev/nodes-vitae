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
import { redirect, Link  } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { getUserOpenAssessment } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/complete'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getUserOpenAssessment(userId)

	// Redirect if no open assessment
	if (!assessment) {
		return redirect('/dashboard/assessments')
	}

	return {}
}

export default function AssessmentComplete() {
	return (
		<div className="py-8">
			<Card className="max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<CheckCircle className="h-16 w-16 text-green-500 mb-4" />
					<h1 className="text-2xl font-bold mb-2">Assessment Completed!</h1>
					<p className="text-muted-foreground text-center mb-8">
						Thank you for completing your ESG assessment. Your responses have been
						saved and you can now view your results.
					</p>
					<div className="flex gap-4">
						<Button asChild variant="outline">
							<Link to="/dashboard/assessments">View All Assessments</Link>
						</Button>
						<Button asChild>
							<Link to="/assessment/take">Start New Assessment</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}