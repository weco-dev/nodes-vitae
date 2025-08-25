export default function DashboardRoute() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 py-6 lg:px-6">
					<div className="text-center">
						<h1 className="mb-2 text-2xl font-semibold">
							Ti diamo il benvenuto su Vitae
						</h1>
						<p className="text-muted-foreground">Valutazione etica d'impresa</p>
					</div>
				</div>
			</div>
		</div>
	)
}
