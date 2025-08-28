import { Link } from 'react-router'
import { Card, CardContent } from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { type Document } from '../../../../../data/uploads/documents/documents'

export default function DocumentCard({ document }: { document: Document }) {
	return (
		<Link
			key={`attachment-${document.index}`}
			to={`/downloads/${document.fileName}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Card className="gap-1">
				<CardContent>
					<div className="text-foreground/70">
						<Icon name="file-down" /> Allegato {document.index}
					</div>
					<p className="mt-2 text-lg font-bold">{document.title}</p>
					{/* <p className="text-muted-foreground text-xs">{document.author}</p>
					<p className="text-muted-foreground text-xs">{document.year}</p> */}
				</CardContent>
			</Card>
		</Link>
	)
}
