import {
	documents,
	documentGroups,
} from '../../../../data/uploads/documents/documents'
import DocumentCard from './components/documentCard'

export default function DocumentsRoute() {
	const documentsList = documents
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						{/* Header with enhanced styling */}
						<div className="mb-8 flex flex-col gap-4">
							<div className="space-y-1">
								<h1 className="text-3xl font-bold tracking-tight">
									Documentazione
								</h1>
								<p className="text-muted-foreground text-lg">
									Consulta e scarica la documentazione utile a compilare il
									questionario
								</p>
							</div>
						</div>

						{/* Documents cards with groups */}
						{documentGroups.map((group) => (
							<div key={group} className="mb-12">
								<div className="mb-6">
									<h2 className="text-2xl font-semibold">{group}</h2>
									<hr className="border-muted-foreground/20 mt-4" />
								</div>

								<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
									{documentsList
										.filter((document) => document.group === group)
										.map((document) => (
											<DocumentCard key={document.index} document={document} />
										))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
