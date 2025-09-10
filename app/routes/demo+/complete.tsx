/**
 * @fileoverview Demo Complete Route - Demo Completion & Conversion Page
 *
 * This route displays the completion page for the demo assessment and focuses on
 * converting demo users to registered users. It shows mock results and provides
 * clear paths for user conversion.
 */

import { useEffect } from 'react'
import { Link } from 'react-router'
import { ClientOnly } from '#app/components/client-only.tsx'
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
	demoRadio01,
	demoRadio02,
} from '#app/utils/assessment/radiogroup-answers.ts'
import {
	trackDemoCompletion,
	trackDemoConversion,
	trackDemoReset,
} from '#app/utils/demo-analytics.ts'
import {
	clearDemoData,
	getDemoSessionStats,
	getMostAnsweredChoice,
	getRecommendationByChoice,
} from '#app/utils/demo-storage.ts'
import { type Route } from './+types/complete'

export async function loader({}: Route.LoaderArgs) {
	// No authentication required for demo
	return {}
}

/**
 * Get the text value corresponding to a choice value from demo radio options
 */
function getChoiceText(choiceValue: string): string {
	// Get texts from both demo radio option sets for the same value
	const option1 = demoRadio01.find((option) => option.value === choiceValue)
	const option2 = demoRadio02.find((option) => option.value === choiceValue)

	const texts = []
	if (option1) texts.push(option1.text.toLowerCase())
	if (option2) texts.push(option2.text.toLowerCase())

	return texts.length > 0 ? texts.join('; ') : choiceValue
}

export default function DemoComplete() {
	useEffect(() => {
		trackDemoCompletion()
	}, [])

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
						<ClientOnly fallback={<div>Loading demo results...</div>}>
							{() => (
								<DemoResultsContent
									onRestartDemo={handleRestartDemo}
									onSignupClick={handleSignupClick}
									onLearnMoreClick={handleLearnMoreClick}
									onContactClick={handleContactClick}
								/>
							)}
						</ClientOnly>
					</div>
				</div>
			</main>
		</div>
	)
}

function DemoResultsContent({
	onRestartDemo,
	onSignupClick,
	onLearnMoreClick,
	onContactClick,
}: {
	onRestartDemo: () => void
	onSignupClick: () => void
	onLearnMoreClick: () => void
	onContactClick: () => void
}) {
	// Now this runs only on the client where localStorage is available

	const sessionStats = getDemoSessionStats()
	const choiceAnalysis = getMostAnsweredChoice()
	const recommendation = getRecommendationByChoice(choiceAnalysis.choice)

	return (
		<>
			{/* Completion Header */}
			<div className="mb-8 text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
					<Icon
						name="check"
						className="h-8 w-8 text-green-600 dark:text-green-400"
					/>
				</div>
				<h1 className="mb-2 text-3xl font-bold">Demo completata! 🎉</h1>
				<p className="text-muted-foreground text-lg">
					Hai completato il questionario demo rispondendo a{' '}
					{sessionStats.questionsAnswered} domande. <br />
					Ecco un riepilogo dei tuoi risultati e i prossimi passi consigliati.
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
								Panoramica risultati
							</CardTitle>
							<CardDescription>
								Hai risposto a {sessionStats.questionsAnswered} domande
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-3">
								<div className="text-muted-foreground flex items-center justify-between text-sm">
									<span>Domande risposte</span>
									<span className="font-medium">
										{sessionStats.questionsAnswered} di{' '}
										{sessionStats.answerableQuestions}
									</span>
								</div>
								<div className="text-muted-foreground flex items-center justify-between text-sm">
									<span>Tasso di completamento</span>
									<span className="font-medium">
										{Math.round(sessionStats.completionRate * 100)}%
									</span>
								</div>
								{choiceAnalysis.totalRadioAnswers > 0 &&
									choiceAnalysis.choice && (
										<div className="text-muted-foreground text-sm">
											<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
												<span className="font-medium">
													Risposta più frequente:{' '}
													{getChoiceText(choiceAnalysis.choice)}
												</span>
												<span className="text-right font-medium whitespace-nowrap sm:ml-4">
													{choiceAnalysis.count}{' '}
													{choiceAnalysis.count === 1 ? 'volta' : 'volte'}
												</span>
											</div>
										</div>
									)}
							</div>
						</CardContent>
					</Card>

					{/* Personalized Recommendation */}
					{choiceAnalysis.totalRadioAnswers > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Icon name="clipboard-check" className="h-5 w-5" />
									{recommendation.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{recommendation.description}
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Conversion Sidebar */}
				<div className="space-y-6">
					{/* Main CTA */}
					<Card className="border-primary/20 border-2">
						<CardHeader>
							<CardTitle className="text-center">
								Vuoi procedere con la valutazione completa?
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="mb-4 space-y-2 text-center">
								<ul className="text-muted-foreground space-y-1 text-left text-sm">
									<li>
										<Icon name="check" className="text-primary">
											89 domande
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											In autonomia o con supporto
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											Salva i risultati
										</Icon>
									</li>
								</ul>
							</div>

							<Button className="w-full" size="lg" asChild>
								<Link to="/signup" onClick={onSignupClick}>
									<Icon name="plus" className="mr-2 h-4 w-4" />
									Crea il tuo account gratuito
								</Link>
							</Button>

							<Button
								variant="outline"
								className="w-full"
								onClick={onRestartDemo}
							>
								<Icon name="reset" className="mr-2 h-4 w-4" />
								Riprova la demo
							</Button>
						</CardContent>
					</Card>

					{/* Demo Info */}
					<Card className="gap-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm">
								<Icon name="question-mark-circled" className="h-4 w-4" />
								Serve aiuto?
							</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-2 text-sm">
							<p>
								Puoi contattare il nostro supporto in qualsiasi momento per
								segnalare bug o problemi di funzionamento:
							</p>
							<span className="text-primary mt-4 block">
								<Icon name="mail" size="md" className="text-foreground">
									vitae@we.co.it
								</Icon>
							</span>
						</CardContent>
					</Card>

					{/* Support Links */}
					<Card>
						<CardContent>
							<div className="space-y-3 text-center">
								<Link
									to="/"
									className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
									onClick={onLearnMoreClick}
								>
									Ritorna all'inizio
								</Link>
								<Separator />
								<Link
									to="/#contact"
									className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
									onClick={onContactClick}
								>
									Contatta i nostri consulenti
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}
