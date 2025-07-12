/**
 * @fileoverview Assessment Detail Route - Comprehensive view of individual assessment data
 * 
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 * 
 * This route provides a detailed view of individual ESG assessments with answers
 * organized by section using a tabbed interface. Users can review all responses
 * and see comprehensive assessment information.
 * 
 * KEY FEATURES:
 * 1. Tabbed interface for section-based answer organization
 * 2. Answer parsing and display with question context
 * 3. Assessment metadata and status information
 * 4. Date formatting and user-friendly presentation
 * 5. Integration with assessment questions for context
 * 
 * DATA ORGANIZATION:
 * - Groups answers by ESG section (Environmental, Social, Governance)
 * - Enriches answers with question metadata
 * - Formats dates for readable display
 * - Provides comprehensive assessment context
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires date-fns
 * @requires react-router
 * @requires #app/components/ui/badge
 * @requires #app/components/ui/card
 * @requires #app/components/ui/tabs
 * @requires #app/utils/assessment-questions
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * 
 * @see {@link app/routes/dashboard+/assessment.$id.summary.tsx} for summary view
 * @see {@link app/utils/assessment-questions.ts} for question metadata
 */

import { format } from 'date-fns'
import { useLoaderData  } from 'react-router'
import { Badge } from '#app/components/ui/badge.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#app/components/ui/card.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#app/components/ui/tabs.tsx'
import { assessmentQuestions } from '#app/utils/assessment-questions.ts'
import { getAssessmentById } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/assessment.$id'

export async function loader({ request, params }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getAssessmentById(params.id, userId)

	if (!assessment) {
		throw new Response('Assessment not found', { status: 404 })
	}

	// Group answers by section
	const answersBySection = assessment!.answers.reduce((acc, answer) => {
		if (!acc[answer.section]) {
			acc[answer.section] = []
		}
		acc[answer.section]!.push({
			...answer,
			parsedAnswer: JSON.parse(answer.answer),
			question: assessmentQuestions.find(q => q.questionId === answer.questionId)
		})
		return acc
	}, {} as Record<string, any[]>)

	return { assessment: assessment!, answersBySection }
}

export default function AssessmentDetailRoute() {
	const { assessment, answersBySection } = useLoaderData<typeof loader>()

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<h1 className="text-2xl font-bold">
									Assessment #{assessment.id.slice(-6)}
								</h1>
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
							<div className="flex gap-4 text-sm text-muted-foreground">
								<span>Created: {format(new Date(assessment.createdAt), 'PPP')}</span>
								{assessment.completedAt && (
									<span>Completed: {format(new Date(assessment.completedAt), 'PPP')}</span>
								)}
							</div>
						</div>

						<Tabs defaultValue="answers" className="w-full">
							<TabsList>
								<TabsTrigger value="answers">Answers</TabsTrigger>
								<TabsTrigger value="summary">Summary</TabsTrigger>
							</TabsList>

							<TabsContent value="answers" className="mt-6">
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
															<h4 className="font-medium mb-2">
																{answer.question?.title || answer.questionName}
															</h4>
															<p className="text-sm text-muted-foreground">
																{typeof answer.parsedAnswer === 'boolean'
																	? answer.parsedAnswer ? 'Yes' : 'No'
																	: typeof answer.parsedAnswer === 'object'
																	? Array.isArray(answer.parsedAnswer)
																		? answer.parsedAnswer.join(', ')
																		: JSON.stringify(answer.parsedAnswer)
																	: answer.parsedAnswer}
															</p>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</TabsContent>

							<TabsContent value="summary" className="mt-6">
								<Card>
									<CardHeader>
										<CardTitle>Assessment Summary</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div>
												<p className="text-sm text-muted-foreground">Total Questions</p>
												<p className="text-2xl font-bold">{assessment.answers.length}</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Sections Covered</p>
												<p className="text-2xl font-bold">
													{Object.keys(answersBySection).length}
												</p>
											</div>
											{/* Score calculation would go here */}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}