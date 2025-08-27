import { Link } from 'react-router'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { type Document } from '../../../../../data/uploads/documents/documents'

export default function DocumentCard({ document }: { document: Document }) {
	return (
		<Link
			key={document.index}
			to={`/downloads/${document.fileName}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Card className="gap-1">
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<CardTitle className="text-md font-medium">
						<Icon name="file-down" /> {document.number}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-xl font-bold">{document.title}</div>
					{/* <p className="text-muted-foreground text-xs">{document.author}</p>
					<p className="text-muted-foreground text-xs">{document.year}</p> */}
				</CardContent>
			</Card>
		</Link>
	)
}
