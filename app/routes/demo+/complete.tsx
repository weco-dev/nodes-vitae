/**
 * @fileoverview Demo Complete Route - Demo Completion & Conversion Page
 *
 * This route displays the completion page for the demo assessment and focuses on
 * converting demo users to registered users. It shows mock results and provides
 * clear paths for user conversion.
 */

import { useEffect } from 'react'
import { Link } from 'react-router'
import { Badge } from '#app/components/ui/badge.tsx'
import { Button } from '#app/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Separator } from '#app/components/ui/separator.tsx'
import {
	trackDemoCompletion,
	trackDemoConversion,
	trackDemoReset,
} from '#app/utils/demo-analytics.ts'
import { clearDemoData, getDemoSessionStats } from '#app/utils/demo-storage.ts'
import { type Route } from './+types/complete'

export async function loader({}: Route.LoaderArgs) {
	// No authentication required for demo
	return {}
}

export default function DemoComplete() {
	useEffect(() => {
		trackDemoCompletion()
	}, [])

	// const demoData = getDemoDataFromLocalStorage()
	const sessionStats = getDemoSessionStats()

	// Mock ESG score calculation for demo (based on answers given)
	const mockScore = Math.min(
		95,
		Math.max(45, 60 + sessionStats.questionsAnswered * 1.5),
	)
	const mockPercentage = Math.round(mockScore)

	// Mock recommendations based on typical ESG improvement areas
	const mockRecommendations = [
		'Develop a comprehensive human rights due diligence policy',
		'Implement systematic supply chain risk assessment procedures',
		'Enhance stakeholder engagement and communication processes',
		'Establish regular monitoring and evaluation mechanisms',
		'Create formal grievance and remediation procedures',
	].slice(
		0,
		Math.max(2, Math.min(5, Math.floor(sessionStats.questionsAnswered / 5))),
	)

	// Mock section scores
	const mockSectionScores = [
		{ section: 'Company Profile', score: Math.round(mockScore * 0.9) },
		{ section: 'Commitment & Governance', score: Math.round(mockScore * 1.1) },
		{ section: 'Risk Assessment', score: Math.round(mockScore * 0.85) },
		{ section: 'Implementation', score: Math.round(mockScore * 1.05) },
		{ section: 'Monitoring', score: Math.round(mockScore * 0.95) },
		{ section: 'Communication', score: Math.round(mockScore * 0.8) },
		{ section: 'Remediation', score: Math.round(mockScore * 1.2) },
	]

	const sessionDurationMinutes = Math.round(
		sessionStats.sessionDuration / 1000 / 60,
	)

	const handleRestartDemo = () => {
		clearDemoData()
		trackDemoReset('user_action')
		window.location.href = '/demo/take'
	}

	const handleSignupClick = () => {
		trackDemoConversion('signup_clicked', 'completion')
	}

	const handleLearnMoreClick = () => {
		trackDemoConversion('learn_more_clicked', 'completion')
	}

	const handleContactClick = () => {
		trackDemoConversion('contact_clicked', 'completion')
	}

	return (
		<div className="bg-background min-h-screen">
			<main className="flex-1">
				<div className="p-3 sm:p-4 lg:p-6">
					<div className="mx-auto w-full max-w-5xl">
						{/* Completion Header */}
						<div className="mb-8 text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
								<Icon
									name="check"
									className="h-8 w-8 text-green-600 dark:text-green-400"
								/>
							</div>
							<h1 className="mb-2 text-3xl font-bold">Demo Complete! 🎉</h1>
							<p className="text-muted-foreground text-lg">
								You've experienced our ESG assessment system with{' '}
								{sessionStats.questionsAnswered} questions
							</p>
						</div>

						<div className="grid gap-6 lg:grid-cols-3">
							{/* Main Results Card */}
							<div className="space-y-6 lg:col-span-2">
								{/* Overall Score */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Icon name="file-text" className="h-5 w-5" />
											Demo Results Overview
										</CardTitle>
										<CardDescription>
											Based on your {sessionStats.questionsAnswered} responses
											(sample results)
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-lg font-medium">
												Overall ESG Score
											</span>
											<Badge
												variant="secondary"
												className="px-4 py-2 text-xl font-bold"
											>
												{mockPercentage}/100
											</Badge>
										</div>

										<div className="space-y-3">
											<div className="text-muted-foreground flex items-center justify-between text-sm">
												<span>Questions Answered</span>
												<span className="font-medium">
													{sessionStats.questionsAnswered} of 25
												</span>
											</div>
											<div className="text-muted-foreground flex items-center justify-between text-sm">
												<span>Time Spent</span>
												<span className="font-medium">
													{sessionDurationMinutes} minutes
												</span>
											</div>
											<div className="text-muted-foreground flex items-center justify-between text-sm">
												<span>Completion Rate</span>
												<span className="font-medium">
													{Math.round(sessionStats.completionRate * 100)}%
												</span>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Section Breakdown */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Icon name="file-text" className="h-5 w-5" />
											Section Breakdown
										</CardTitle>
										<CardDescription>
											Performance across ESG assessment sections (sample data)
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockSectionScores.map((section, index) => (
												<div
													key={index}
													className="flex items-center justify-between"
												>
													<span className="text-sm">{section.section}</span>
													<Badge
														variant="outline"
														className={
															section.score >= 80
																? 'border-green-500 text-green-700'
																: section.score >= 60
																	? 'border-yellow-500 text-yellow-700'
																	: 'border-red-500 text-red-700'
														}
													>
														{Math.min(100, Math.max(0, section.score))}%
													</Badge>
												</div>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Sample Recommendations */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Icon name="question-mark-circled" className="h-5 w-5" />
											Sample Recommendations
										</CardTitle>
										<CardDescription>
											Key areas for ESG improvement (example suggestions)
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3">
											{mockRecommendations.map((rec, index) => (
												<li key={index} className="flex items-start gap-3">
													<Icon
														name="arrow-right"
														className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0"
													/>
													<span className="text-sm">{rec}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>

							{/* Conversion Sidebar */}
							<div className="space-y-6">
								{/* Main CTA */}
								<Card className="border-primary/20 border-2">
									<CardHeader>
										<CardTitle className="text-center">
											Ready for the Full Experience?
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="mb-4 space-y-2 text-center">
											<p className="text-muted-foreground text-sm">
												Get access to the complete assessment with:
											</p>
											<ul className="text-muted-foreground space-y-1 text-xs">
												<li>• 88+ comprehensive questions</li>
												<li>• Detailed scoring methodology</li>
												<li>• Professional reports (PDF)</li>
												<li>• Progress tracking & history</li>
												<li>• Industry benchmarking</li>
											</ul>
										</div>

										<Button className="w-full" size="lg" asChild>
											<Link to="/signup" onClick={handleSignupClick}>
												<Icon name="plus" className="mr-2 h-4 w-4" />
												Create Free Account
											</Link>
										</Button>

										<Button
											variant="outline"
											className="w-full"
											onClick={handleRestartDemo}
										>
											<Icon name="reset" className="mr-2 h-4 w-4" />
											Try Demo Again
										</Button>
									</CardContent>
								</Card>

								{/* Demo Info */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-sm">
											<Icon name="question-mark-circled" className="h-4 w-4" />
											About This Demo
										</CardTitle>
									</CardHeader>
									<CardContent className="text-muted-foreground space-y-2 text-sm">
										<p>
											This demo used 25 sample questions from our full ESG
											assessment framework.
										</p>
										<p>
											The complete assessment provides detailed insights into
											your organization's ESG maturity and compliance readiness.
										</p>
									</CardContent>
								</Card>

								{/* Support Links */}
								<Card>
									<CardContent className="pt-6">
										<div className="space-y-3 text-center">
											<Link
												to="/about"
												className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
												onClick={handleLearnMoreClick}
											>
												Learn More About Our Platform
											</Link>
											<Separator />
											<Link
												to="/support"
												className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
												onClick={handleContactClick}
											>
												Contact Sales Team
											</Link>
											<Separator />
											<Link
												to="/"
												className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
											>
												Return to Home
											</Link>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Additional Information */}
						<div className="mt-12 text-center">
							<div className="bg-muted/30 rounded-lg p-6">
								<h3 className="mb-2 font-semibold">
									Why Choose Our ESG Assessment?
								</h3>
								<div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
									<div className="flex items-center gap-2">
										<Icon name="check" className="h-4 w-4" />
										<span>Industry-standard framework</span>
									</div>
									<div className="flex items-center gap-2">
										<Icon name="arrow-right" className="h-4 w-4" />
										<span>Actionable insights</span>
									</div>
									<div className="flex items-center gap-2">
										<Icon name="avatar" className="h-4 w-4" />
										<span>Expert support</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
