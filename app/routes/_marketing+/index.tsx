import { Link, redirect } from 'react-router'
import { Button } from '#app/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
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
								href="#benefits"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Vantaggi
							</a>
							<a
								href="#features"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Funzionalità
							</a>
							<a
								href="#results"
								className="text-muted-foreground hover:text-primary transition-colors"
							>
								Risultati
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
								<Link to="/login">Accedi</Link>
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

			{/* Benefits Section */}
			<section id="benefits" className="bg-primary/10 px-4 py-20">
				<div className="container mx-auto lg:max-w-10/12">
					<div className="mb-16 text-center">
						<h2 className="text-foreground mb-16 text-4xl font-bold">
							Perché vale la pena capire come la tua azienda <br />
							<span className="text-primary">
								tutela i diritti delle persone con cui lavora?
							</span>
						</h2>
						<div className="grid justify-around gap-20 px-4 lg:grid-cols-3">
							<Card className="border-border/60 transition-shadow hover:shadow-lg">
								<CardHeader>
									<CardTitle className="flex flex-col items-center gap-6 text-center text-xl">
										<Icon name="scale" className="h-10 w-10 text-green-500" />
										<h2>Compliance normativa</h2>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-center">
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
									<CardTitle className="flex flex-col items-center gap-6 text-center text-xl">
										<Icon
											name="chart-no-axes-combined"
											className="h-10 w-10 text-green-500"
										/>
										<h2>Opportunità di mercato</h2>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-center">
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
									<CardTitle className="flex flex-col items-center gap-6 text-center text-xl">
										<Icon
											name="handshake"
											className="h-10 w-10 text-green-500"
										/>
										<h2>Fiducia e reputazione</h2>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-center">
									<p>
										Un’impresa che investe nel capitale umano e si prende cura
										delle persone dimostra visione, responsabilità e attenzione
										al futuro. Rispettare la dignità del lavoro, garantire
										condizioni eque e costruire relazioni corrette con
										dipendenti e fornitori rafforza la credibilità e il valore
										del brand.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="bg-secondary/30 px-4 py-20">
				<div className="container mx-auto lg:grid lg:max-w-10/12 lg:grid-cols-2 lg:gap-16">
					<div className="mb-8 text-center lg:mb-0 lg:text-left">
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
						<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-xl font-bold">
							Quanto sei già attento ai diritti umani?
						</p>
						<p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-xl font-bold">
							Cosa significa affrontare questo tema nella gestione della tua
							azienda?
						</p>
					</div>

					<div className="flex flex-col gap-8 lg:items-end">
						<Card className="border-border/60 transition-shadow hover:shadow-lg lg:w-12/12">
							<CardHeader>
								<CardTitle className="text-center text-2xl lg:text-left">
									Scoprilo con il questionario di prova
								</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-center lg:text-left">
								<div className="flex-col space-y-8 lg:grid lg:grid-cols-2 lg:items-end lg:space-y-0">
									<ul>
										<li>
											<Icon name="check" className="text-primary">
												25 domande
											</Icon>
										</li>
										<li>
											<Icon name="check" className="text-primary">
												5 minuti
											</Icon>
										</li>
										<li>
											<Icon name="check" className="text-primary">
												Senza registrazione
											</Icon>
										</li>
									</ul>
									<div className="place-self-end">
										<Button
											variant="outline"
											size="lg"
											className="text-md text-secondary-foreground px-8 py-3"
											asChild
										>
											<Link
												to="/demo/take"
												onClick={() =>
													trackDemoConversion('demo_clicked', 'hero')
												}
											>
												Prova la demo
											</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card className="border-border/60 transition-shadow hover:shadow-lg lg:w-12/12">
							<CardHeader>
								<CardTitle className="text-center text-2xl lg:text-left">
									Esegui la valutazione completa
								</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-center lg:text-left">
								{/* <div className="flex-col space-y-8 lg:flex-row lg:items-end lg:justify-between lg:space-y-0"> */}
								<div className="flex-col space-y-8 lg:grid lg:grid-cols-2 lg:items-end lg:space-y-0">
									<ul className="lg:mr-4">
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
									<div className="lg:place-self-end">
										<Button size="lg" className="text-md px-8 py-3" asChild>
											<Link to="/login">Inizia il questionario</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Results Section */}
			<section
				id="results"
				className="bg-primary/10 text-foreground px-4 py-20"
			>
				<div className="container mx-auto space-y-4 text-center lg:max-w-10/12">
					<h2 className="text-primary text-4xl font-bold">
						Cosa ottieni con <br />
						<span className="text-foreground">Vitae</span>
					</h2>

					<div className="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
						<div className="flex h-full flex-col space-y-8">
							<h3 className="text-primary text-2xl font-semibold">
								Se compili il questionario in autonomia
							</h3>
							<div className="flex h-full items-start space-x-4 text-left">
								<div>
									<Icon
										name="search-check"
										className="text-primary h-12 w-12"
									/>
								</div>
								<div className="flex flex-1 flex-col">
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Score e allineamento agli standard
									</h3>
									<div className="text-muted-foreground text-sm">
										<p>
											Ricevi una valutazione che indica il tuo livello di
											compliance rispetto agli standard sui diritti umani presi
											a riferimento:
										</p>
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
									</div>
								</div>
							</div>
							<div className="flex h-full items-start space-x-4 text-left">
								<div>
									<Icon name="pencil" className="text-primary h-12 w-12" />
								</div>
								<div className="flex flex-1 flex-col">
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Rendicontazione
									</h3>
									<div className="text-muted-foreground text-sm">
										<p>
											Ti segnaliamo quali requisiti sociali del questionario
											sono richiesti dal report di sostenibilità VSME (Voluntary
											Sustainability Reporting Standard for non-listed SMEs)
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex h-full flex-col space-y-8">
							<h3 className="text-primary text-2xl font-semibold">
								Se richiedi un supporto consulenziale
							</h3>
							<div className="flex items-start space-x-4 text-left">
								<div>
									<Icon name="wrench" className="text-primary h-12 w-12" />
								</div>
								<div className="flex flex-1 flex-col">
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Guida e strumenti
									</h3>
									<div className="text-muted-foreground text-sm">
										<p>
											Ti guidiamo nella compilazione del questionario
											identificando le azioni necessarie a migliorare la tua
											gestione. Ottieni guide e template per la realizzazione di
											policy e procedure
										</p>
									</div>
								</div>
							</div>
							<div className="flex h-full items-start space-x-4 text-left">
								<div>
									<Icon name="leaf" className="text-primary h-12 w-12" />
								</div>
								<div>
									<h3 className="text-foreground mb-2 text-xl font-semibold">
										Report di sostenibilità
									</h3>
									<div className="text-muted-foreground text-sm">
										<p>
											Integriamo i requisiti ESG mancanti e ti supportiamo nella
											redazione di un report di sostenibilità
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<section id="contact" className="mt-10">
					<Card className="border-primary mx-auto text-center transition-shadow hover:shadow-lg lg:w-6/12">
						<CardContent className="space-y-4">
							<h2 className="text-3xl font-semibold">
								Vuoi saperne di più o richiedere
								<br /> un supporto consulenziale?
							</h2>
							<h2 className="text-primary text-3xl font-semibold">
								Mettiamoci in contatto
							</h2>
							<span className="text-xl font-semibold">
								<Icon name="mail" className="text-primary h-10 w-10" /> Scrivici
								a vitae@we.co.it
							</span>
						</CardContent>
					</Card>
				</section>
			</section>

			{/* CTA Section */}

			{/* Footer */}
			<footer
				id="footer"
				className="bg-card text-card-foreground border-border border-t px-4 py-16"
			>
				<div className="container mx-auto lg:max-w-10/12">
					<div className="space-y-8">
						<p className="text-muted-foreground text-sm">
							Questa piattaforma è stata realizzata nell’ambito del progetto
							“VITAE” NODES, finanziato dal MUR sui fondi M4C2 - Investimento
							1.5 Avviso “Ecosistemi dell’Innovazione”, nell’ambito del PNRR
							finanziato dall’Unione europea – NextGenerationEU (Grant agreement
							Cod. n.ECS00000036).
						</p>
						<div className="md-grid-cols-2 mt-4 grid items-center justify-items-center gap-4 space-y-8 lg:grid-cols-4 lg:space-y-0">
							<img
								src="/public/img/next-gen-eu.png"
								alt="Placeholder"
								className="col-span-1 h-16"
							/>
							<img
								src="/public/img/mur.png"
								alt="Placeholder"
								className="col-span-1 h-16"
							/>
							<img
								src="/public/img/italia-domani.png"
								alt="Placeholder"
								className="col-span-1 h-16"
							/>
							<img
								src="/public/img/nodes.png"
								alt="Placeholder"
								className="col-span-1 h-16"
							/>
						</div>
					</div>
					<Separator className="bg-border my-8" />
					<div className="grid gap-8 md:grid-cols-4">
						<div>
							<div className="mb-4 flex items-center space-x-2">
								<Icon name="sun" className="text-primary h-8 w-8" />
								<span className="text-2xl font-bold">Vitae</span>
							</div>
							<p className="text-muted-foreground">
								Valutazione etica d'impresa
							</p>
							<p className="text-muted-foreground/50 text-sm">
								Nodes Vitae è un progetto di Weco impresa sociale nell’ambito
								del PNRR
								<Link to="https://we.co.it/studio-di-fattibilita/">
									<span className="hover:text-primary block font-bold">
										Vuoi saperne di più?
									</span>
								</Link>
							</p>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Weco</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<Link
										to="https://we.co.it/chi-siamo/"
										className="hover:text-primary"
									>
										Chi siamo
									</Link>
								</li>
								<li>
									<Link
										to="https://we.co.it/consulenze/"
										className="hover:text-primary"
									>
										Consulenze
									</Link>
								</li>
								<li>
									<Link
										to="https://we.co.it/progetti/"
										className="hover:text-primary"
									>
										Progetti
									</Link>
								</li>
								<li>
									<Link
										to="https://we.co.it/contatti/"
										className="hover:text-primary"
									>
										Contatti
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Percorsi correlati</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<Link
										to="/downloads/weco-consulenze-sostenibilità.pdf"
										className="hover:text-primary"
										reloadDocument
									>
										Sostenibilità per le imprese
									</Link>
									<span className="text-muted-foreground/50 block text-sm">
										Servizi di consulenza
									</span>
								</li>
								<li>
									<Link
										to="https://accademiadellavigna.it/"
										className="hover:text-primary"
									>
										Accademia della Vigna
									</Link>
									<span className="text-muted-foreground/50 block text-sm">
										Assunzione e formazione della manodopera nel vitivinicolo
									</span>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="mb-4 text-lg font-semibold">Informazioni</h3>
							<ul className="text-muted-foreground space-y-2">
								<li>
									<Link
										to="https://github.com/weco-dev/nodes-vitae"
										className="hover:text-primary"
									>
										Codice sorgente
									</Link>
								</li>
								<li>
									<Link
										to="https://we.co.it/privacy-policy"
										className="hover:text-primary"
									>
										Privacy policy
									</Link>
								</li>
								<li>
									<Link
										to="https://we.co.it/cookie-policy"
										className="hover:text-primary"
									>
										Cookie policy
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
