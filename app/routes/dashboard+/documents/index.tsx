import {
	documents,
	documentGroups,
} from '../../../../data/uploads/documents/documents'
import DocumentCard from './components/documentCard'

export default function DocumentsRoute() {
	const documentsList = documents
	console.log('Documents: ', documents)
	console.log('Document groups: ', documentGroups)
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
							<div key={group}>
								<h2 className="mb-4 text-2xl font-semibold">{group}</h2>

								<div className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
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
