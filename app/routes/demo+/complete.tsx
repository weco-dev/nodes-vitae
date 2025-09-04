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
							</div>
						</CardContent>
					</Card>

					{/* Personalized Recommendation */}
					{choiceAnalysis.totalRadioAnswers > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Icon name="question-mark-circled" className="h-5 w-5" />
									Cosa puoi fare ora?
								</CardTitle>
								<CardDescription>
									{choiceAnalysis.choice ? (
										<>
											Basata sulle tue risposte ({choiceAnalysis.count} domande
											con scelta "{choiceAnalysis.choice}")
										</>
									) : (
										<>
											Basata sulle tue {choiceAnalysis.totalRadioAnswers}{' '}
											risposte
										</>
									)}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="mb-2 text-lg font-semibold">
										{recommendation.title}
									</h4>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{recommendation.description}
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Sample Recommendations */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon name="question-mark-circled" className="h-5 w-5" />
								Cosa puoi fare ora?
							</CardTitle>
							<CardDescription>
								Raccomandazioni basate sulle tue risposte
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div>
								<p className="text-muted-foreground mb-2 italic">
									Se la maggioranza delle tue risposte è “Non ci ho mai pensato”
									o “Per niente importante”
								</p>
								<ul className="mb-4 space-y-2">
									<li>
										<Icon name="check" className="text-primary">
											Iniziare a valutare i rischi nella tua attività
											quotidiana, come suggerisce il primo principio OCSE.
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											Impegnarti a raccogliere informazioni e a creare una base
											di conoscenza: chi lavora per te, in che condizioni, con
											quali contratti.
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											Scoprire strumenti semplici e guidati per fare i primi
											passi: il nostro questionario completo può aiutarti in
											modo pratico.
										</Icon>
									</li>
								</ul>
							</div>
							<div>
								<p className="text-muted-foreground mb-2 italic">
									Se la maggioranza delle tue risposte è “A volte ci penso ma
									non ho fatto nulla al riguardo” o “Poco importante”
								</p>
								<p className="mb-4 space-y-2">
									Hai già identificato alcuni temi importanti per i diritti dei
									lavoratori, ma secondo i principi OCSE è fondamentale passare
									dalla consapevolezza all’azione. Solo così potrai prevenire o
									ridurre possibili rischi.
								</p>
							</div>
							<div>
								<p className="text-muted-foreground mb-2 italic">
									Se la maggioranza delle tue risposte è “Si e ho agito per
									assicurarmene” o “Molto importante” [3]
								</p>
								<ul className="mb-4 space-y-2">
									<li>
										<Icon name="check" className="text-primary">
											Creare un sistema di monitoraggio continuo, anche
											documentando le buone pratiche che già applichi.
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											Comunicare questi impegni ai tuoi partner e collaboratori.
										</Icon>
									</li>
									<li>
										<Icon name="check" className="text-primary">
											Considerare piccoli strumenti di verifica regolare e
											accesso a sistemi di reclamo, per garantire miglioramenti
											continui.
										</Icon>
									</li>
								</ul>
							</div>
							{/* <ul className="space-y-3">
								{mockRecommendations.map((rec, index) => (
									<li key={index} className="flex items-start gap-3">
										<Icon
											name="arrow-right"
											className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0"
										/>
										<span className="text-sm">{rec}</span>
									</li>
								))}
							</ul> */}
						</CardContent>
					</Card>
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
