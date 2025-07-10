import { Link, useFetcher } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireRecentVerification } from '#app/routes/_auth+/verify.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useDoubleCheck } from '#app/utils/misc.tsx'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { type Route } from './+types/two-factor.disable.ts'
import { twoFAVerificationType } from './two-factor.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	await requireRecentVerification(request)
	return {}
}

export async function action({ request }: Route.ActionArgs) {
	await requireRecentVerification(request)
	const userId = await requireUserId(request)
	await prisma.verification.delete({
		where: { target_type: { target: userId, type: twoFAVerificationType } },
	})
	return redirectWithToast('/dashboard/settings/profile/two-factor', {
		title: '2FA Disabilitato',
		description: "L'autenticazione a due fattori è stata disabilitata.",
	})
}

export default function TwoFactorDisableRoute() {
	const disable2FAFetcher = useFetcher<typeof action>()
	const dc = useDoubleCheck()

	return (
		<div className="flex h-full">
			<div className="w-full max-w-md">
				<div className="space-y-6">
					<div>
						<h1 className="text-2xl font-semibold">Disabilita 2FA</h1>
						<p className="text-muted-foreground mt-2">
							Disabilitare l'autenticazione a due fattori non è raccomandato
						</p>
					</div>

					<disable2FAFetcher.Form method="POST" className="space-y-6">
						<div className="space-y-4">
							<p className="text-muted-foreground text-sm">
								Se desideri procedere con la disabilitazione dell'autenticazione
								a due fattori, clicca il pulsante qui sotto.
							</p>

							<StatusButton
								variant="destructive"
								status={
									disable2FAFetcher.state === 'loading' ? 'pending' : 'idle'
								}
								{...dc.getButtonProps({
									name: 'intent',
									value: 'disable',
									type: 'submit',
								})}
							>
								{dc.doubleCheck ? 'Sei sicuro?' : 'Disabilita 2FA'}
							</StatusButton>
						</div>
					</disable2FAFetcher.Form>
					<div className="mt-6">
						<Link
							to="/dashboard/settings/profile"
							className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center text-sm"
						>
							<Icon name="arrow-left" className="mr-2 h-4 w-4" />
							Torna alla pagina profilo
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
