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
	const settingsItems = [
		{
			title: 'Profilo',
			description:
				"Gestisci le tue informazioni personali e i dettagli dell'account",
			href: '/dashboard/settings/profile',
		},
		{
			title: 'Password',
			description: 'Aggiorna la tua password e le impostazioni di sicurezza',
			href: '/dashboard/settings/profile/password',
		},
		{
			title: 'Autenticazione a 2 fattori',
			description: 'Aggiungi un livello extra di sicurezza al tuo account',
			href: '/dashboard/settings/profile/two-factor',
		},
		{
			title: 'Passkey',
			description: "Gestisci le tue passkey per l'autenticazione sicura",
			href: '/dashboard/settings/profile/passkeys',
		},
		{
			title: 'Account collegati',
			description: 'Gestisci le connessioni agli account di terze parti',
			href: '/dashboard/settings/profile/connections',
		},
		{
			title: 'Foto Profilo',
			description: 'Aggiorna la tua immagine del profilo',
			href: '/dashboard/settings/profile/photo',
		},
	]

	return (
		<div>
			<h2 className="my-4 text-xl font-semibold">Account</h2>
			<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
				{settingsItems.map((item) => (
					<Card key={item.href} className="hover:bg-muted/50 transition-colors">
						<Link to={item.href}>
							<CardHeader>
								<div className="flex items-center gap-2">
									<CardTitle className="text-lg">{item.title}</CardTitle>
								</div>
								<CardDescription>{item.description}</CardDescription>
							</CardHeader>
						</Link>
					</Card>
				))}
			</div>

			<hr className="border-muted-foreground/20 my-8" />
			<h2 className="my-4 text-xl font-semibold">Billing</h2>
			<p>...</p>

			<hr className="border-muted-foreground/20 my-8" />
			<h2 className="my-4 text-xl font-semibold">Notifiche</h2>
			<p>...</p>
		</div>
	)
}
