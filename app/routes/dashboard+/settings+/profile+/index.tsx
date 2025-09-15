import { invariantResponse } from '@epic-web/invariant'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { Link, useFetcher } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId, sessionKey } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc, useDoubleCheck } from '#app/utils/misc.tsx'
import { authSessionStorage } from '#app/utils/session.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { type Route } from './+types/index.ts'
import { twoFAVerificationType } from './two-factor.tsx'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			image: {
				select: { objectKey: true },
			},
			_count: {
				select: {
					sessions: {
						where: {
							expirationDate: { gt: new Date() },
						},
					},
				},
			},
		},
	})

	const twoFactorVerification = await prisma.verification.findUnique({
		select: { id: true },
		where: { target_type: { type: twoFAVerificationType, target: userId } },
	})

	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	})

	return {
		user,
		hasPassword: Boolean(password),
		isTwoFactorEnabled: Boolean(twoFactorVerification),
	}
}

type ProfileActionArgs = {
	request: Request
	userId: string
	formData: FormData
}
const signOutOfSessionsActionIntent = 'sign-out-of-sessions'
const deleteDataActionIntent = 'delete-data'

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case signOutOfSessionsActionIntent: {
			return signOutOfSessionsAction({ request, userId, formData })
		}
		case deleteDataActionIntent: {
			return deleteDataAction({ request, userId, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export default function EditUserProfile({ loaderData }: Route.ComponentProps) {
	const user = loaderData.user
	return (
		<div className="flex flex-col gap-12">
			<div>
				<h1 className="text-xl font-semibold">Il tuo profilo</h1>
				<p className="text-muted-foreground">
					Visualizza e gestisci le tue informazioni personali
				</p>
			</div>

			<hr className="border-muted-foreground/20" />

			<div className="rounded-lg border p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
					<div className="bg-muted flex h-20 w-20 shrink-0 self-center rounded-full sm:self-start">
						{user.image?.objectKey ? (
							<img
								src={
									loaderData.user
										? getUserImgSrc(loaderData.user.image?.objectKey)
										: ''
								}
								alt={`${user.name ?? user.username}'s profile`}
								className="h-full w-full rounded-full object-cover"
							/>
						) : (
							<Icon
								name="avatar"
								className="text-primary h-20 w-20 self-center"
							/>
						)}
					</div>
					<div className="flex-1 text-center sm:text-left">
						<div className="">
							<h2 className="text-xl font-semibold">
								{user.name ?? user.username}
							</h2>
							<p className="text-muted-foreground">{user.email}</p>
							<p className="text-muted-foreground mt-1 text-sm">
								Nick <span className="font-medium">@{user.username}</span>
							</p>
							<div>
								<label className="text-muted-foreground text-sm">
									Autenticazione 2FA
								</label>

								<span
									className={`ml-1 items-center text-sm font-medium ${
										loaderData.isTwoFactorEnabled
											? 'text-primary'
											: 'text-destructive'
									}`}
								>
									{loaderData.isTwoFactorEnabled ? 'attiva' : 'non attiva'}
								</span>
							</div>
						</div>
					</div>
					<div className="flex justify-center sm:justify-start">
						<Link
							to="me"
							className="bg-background hover:bg-muted/50 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
						>
							<Icon name="pencil-1" className="h-4 w-4" />
							Modifica
						</Link>
					</div>
				</div>
			</div>

			<hr className="border-muted-foreground/20" />

			{/* Link section */}
			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					to="me"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="reset" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Modifica profilo</p>
						<p className="text-muted-foreground text-sm">
							Aggiorna le tue informazioni personali
						</p>
					</div>
				</Link>

				<Link
					to="photo"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="camera" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Cambia foto profilo</p>
						<p className="text-muted-foreground text-sm">
							Aggiorna la tua immagine del profilo
						</p>
					</div>
				</Link>

				<Link
					to="change-email"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="envelope-closed" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Cambia email</p>
						<p className="text-muted-foreground text-sm">
							Aggiorna il tuo indirizzo email
						</p>
					</div>
				</Link>

				<Link
					to={loaderData.hasPassword ? 'password' : 'password/create'}
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="dots-horizontal" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">
							{loaderData.hasPassword ? 'Cambia password' : 'Crea una password'}
						</p>
						<p className="text-muted-foreground text-sm">
							{loaderData.hasPassword
								? 'Aggiorna la tua password'
								: 'Imposta una nuova password'}
						</p>
					</div>
				</Link>

				<Link
					to="two-factor"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					{loaderData.isTwoFactorEnabled ? (
						<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
							<Icon name="lock-closed" className="text-primary h-5 w-5" />
						</div>
					) : (
						<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
							<Icon name="lock-open-1" className="text-primary h-5 w-5" />
						</div>
					)}
					<div>
						<p className="font-medium">
							{loaderData.isTwoFactorEnabled
								? 'Autenticazione 2FA attiva'
								: 'Abilita 2FA'}
						</p>
						<p className="text-muted-foreground text-sm">
							{loaderData.isTwoFactorEnabled
								? 'La tua 2FA è configurata'
								: 'Aggiungi sicurezza extra al tuo account'}
						</p>
					</div>
				</Link>

				{/* <Link
					to="connections"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="link-2" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Connessioni</p>
						<p className="text-muted-foreground text-sm">
							Gestisci account collegati
						</p>
					</div>
				</Link> */}

				<Link
					to="passkeys"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="passkey" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Passkey</p>
						<p className="text-muted-foreground text-sm">
							Gestisci i tuoi passkey
						</p>
					</div>
				</Link>

				<Link
					reloadDocument
					download="my-epic-notes-data.json"
					to="/resources/download-user-data"
					className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-4 transition-colors"
				>
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="download" className="text-primary h-5 w-5" />
					</div>
					<div>
						<p className="font-medium">Scarica i tuoi dati</p>
						<p className="text-muted-foreground text-sm">
							Esporta tutte le tue informazioni
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-3 rounded-lg border p-4">
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="avatar" className="text-primary h-5 w-5" />
					</div>
					<div className="flex-1">
						<SignOutOfSessions loaderData={loaderData} />
					</div>
				</div>

				<div className="border-destructive/20 flex items-center gap-3 rounded-lg border p-4">
					<div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Icon name="trash" className="text-destructive h-5 w-5" />
					</div>
					<div className="flex-1">
						<DeleteData />
					</div>
				</div>
			</div>
		</div>
	)
}

async function signOutOfSessionsAction({ request, userId }: ProfileActionArgs) {
	const authSession = await authSessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const sessionId = authSession.get(sessionKey)
	invariantResponse(
		sessionId,
		'You must be authenticated to sign out of other sessions',
	)
	await prisma.session.deleteMany({
		where: {
			userId,
			id: { not: sessionId },
		},
	})
	return { status: 'success' } as const
}

function SignOutOfSessions({
	loaderData,
}: {
	loaderData: Route.ComponentProps['loaderData']
}) {
	const dc = useDoubleCheck()

	const fetcher = useFetcher<typeof signOutOfSessionsAction>()
	const otherSessionsCount = loaderData.user._count.sessions - 1
	return (
		<div>
			{otherSessionsCount ? (
				<fetcher.Form method="POST">
					<StatusButton
						{...dc.getButtonProps({
							type: 'submit',
							name: 'intent',
							value: signOutOfSessionsActionIntent,
						})}
						variant={dc.doubleCheck ? 'destructive' : 'default'}
						status={
							fetcher.state !== 'idle'
								? 'pending'
								: (fetcher.data?.status ?? 'idle')
						}
					>
						<Icon name="avatar">
							{dc.doubleCheck
								? `Are you sure?`
								: `Sign out of ${otherSessionsCount} other sessions`}
						</Icon>
					</StatusButton>
				</fetcher.Form>
			) : (
				<div>
					<p className="font-medium">Sessioni</p>
					<p className="text-muted-foreground text-sm">
						Questa è la tua unica sessione attiva.
					</p>
				</div>
			)}
		</div>
	)
}

async function deleteDataAction({ userId }: ProfileActionArgs) {
	await prisma.user.delete({ where: { id: userId } })
	return redirectWithToast('/', {
		type: 'success',
		title: 'Data Deleted',
		description: 'All of your data has been deleted',
	})
}

function DeleteData() {
	const dc = useDoubleCheck()

	const fetcher = useFetcher<typeof deleteDataAction>()
	return (
		<div>
			<fetcher.Form method="POST">
				<StatusButton
					{...dc.getButtonProps({
						type: 'submit',
						name: 'intent',
						value: deleteDataActionIntent,
					})}
					variant={dc.doubleCheck ? 'destructive' : 'destructive'}
					status={fetcher.state !== 'idle' ? 'pending' : 'idle'}
				>
					<Icon name="trash">
						{dc.doubleCheck ? `Are you sure?` : `Delete all your data`}
					</Icon>
				</StatusButton>
			</fetcher.Form>
		</div>
	)
}
