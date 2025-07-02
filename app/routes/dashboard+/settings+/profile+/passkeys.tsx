import { startRegistration } from '@simplewebauthn/browser'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { Form, Link, useRevalidator } from 'react-router'
import { z } from 'zod'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/passkeys.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const passkeys = await prisma.passkey.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			deviceType: true,
			createdAt: true,
		},
	})
	return { passkeys }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	if (intent === 'delete') {
		const passkeyId = formData.get('passkeyId')
		if (typeof passkeyId !== 'string') {
			return Response.json(
				{ status: 'error', error: 'Invalid passkey ID' },
				{ status: 400 },
			)
		}

		await prisma.passkey.delete({
			where: {
				id: passkeyId,
				userId, // Ensure the passkey belongs to the user
			},
		})
		return Response.json({ status: 'success' })
	}

	return Response.json(
		{ status: 'error', error: 'Invalid intent' },
		{ status: 400 },
	)
}

const RegistrationOptionsSchema = z.object({
	options: z.object({
		rp: z.object({
			id: z.string(),
			name: z.string(),
		}),
		user: z.object({
			id: z.string(),
			name: z.string(),
			displayName: z.string(),
		}),
		challenge: z.string(),
		pubKeyCredParams: z.array(
			z.object({
				type: z.literal('public-key'),
				alg: z.number(),
			}),
		),
		authenticatorSelection: z
			.object({
				authenticatorAttachment: z
					.enum(['platform', 'cross-platform'])
					.optional(),
				residentKey: z
					.enum(['required', 'preferred', 'discouraged'])
					.optional(),
				userVerification: z
					.enum(['required', 'preferred', 'discouraged'])
					.optional(),
				requireResidentKey: z.boolean().optional(),
			})
			.optional(),
	}),
}) satisfies z.ZodType<{ options: PublicKeyCredentialCreationOptionsJSON }>

export default function Passkeys({ loaderData }: Route.ComponentProps) {
	const revalidator = useRevalidator()
	const [error, setError] = useState<string | null>(null)

	async function handlePasskeyRegistration() {
		try {
			setError(null)
			const resp = await fetch('/webauthn/registration')
			const jsonResult = await resp.json()
			const parsedResult = RegistrationOptionsSchema.parse(jsonResult)

			const regResult = await startRegistration({
				optionsJSON: parsedResult.options,
			})

			const verificationResp = await fetch('/webauthn/registration', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(regResult),
			})

			if (!verificationResp.ok) {
				throw new Error('Failed to verify registration')
			}

			void revalidator.revalidate()
		} catch (err) {
			console.error('Failed to create passkey:', err)
			setError('Errore nella creazione del passkey. Riprova.')
		}
	}

	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">Passkey</h1>
						<p className="text-muted-foreground">
							Gestisci i tuoi passkey per un accesso sicuro
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					{error ? (
						<div className="bg-destructive/15 text-destructive rounded-lg p-4 text-sm">
							{error}
						</div>
					) : null}

					{loaderData.passkeys.length ? (
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">I tuoi passkey:</p>
								<form action={handlePasskeyRegistration}>
									<Button
										type="submit"
										variant="secondary"
										size="sm"
										className="flex items-center gap-2"
									>
										<Icon name="plus" className="h-4 w-4" />
										Aggiungi
									</Button>
								</form>
							</div>
							<ul className="flex flex-col gap-3">
								{loaderData.passkeys.map((passkey) => (
									<li
										key={passkey.id}
										className="border-muted-foreground flex items-center justify-between gap-4 rounded-lg border p-3"
									>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<Icon name="lock-closed" className="h-4 w-4" />
												<span className="text-sm font-medium">
													{passkey.deviceType === 'platform'
														? 'Dispositivo'
														: 'Chiave di sicurezza'}
												</span>
											</div>
											<div className="text-muted-foreground text-xs">
												Registrato{' '}
												{formatDistanceToNow(new Date(passkey.createdAt))} fa
											</div>
										</div>
										<Form method="POST">
											<input
												type="hidden"
												name="passkeyId"
												value={passkey.id}
											/>
											<Button
												type="submit"
												name="intent"
												value="delete"
												variant="destructive"
												size="sm"
												className="flex items-center gap-1"
											>
												<Icon name="trash" className="h-3 w-3" />
											</Button>
										</Form>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="rounded-lg border p-4">
							<div className="text-center">
								<p className="text-muted-foreground mb-3 text-sm">
									Nessun passkey registrato
								</p>
								<form action={handlePasskeyRegistration}>
									<Button
										type="submit"
										variant="secondary"
										className="flex items-center gap-2"
									>
										<Icon name="plus" className="h-4 w-4" />
										Registra primo passkey
									</Button>
								</form>
							</div>
						</div>
					)}

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
