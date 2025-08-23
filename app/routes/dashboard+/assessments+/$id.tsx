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
 * @see {@link app/utils/assessment-questions.ts} for question metadata
 */

import { format } from 'date-fns'
import { Edit, Check, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useLoaderData, useFetcher } from 'react-router'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '#app/components/ui/accordion.tsx'
import { Badge } from '#app/components/ui/badge.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Progress } from '#app/components/ui/progress.tsx'
import { assessmentQuestions } from '#app/utils/assessment-questions.ts'
import {
	getAssessmentById,
	updateAssessmentTitle,
} from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { getAnswerableQuestions } from '#app/utils/question-filtering.ts'
import { type Route } from './+types/$id'

export async function loader({ request, params }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessment = await getAssessmentById(params.id, userId)

	if (!assessment) {
		throw new Response('Assessment not found', { status: 404 })
	}

	// Group answers by section
	const answersBySection = assessment!.answers.reduce(
		(acc, answer) => {
			if (!acc[answer.section]) {
				acc[answer.section] = []
			}
			const matchedQuestion = assessmentQuestions.find(
				(q) => q.questionId === answer.questionId,
			)

			acc[answer.section]!.push({
				...answer,
				parsedAnswer: JSON.parse(answer.answer),
				question: matchedQuestion,
			})
			return acc
		},
		{} as Record<string, any[]>,
	)

	// Calculate statistics (exclude umbrella/group questions from total count)
	const answerableQuestions = getAnswerableQuestions()
	const totalQuestions = answerableQuestions.length
	const answeredQuestions = assessment.answers.length
	const unansweredQuestions = totalQuestions - answeredQuestions
	const completionPercentage = Math.round(
		(answeredQuestions / totalQuestions) * 100,
	)

	return {
		assessment: assessment!,
		answersBySection,
		stats: {
			totalQuestions,
			answeredQuestions,
			unansweredQuestions,
			completionPercentage,
		},
	}
}

export async function action({ request, params }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	switch (intent) {
		case 'update-title': {
			const title = formData.get('title') as string
			if (!title || title.trim() === '') {
				throw new Error('Title cannot be empty')
			}
			await updateAssessmentTitle(params.id, userId, title.trim())
			return { success: true }
		}
		default:
			throw new Error(`Unknown intent: ${intent}`)
	}
}

