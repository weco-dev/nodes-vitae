import { Link, redirect } from 'react-router'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '#app/components/ui/card'
import { Icon } from '#app/components/ui/icon'
import { Separator } from '#app/components/ui/separator'
import { getUserId } from '#app/utils/auth.server.ts'
import { trackDemoConversion } from '#app/utils/demo-analytics.ts'
import { type Route } from './+types/index'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await getUserId(request)

	if (userId) {
		const redirectTo = '/dashboard'
		return redirect(redirectTo)
	}
}

export default function Index() {
	return (
		<div className="from-secondary/30 to-background min-h-screen bg-gradient-to-b">
			{/* Header */}
			<header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Icon name="sun" className="text-primary h-8 w-8" />
							<span className="text-foreground text-2xl font-bold">Vitae</span>
						</div>
						<nav className="hidden items-center space-x-6 md:flex">
							<a
								href="#features"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Funzionalità
							</a>
							<a
								href="#benefits"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Vantaggi
							</a>
							<a
								href="#contact"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Contatti
							</a>
							<Button variant="outline" asChild>
								<Link to="/demo/take">Prova la demo</Link>
							</Button>
							<Button asChild>
								<Link to="/login">Inizia il questionario</Link>
							</Button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="px-4 py-20">
				<div className="container mx-auto text-center">
					{/* <Badge variant="secondary" className="mb-4">
						🍇 Piattaforma ESG per il settore vitivinicolo
					</Badge> */}
					<h1 className="text-foreground mb-6 text-5xl leading-tight font-bold md:text-6xl">
						Vitae
						<span className="text-primary block">
							valutazione etica d'impresa
						</span>
					</h1>
					<p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl leading-relaxed">
						Attraverso un questionario guidato ti aiutiamo a valutare la due
						diligence sui diritti umani e a tracciare la rotta operativa per
						migliorare la responsabilità sociale della tua impresa.
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							variant="outline"
							size="lg"
							className="px-8 py-3 text-lg"
							asChild
						>
							<Link
								to="/demo/take"
								onClick={() => trackDemoConversion('demo_clicked', 'hero')}
							>
								Prova la demo
							</Link>
						</Button>
						<Button size="lg" className="px-8 py-3 text-lg" asChild>
							<Link to="/login">Inizia il questionario</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="bg-primary/10 px-4 py-20">
				<div className="container mx-auto">
					<div className="mb-16 text-center">
						<h2 className="text-card-foreground mb-4 text-4xl font-bold">
							Strumenti specializzati per il vino
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
							Soluzioni verticali pensate specificamente per le esigenze delle
							aziende vitivinicole
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						<Card className="border-border/60 transition-shadow hover:shadow-lg">
							<CardHeader>
								<div className="bg-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
									<Icon
										name="check"
										className="text-secondary-foreground h-6 w-6"
									/>
								</div>
								<CardTitle className="text-xl">
									Autovalutazione Guidata
								</CardTitle>
								<CardDescription>
									Questionari strutturati per valutare la sostenibilità sociale
									della tua azienda
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-muted-foreground space-y-2 text-sm">
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Criteri ESG specifici per il settore
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Domande adattate alle PMI
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Processo step-by-step
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="border-border/60 transition-shadow hover:shadow-lg">
							<CardHeader>
								<div className="bg-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
									<Icon
										name="file-text"
										className="text-secondary-foreground h-6 w-6"
									/>
								</div>
								<CardTitle className="text-xl">Conformità Normativa</CardTitle>
								<CardDescription>
									Strumenti allineati con le normative europee e italiane
									vigenti
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-muted-foreground space-y-2 text-sm">
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Direttiva CSRD europea
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Standard EFRAG ESRS
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Aggiornamenti automatici
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="border-border/60 transition-shadow hover:shadow-lg">
							<CardHeader>
								<div className="bg-secondary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
									<Icon
										name="dots-horizontal"
										className="text-secondary-foreground h-6 w-6"
									/>
								</div>
								<CardTitle className="text-xl">Report Personalizzati</CardTitle>
								<CardDescription>
									Dashboard e report dettagliati per monitorare i progressi
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="text-muted-foreground space-y-2 text-sm">
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Metriche di sostenibilità
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Piani di miglioramento
									</li>
									<li className="flex items-center">
										<Icon name="check" className="text-primary mr-2 h-4 w-4" />
										Export per stakeholder
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Demo Section */}
			<section className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-20 dark:from-blue-950/20 dark:to-indigo-950/20">
				<div className="container mx-auto">
					<div className="mx-auto max-w-4xl text-center">
						<div className="mb-6">
							<Badge variant="outline" className="mb-4">
								<Icon name="arrow-right" className="mr-2 h-4 w-4" />
								Demo Gratuita
							</Badge>
							<h2 className="text-foreground mb-4 text-4xl font-bold">
								Scopri la Piattaforma in 5 Minuti
							</h2>
							<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
								Prova subito il nostro sistema di valutazione ESG con 25 domande
								rappresentative. Nessuna registrazione richiesta.
							</p>
						</div>

						<div className="mb-8 grid gap-6 md:grid-cols-3">
							<div className="flex flex-col items-center text-center">
								<div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
									<Icon
										name="clock"
										className="h-6 w-6 text-blue-600 dark:text-blue-400"
									/>
								</div>
								<h3 className="mb-1 font-semibold">5 Minuti</h3>
								<p className="text-muted-foreground text-sm">
									Tempo medio di completamento
								</p>
							</div>
							<div className="flex flex-col items-center text-center">
								<div className="mb-3 rounded-full bg-green-100 p-3 dark:bg-green-900">
									<Icon
										name="check"
										className="h-6 w-6 text-green-600 dark:text-green-400"
									/>
								</div>
								<h3 className="mb-1 font-semibold">25 Domande</h3>
								<p className="text-muted-foreground text-sm">
									Esempi da tutte le sezioni ESG
								</p>
							</div>
							<div className="flex flex-col items-center text-center">
								<div className="mb-3 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
									<Icon
										name="check"
										className="h-6 w-6 text-purple-600 dark:text-purple-400"
									/>
								</div>
								<h3 className="mb-1 font-semibold">Senza Registrazione</h3>
								<p className="text-muted-foreground text-sm">
									Inizia subito, dati salvati localmente
								</p>
							</div>
						</div>

						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button size="lg" className="px-8 py-3 text-lg" asChild>
								<Link
									to="/demo/take"
									onClick={() => trackDemoConversion('demo_clicked', 'section')}
								>
									<Icon name="arrow-right" className="mr-2 h-5 w-5" />
									Inizia la Demo
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="px-8 py-3 text-lg"
								asChild
							>
								<Link to="/about">
									<Icon name="question-mark-circled" className="mr-2 h-5 w-5" />
									Scopri di Più
								</Link>
							</Button>
						</div>

						<div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
							<p className="text-muted-foreground text-sm">
								<Icon
									name="question-mark-circled"
									className="mr-1 inline h-4 w-4"
								/>
								La demo mostra le funzionalità principali della piattaforma con
								dati di esempio. Per accedere alla valutazione completa con 88+
								domande, crea un account gratuito.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section id="benefits" className="bg-secondary/30 px-4 py-20">
				<div className="container mx-auto">
					<div className="mb-16 text-center">
						<h2 className="text-foreground mb-4 text-4xl font-bold">
							Perché Scegliere Vitae?
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
							Vantaggi concreti per la tua azienda vitivinicola
						</p>
					</div>
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div className="space-y-8">
							<div className="flex items-start space-x-4">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="plus"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Specifico per il Settore Vino
									</h3>
									<p className="text-muted-foreground">
										Non una soluzione generica, ma strumenti pensati
										specificamente per le peculiarità delle aziende vitivinicole
										e i loro processi produttivi.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="dots-horizontal"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Pensato per Micro e PMI
									</h3>
									<p className="text-muted-foreground">
										Strumenti accessibili e user-friendly, senza la complessità
										delle soluzioni enterprise. Perfetto per aziende familiari e
										cooperative.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="lock-closed"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Conformità Garantita
									</h3>
									<p className="text-muted-foreground">
										Sempre aggiornato con le ultime normative ESG europee e
										italiane, per essere pronti alle verifiche e audit.
									</p>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-card border-border/60 rounded-2xl border p-8 shadow-xl">
								<h4 className="text-card-foreground mb-6 text-center text-2xl font-bold">
									Dashboard ESG
								</h4>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Sostenibilità Sociale
										</span>
										<Badge variant="secondary">85%</Badge>
									</div>
									<div className="bg-muted h-2 w-full rounded-full">
										<div
											className="bg-primary h-2 rounded-full"
											style={{ width: '85%' }}
										></div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Benessere Lavoratori
										</span>
										<Badge variant="secondary">92%</Badge>
									</div>
									<div className="bg-muted h-2 w-full rounded-full">
										<div
											className="bg-primary h-2 rounded-full"
											style={{ width: '92%' }}
										></div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Coinvolgimento Comunità
										</span>
										<Badge variant="secondary">78%</Badge>
									</div>
									<div className="bg-muted h-2 w-full rounded-full">
										<div
											className="bg-primary h-2 rounded-full"
											style={{ width: '78%' }}
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-primary px-4 py-20">
				<div className="container mx-auto text-center">
					<h2 className="text-primary-foreground mb-4 text-4xl font-bold">
						Inizia il Tuo Percorso ESG Oggi
					</h2>
					<p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-xl">
						Unisciti alle aziende vitivinicole che stanno già costruendo un
						futuro più sostenibile
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							variant="secondary"
							className="px-8 py-3 text-lg"
							asChild
						>
							<Link to="/signup">
								<Icon name="arrow-right" className="mr-2 h-5 w-5" />
								Prova gratuita 30 giorni
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary px-8 py-3 text-lg"
						>
							<Icon name="clock" className="mr-2 h-5 w-5" />
							Prenota una demo
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer
				id="contact"
				className="bg-card text-card-foreground border-border border-t px-4 py-16"
			>
				<div className="container mx-auto">
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center space-x-2">
								<Icon name="sun" className="text-primary h-8 w-8" />
								<span className="text-2xl font-bold">Vitae</span>
							</div>
							<p className="text-muted-foreground mb-4">
								La piattaforma ESG dedicata alle aziende vitivinicole italiane.
							</p>
							<div className="flex space-x-4">
								<Icon
									name="github-logo"
									className="text-muted-foreground hover:text-primary h-5 w-5 cursor-pointer"
								/>
								<Icon
									name="link-2"
									className="text-muted-foreground hover:text-primary h-5 w-5 cursor-pointer"
								/>
								<Icon
									name="envelope-closed"
									className="text-muted-foreground hover:text-primary h-5 w-5 cursor-pointer"
								/>
							</div>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Prodotto</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<a href="#" className="hover:text-primary">
										Funzionalità
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Prezzi
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Demo
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										API
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Supporto</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<a href="#" className="hover:text-primary">
										Centro Assistenza
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Documentazione
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Webinar
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Community
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Azienda</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<a href="#" className="hover:text-primary">
										Chi siamo
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Blog
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Carriere
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary">
										Contatti
									</a>
								</li>
							</ul>
						</div>
					</div>
					<Separator className="bg-border my-8" />
					<div className="flex flex-col items-center justify-between md:flex-row">
						<p className="text-muted-foreground text-sm">
							© 2025 Vitae. Tutti i diritti riservati.
						</p>
						<div className="text-muted-foreground mt-4 flex space-x-6 text-sm md:mt-0">
							<a href="#" className="hover:text-primary">
								Privacy Policy
							</a>
							<a href="#" className="hover:text-primary">
								Termini di Servizio
							</a>
							<a href="#" className="hover:text-primary">
								Cookie Policy
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
