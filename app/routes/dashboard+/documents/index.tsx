import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '#app/components/ui/card.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { Icon } from 'lucide-react'
import { documents } from '../../../../data/uploads/documents/documents'
import { type Route } from './+types/index'
import { Link, useLoaderData } from 'react-router'
import { url } from 'inspector'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const url = new URL(request.url)
	return { domain: url.origin }
}

export default function DocumentsRoute() {
	const { domain } = useLoaderData<typeof loader>()
	const documentsList = documents
	const path = domain
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
									Manage and track your ESG assessment progress
								</p>
							</div>
						</div>

						{/* Documents cards */}
						<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{documentsList.map((document) => (
								<Link
									key={document.id}
									to={`/downloads/${document.fileName}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0">
											<CardTitle className="text-sm font-medium">
												Total Assessments
											</CardTitle>
											{/* <Icon
										name="file-text"
										className="text-muted-foreground h-4 w-4"
									/> */}
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{document.title}</div>
											<p className="text-muted-foreground text-xs">
												{document.author}
											</p>
											<p className="text-muted-foreground text-xs">
												{document.year}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