export default function AssessmentDetailRoute() {
	const { assessment, answersBySection, stats } = useLoaderData<typeof loader>()
	const fetcher = useFetcher()
	const [isEditing, setIsEditing] = useState(false)
	const [editTitle, setEditTitle] = useState(
		assessment.title || `Assessment #${assessment.id.slice(-6)}`,
	)

	const handleTitleUpdate = useCallback(() => {
		if (editTitle.trim() === '') return

		void fetcher.submit(
			{
				intent: 'update-title',
				title: editTitle.trim(),
			},
			{ method: 'POST' },
		)
		setIsEditing(false)
	}, [fetcher, editTitle])

	const handleCancelEdit = useCallback(() => {
		setEditTitle(assessment.title || `Assessment #${assessment.id.slice(-6)}`)
		setIsEditing(false)
	}, [assessment.title, assessment.id])

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="mb-6">
							<div className="mb-2 flex items-center justify-between">
								{isEditing ? (
									<div className="flex flex-1 items-center gap-2">
										<Input
											value={editTitle}
											onChange={(e) => setEditTitle(e.target.value)}
											className="h-auto border-0 bg-transparent p-0 text-2xl font-bold focus-visible:ring-0"
											placeholder="Assessment title..."
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleTitleUpdate()
												if (e.key === 'Escape') handleCancelEdit()
											}}
											autoFocus
										/>
										<Button
											size="sm"
											variant="ghost"
											onClick={handleTitleUpdate}
										>
											<Check className="h-4 w-4" />
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={handleCancelEdit}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								) : (
									<div className="flex items-center gap-2">
										<h1 className="text-2xl font-bold">
											{assessment.title ||
												`Assessment #${assessment.id.slice(-6)}`}
										</h1>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setIsEditing(true)}
										>
											<Edit className="h-4 w-4" />
										</Button>
									</div>
								)}
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
							<div className="text-muted-foreground flex gap-4 text-sm">
								<span>
									Created: {format(new Date(assessment.createdAt), 'PPP')}
								</span>
								{assessment.completedAt && (
									<span>
										Completed: {format(new Date(assessment.completedAt), 'PPP')}
									</span>
								)}
							</div>
						</div>

						{/* Statistics Dashboard */}
						<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-primary/70 text-sm font-medium">
												Total Questions
											</p>
											<p className="text-primary text-2xl font-bold">
												{stats.totalQuestions}
											</p>
										</div>
										<Icon
											name="question-mark-circled"
											className="text-primary h-8 w-8"
										/>
									</div>
								</CardContent>
							</Card>

							<Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-primary/70 text-sm font-medium">
												Answered
											</p>
											<p className="text-primary text-2xl font-bold">
												{stats.answeredQuestions}
											</p>
										</div>
										<Icon name="check" className="text-primary h-8 w-8" />
									</div>
								</CardContent>
							</Card>

							<Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-primary/70 text-sm font-medium">
												Remaining
											</p>
											<p className="text-primary text-2xl font-bold">
												{stats.unansweredQuestions}
											</p>
										</div>
										<Icon name="clock" className="text-primary h-8 w-8" />
									</div>
								</CardContent>
							</Card>

							<Card className="from-primary/5 to-primary/10 border-primary/20 bg-gradient-to-br">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-primary/70 text-sm font-medium">
												Completion
											</p>
											<p className="text-primary text-2xl font-bold">
												{stats.completionPercentage}%
											</p>
										</div>
										<Icon name="sun" className="text-primary h-8 w-8" />
									</div>
									<Progress
										value={stats.completionPercentage}
										className="mt-2 h-2"
									/>
								</CardContent>
							</Card>
						</div>

						{/* Answered Questions Section */}
						{Object.keys(answersBySection).length > 0 && (
							<div className="space-y-6">
								<div className="flex items-center gap-3">
									<Icon name="check" className="text-primary h-6 w-6" />
									<h2 className="text-foreground text-2xl font-bold">
										Answered Questions
									</h2>
									<Badge
										variant="default"
										className="bg-primary text-primary-foreground"
									>
										{stats.answeredQuestions} completed
									</Badge>
								</div>

								<Accordion
									type="single"
									collapsible
									className="w-full space-y-4"
								>
									{Object.entries(answersBySection).map(
										([section, answers]) => (
											<AccordionItem
												key={section}
												value={section}
												className="bg-card border-muted mb-4 rounded-lg border px-4 shadow-sm"
											>
												<AccordionTrigger className="py-6 hover:no-underline">
													<div className="flex w-full items-center justify-between pr-4">
														<div className="flex items-center gap-4">
															<Icon
																name="file-text"
																className="text-primary h-6 w-6"
															/>
															<span className="text-xl font-semibold">
																Answers
															</span>
														</div>
														<Badge
															variant="secondary"
															className="bg-primary/10 text-primary px-3 py-1 text-sm"
														>
															{answers.length} questions
														</Badge>
													</div>
												</AccordionTrigger>
												<AccordionContent className="border-muted border-t pt-4 pb-6">
													<div className="border-muted mb-4 border-b pb-3">
														<h3 className="text-primary text-sm font-medium tracking-wide uppercase">
															{section}
														</h3>
													</div>
													<div className="space-y-6">
														{answers.map((answer: any, index: number) => (
															<div key={answer.id}>
																<div className="flex items-start gap-4">
																	<div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
																		<span className="text-primary text-sm font-medium">
																			{index + 1}
																		</span>
																	</div>
																	<div className="flex-1 space-y-3">
																		<h4 className="text-foreground leading-relaxed font-semibold">
																			{answer.question?.title ||
																				answer.questionName ||
																				`Question ${answer.questionId}`}
																		</h4>
																		<div className="bg-muted/50 rounded-lg p-4">
																			<p className="text-foreground font-medium">
																				{typeof answer.parsedAnswer ===
																				'boolean'
																					? answer.parsedAnswer
																						? 'Yes'
																						: 'No'
																					: typeof answer.parsedAnswer ===
																						  'object'
																						? Array.isArray(answer.parsedAnswer)
																							? answer.parsedAnswer.join(', ')
																							: JSON.stringify(
																									answer.parsedAnswer,
																									null,
																									2,
																								)
																						: answer.parsedAnswer}
																			</p>
																		</div>
																		{answer.question?.help && (
																			<p className="text-muted-foreground text-sm italic">
																				💡 {answer.question.help}
																			</p>
																		)}
																	</div>
																</div>
															</div>
														))}
													</div>
												</AccordionContent>
											</AccordionItem>
										),
									)}
								</Accordion>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
