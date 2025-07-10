import { redirect, Link, useFetcher } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { generateTOTP } from '#app/utils/totp.server.ts'
import { type Route } from './+types/two-factor.index.ts'
import { twoFAVerificationType } from './two-factor.tsx'
import { twoFAVerifyVerificationType } from './two-factor.verify.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const verification = await prisma.verification.findUnique({
		where: { target_type: { type: twoFAVerificationType, target: userId } },
		select: { id: true },
	})
	return { is2FAEnabled: Boolean(verification) }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const { otp: _otp, ...config } = await generateTOTP()
	const verificationData = {
		...config,
		type: twoFAVerifyVerificationType,
		target: userId,
	}
	await prisma.verification.upsert({
		where: {
			target_type: { target: userId, type: twoFAVerifyVerificationType },
		},
		create: verificationData,
		update: verificationData,
	})
	return redirect('/dashboard/settings/profile/two-factor/verify')
}

export default function TwoFactorRoute({ loaderData }: Route.ComponentProps) {
	const enable2FAFetcher = useFetcher<typeof action>()

	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">
							Autenticazione a due fattori
						</h1>
						<p className="text-muted-foreground">
							Gestisci la sicurezza aggiuntiva del tuo account
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					<div className="flex flex-col gap-4">
						{loaderData.is2FAEnabled ? (
							<>
								<div className="bg-primary/5 rounded-lg border p-4">
									<p className="text-primary flex items-center gap-2 font-medium">
										<Icon name="check" className="h-5 w-5">
											Autenticazione 2FA attiva
										</Icon>
									</p>
									<p className="text-muted-foreground mt-1 text-sm">
										Il tuo account è protetto dall'autenticazione a due fattori
									</p>
								</div>
								<Link
									to="disable"
									className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
								>
									<Icon name="lock-open-1" className="h-4 w-4" />
									Disabilita 2FA
								</Link>
							</>
						) : (
							<>
								<div className="rounded-lg border p-4">
									<p className="flex items-center gap-2 font-medium">
										<Icon
											name="lock-open-1"
											className="h-5 w-5 text-orange-600"
										>
											2FA non attiva
										</Icon>
									</p>
									<p className="text-muted-foreground mt-2 text-sm">
										L'autenticazione a due fattori aggiunge un livello extra di
										sicurezza al tuo account. Dovrai inserire un codice da
										un'app di autenticazione come{' '}
										<a
											className="underline hover:no-underline"
											href="https://1password.com/"
										>
											1Password
										</a>{' '}
										per accedere.
									</p>
								</div>
								<enable2FAFetcher.Form method="POST">
									<StatusButton
										type="submit"
										name="intent"
										value="enable"
										status={
											enable2FAFetcher.state === 'loading' ? 'pending' : 'idle'
										}
										className="w-full"
									>
										Abilita 2FA
									</StatusButton>
								</enable2FAFetcher.Form>
							</>
						)}
					</div>

					{/* torna alla pagina profilo */}
					<div className="mt-4 text-sm">
						<Link to="../profile">
							<Icon name="arrow-left" className="mr-2">
								Torna alla pagina profilo
							</Icon>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
