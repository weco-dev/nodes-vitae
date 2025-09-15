import { Link } from 'react-router'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { type Document } from '../../../../../data/uploads/documents/documents'

export default function DocumentCard({ document }: { document: Document }) {
	return (
		<Link
			key={`attachment-${document.index}`}
			to={`/downloads/${document.fileName}`}
			target="_blank"
			rel="noopener noreferrer"
			className="block transition-transform hover:scale-[1.02]"
		>
			<Card className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card hover:bg-muted/50 group bg-gradient-to-t shadow-xs transition-colors">
				<CardHeader className="space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
								<Icon name="download" className="text-primary h-6 w-6" />
							</div>
							<span className="text-muted-foreground text-sm font-medium">
								Allegato {document.index}
							</span>
						</div>
					</div>
					<div className="space-y-4">
						<CardTitle className="group-hover:text-primary text-lg leading-tight transition-colors">
							{document.title}
						</CardTitle>
						<CardDescription className="flex items-center gap-2">
							<Icon name="file-down" className="h-4 w-4" />
							Clicca per scaricare il documento
						</CardDescription>
					</div>
				</CardHeader>
			</Card>
		</Link>
	)
}
