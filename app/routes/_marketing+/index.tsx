import { Link, redirect } from 'react-router'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '#app/components/ui/accordion.tsx'
import { Badge } from '#app/components/ui/badge'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
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
							Anche una piccola impresa ha un impatto sulle persone.
							<span className="text-primary block">Sai qual è il tuo?</span>
						</h2>
						<p className="text-muted-foreground mx-auto max-w-2xl text-xl">
							Il questionario di autovalutazione è pensato per supportare le
							imprese nell’adozione progressiva di un sistema di dovuta
							diligenza sui diritti umani in linea con gli standard europei e
							internazionali e con le certificazioni più usate nel settore
							agrifood.
						</p>
						<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-xl">
							Quanto sei già attento ai diritti umani?
						</p>
						<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-xl">
							Cosa significa affrontare questo tema nella gestione della tua
							azienda?
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						<Card className="border-border/60 transition-shadow hover:shadow-lg lg:col-start-2">
							<CardHeader>
								<CardTitle className="text-center text-xl">
									Scoprilo con il nostro questionario di prova
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p>25 Domande</p>
								<p>5 minuti</p>
								<p>Senza registrazione</p>
							</CardContent>
							<CardFooter className="justify-center">
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
							</CardFooter>
						</Card>
						<Card className="border-border/60 transition-shadow hover:shadow-lg">
							<CardHeader>
								<CardTitle className="text-center text-xl">
									Esegui la valutazione completa
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p>89 Domande</p>
								<p>In autonomia o con supporto</p>
								<p>Salva i risultati</p>
							</CardContent>
							<CardFooter className="justify-center">
								<Button size="lg" className="px-8 py-3 text-lg" asChild>
									<Link to="/login">Inizia il questionario</Link>
								</Button>
							</CardFooter>
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
							Perché vale la pena capire come la tua azienda tutela i diritti
							delle persone con cui lavora?
						</h2>
						<div className="grid gap-8 lg:grid-cols-3">
							<Card className="border-border/60 transition-shadow hover:shadow-lg">
								<CardHeader>
									<CardTitle className="text-center text-xl">
										Compliance normativa
									</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p>
										Le normative europee e le linee guida internazionali
										richiedono alle imprese di conoscere, prevenire, mitigare e
										comunicare i rischi legati ai diritti umani lungo tutta la
										filiera. Dotarsi di strumenti di autovalutazione e gestione
										responsabile è oggi una misura preventiva per non farsi
										trovare impreparati.
									</p>
								</CardContent>
							</Card>
							<Card className="border-border/60 transition-shadow hover:shadow-lg">
								<CardHeader>
									<CardTitle className="text-center text-xl">
										Opportunità di mercato
									</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p>
										Sempre più acquirenti — dalle cooperative ai distributori,
										fino ai gruppi GDO — valutano i fornitori anche in base alla
										loro capacità di gestire responsabilmente le relazioni con i
										lavoratori.
									</p>
								</CardContent>
							</Card>
							<Card className="border-border/60 transition-shadow hover:shadow-lg">
								<CardHeader>
									<CardTitle className="text-center text-xl">
										Fiducia e reputazione
									</CardTitle>
								</CardHeader>
								<CardContent className="text-center">
									<p>
										Un’impresa che investe nel capitale umano e si prende cura
										delle persone dimostra visione, responsabilità e attenzione
										al futuro. Rispettare la dignità del lavoro, garantire
										condizioni eque e costruire relazioni corrette con
										dipendenti e fornitori rafforza la fiducia della comunità e
										il valore del brand.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section - Variant */}
			<section id="benefits-variant" className="bg-secondary/30 px-4 py-20">
				<div className="container mx-auto">
					<div className="mb-16 text-center">
						<h2 className="text-foreground mb-4 text-4xl font-bold">
							Perché vale la pena capire come la tua azienda tutela i diritti
							delle persone con cui lavora?
						</h2>
						<div className="grid gap-8 lg:grid-cols-3">
							<div className="flex items-start space-x-4 text-left">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="plus"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Compliance normativa
									</h3>
									<p className="text-muted-foreground">
										Le normative europee e le linee guida internazionali
										richiedono alle imprese di conoscere, prevenire, mitigare e
										comunicare i rischi legati ai diritti umani lungo tutta la
										filiera. Dotarsi di strumenti di autovalutazione e gestione
										responsabile è oggi una misura preventiva per non farsi
										trovare impreparati.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4 text-left">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="plus"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Opportunità di mercato
									</h3>
									<p className="text-muted-foreground">
										Sempre più acquirenti — dalle cooperative ai distributori,
										fino ai gruppi GDO — valutano i fornitori anche in base alla
										loro capacità di gestire responsabilmente le relazioni con i
										lavoratori.
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-4 text-left">
								<div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
									<Icon
										name="plus"
										className="text-primary-foreground h-6 w-6"
									/>
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Fiducia e reputazione
									</h3>
									<p className="text-muted-foreground">
										Un’impresa che investe nel capitale umano e si prende cura
										delle persone dimostra visione, responsabilità e attenzione
										al futuro. Rispettare la dignità del lavoro, garantire
										condizioni eque e costruire relazioni corrette con
										dipendenti e fornitori rafforza la fiducia della comunità e
										il valore del brand.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-primary text-primary-foreground px-4 py-20">
				<div className="container mx-auto text-center">
					<h2 className="mb-4 text-4xl font-bold">Cosa ottieni con Vitae</h2>

					<div className="grid gap-8 lg:grid-cols-2">
						<div>
							<h3 className="mb-2 text-xl font-semibold">
								Se compili il questionario in autonomia
							</h3>

							<Accordion type="multiple" className="text-left">
								<AccordionItem value="item-1">
									<AccordionTrigger className="text-xl">
										Score e allineamento agli standard
									</AccordionTrigger>
									<AccordionContent className="text-lg">
										Ricevi una valutazione che indica il tuo livello di
										compliance rispetto agli standard sui diritti umani presi a
										riferimento:
										<ul className="list-disc pl-5">
											<li>
												Principi Guida delle Nazioni Unite su Imprese e Diritti
												Umani (UNGPs)
											</li>
											<li>
												OCSE-FAO Linee guida sulle filiere agricole responsabili
											</li>
											<li>
												OECD Linee guida per una condotta aziendale responsabile
											</li>
											<li>Standard Fairtrade per piccoli produttori</li>
											<li>
												Disciplinare Equalitas per la sostenibilità vitivinicola
											</li>
										</ul>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2">
									<AccordionTrigger className="text-xl">
										Rendicontazione
									</AccordionTrigger>
									<AccordionContent className="text-lg">
										Ti segnaliamo quali requisiti sociali del questionario sono
										richiesti dal report di sostenibilità VSME (Voluntary
										Sustainability Reporting Standard for non-listed SMEs)
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
						<div>
							<h3 className="text-primary-foreground mb-2 text-xl font-semibold">
								Se richiedi un supporto consulenziale
							</h3>
							<Accordion type="multiple" className="text-left">
								<AccordionItem value="item-3">
									<AccordionTrigger className="text-xl">
										Guida e strumenti
									</AccordionTrigger>
									<AccordionContent className="text-lg">
										Ti guidiamo nella compilazione del questionario
										identificando le azioni necessarie a migliorare la tua
										gestione. Ottieni guide e template per la realizzazione di
										policy e procedure.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-4">
									<AccordionTrigger className="text-xl">
										Report di sostenibilità
									</AccordionTrigger>
									<AccordionContent className="text-lg">
										Integriamo i requisiti ESG mancanti e ti supportiamo nella
										redazione di un report di sostenibilità.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
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
					<div>
						<div className="text-muted-foreground">
							Questa piattaforma è stata realizzata nell’ambito del progetto
							“VITAE” NODES, finanziato dal MUR sui fondi M4C2 - Investimento
							1.5 Avviso “Ecosistemi dell’Innovazione”, nell’ambito del PNRR
							finanziato dall’Unione europea – NextGenerationEU (Grant agreement
							Cod. n.ECS00000036)
						</div>
						<div className="md-grid-cols-2 mt-4 grid items-center justify-items-center gap-4 lg:grid-cols-4">
							<img
								src="/public/img/placeholder.svg"
								alt="Placeholder"
								className="col-span-1 h-36 w-36"
							/>
							<img
								src="/public/img/placeholder.svg"
								alt="Placeholder"
								className="col-span-1 h-36 w-36"
							/>
							<img
								src="/public/img/placeholder.svg"
								alt="Placeholder"
								className="col-span-1 h-36 w-36"
							/>
							<img
								src="/public/img/placeholder.svg"
								alt="Placeholder"
								className="col-span-1 h-36 w-36"
							/>
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
