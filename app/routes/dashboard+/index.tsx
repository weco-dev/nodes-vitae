import { ChartAreaInteractive } from '#app/components/chart-area-interactive.tsx'
import { DataTable } from '#app/components/data-table.tsx'
import { SectionCards } from '#app/components/section-cards.tsx'
import data from './data.json'

export default function DashboardRoute() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable data={data} />
				</div>
			</div>
		</div>
	)
}
