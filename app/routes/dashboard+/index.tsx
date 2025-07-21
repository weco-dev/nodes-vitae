export default function DashboardRoute() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 py-6 px-4 lg:px-6">
					<div className="text-center">
						<h1 className="text-2xl font-semibold mb-2">Welcome to your Dashboard</h1>
						<p className="text-muted-foreground">
							Your ESG assessment workspace
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
