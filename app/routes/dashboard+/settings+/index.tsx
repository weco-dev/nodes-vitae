import { Link } from 'react-router'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/index'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	return {}
}

export default function SettingsIndex() {
	return (
		<div>
			<div>
				<h1 className="text-2xl font-semibold">Impostazioni</h1>
				<p className="text-muted-foreground">
					Gestisci le impostazioni del tuo account
				</p>
			</div>

			<hr className="border-muted-foreground/20 my-8" />

			<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
				<Card className="hover:bg-muted/50 transition-colors">
					<Link to="profile">
						<CardHeader>
							<div className="flex items-center gap-2">
								<CardTitle className="text-lg">Il mio profilo</CardTitle>
							</div>
							<CardDescription>
								Visualizza e gestisci le tue informazioni personali del tuo
								profilo
							</CardDescription>
						</CardHeader>
					</Link>
				</Card>
				<Card className="hover:bg-muted/50 transition-colors">
					<Link to="profile/me">
						<CardHeader>
							<div className="flex items-center gap-2">
								<CardTitle className="text-lg">Piano pagamento</CardTitle>
							</div>
							<CardDescription>
								Visualizza e gestisci le informazioni di fatturazione e del tuo
								piano pagamento
							</CardDescription>
						</CardHeader>
					</Link>
				</Card>
				<Card className="hover:bg-muted/50 transition-colors">
					<Link to="profile/me">
						<CardHeader>
							<div className="flex items-center gap-2">
								<CardTitle className="text-lg">Notifiche</CardTitle>
							</div>
							<CardDescription>
								Visualizza e gestisci le notifiche che desideri ricevere in modo
								granulare
							</CardDescription>
						</CardHeader>
					</Link>
				</Card>
			</div>
		</div>
	)
}
