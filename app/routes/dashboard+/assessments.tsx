/**
 * @fileoverview Assessments Dashboard Route - Management interface for user ESG assessments
 * 
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 * 
 * This route provides a comprehensive dashboard for users to view, manage, and
 * navigate their ESG assessments. Features assessment listing with status indicators,
 * quick actions, and navigation to detailed views.
 * 
 * KEY FEATURES:
 * 1. Assessment listing with status badges and metadata
 * 2. Quick action buttons for viewing and starting assessments
 * 3. Date formatting and progress indicators
 * 4. Responsive card-based layout
 * 5. Integration with assessment creation workflow
 * 
 * ASSESSMENT MANAGEMENT:
 * - Lists all user assessments chronologically
 * - Shows assessment status (open, completed, archived)
 * - Provides quick access to assessment details and actions
 * - Supports assessment creation and continuation workflows
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires date-fns
 * @requires react-router
 * @requires #app/components/ui/badge
 * @requires #app/components/ui/button
 * @requires #app/components/ui/card
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * 
 * @see {@link app/routes/dashboard+/assessment.$id.tsx} for individual assessment view
 * @see {@link app/routes/assessment+/take.tsx} for assessment creation
 */

import { format } from 'date-fns'
import { Link, useLoaderData  } from 'react-router'
import { Badge } from '#app/components/ui/badge.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card.tsx'
import { getUserAssessments } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/assessments'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessments = await getUserAssessments(userId)

	return { assessments }
}

export default function AssessmentsRoute() {
	const { assessments } = useLoaderData<typeof loader>()

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-2xl font-bold">ESG Assessments</h1>
								<p className="text-muted-foreground">
									View and manage your ESG assessments
								</p>
							</div>
							<Button asChild>
								<Link to="/assessment/take">Start New Assessment</Link>
							</Button>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{assessments.map((assessment) => (
								<Card key={assessment.id}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-lg">
												Assessment #{assessment.id.slice(-6)}
											</CardTitle>
											<Badge
												variant={
													assessment.status === 'completed'
														? 'default'
														: assessment.status === 'open'
														? 'secondary'
														: 'outline'
												}
											>
												{assessment.status}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 text-sm">
											<p>
												<span className="text-muted-foreground">Created:</span>{' '}
												{format(new Date(assessment.createdAt), 'PPP')}
											</p>
											{assessment.completedAt && (
												<p>
													<span className="text-muted-foreground">Completed:</span>{' '}
													{format(new Date(assessment.completedAt), 'PPP')}
												</p>
											)}
											<p>
												<span className="text-muted-foreground">Answers:</span>{' '}
												{assessment.answers.length}
											</p>
										</div>
										<div className="mt-4 flex gap-2">
											{assessment.status === 'open' ? (
												<Button asChild size="sm" className="w-full">
													<Link to="/assessment/take">Continue</Link>
												</Button>
											) : (
												<Button asChild size="sm" variant="outline" className="w-full">
													<Link to={`/dashboard/assessment/${assessment.id}`}>
														View Details
													</Link>
												</Button>
											)}
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{assessments.length === 0 && (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-12">
									<p className="text-muted-foreground mb-4">
										No assessments found
									</p>
									<Button asChild>
										<Link to="/assessment/take">Start Your First Assessment</Link>
									</Button>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}