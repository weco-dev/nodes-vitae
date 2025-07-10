import { invariantResponse } from '@epic-web/invariant'
import { useState } from 'react'
import { data, Link, useFetcher } from 'react-router'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { resolveConnectionData } from '#app/utils/connections.server.ts'
import {
	ProviderConnectionForm,
	type ProviderName,
	ProviderNameSchema,
	providerIcons,
	providerNames,
} from '#app/utils/connections.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { pipeHeaders } from '#app/utils/headers.server.js'
import { makeTimings } from '#app/utils/timing.server.ts'
import { createToastHeaders } from '#app/utils/toast.server.ts'
import { type Route } from './+types/connections.ts'

async function userCanDeleteConnections(userId: string) {
	const user = await prisma.user.findUnique({
		select: {
			password: { select: { userId: true } },
			_count: { select: { connections: true } },
		},
		where: { id: userId },
	})
	// user can delete their connections if they have a password
	if (user?.password) return true
	// users have to have more than one remaining connection to delete one
	return Boolean(user?._count.connections && user?._count.connections > 1)
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const timings = makeTimings('profile connections loader')
	const rawConnections = await prisma.connection.findMany({
		select: { id: true, providerName: true, providerId: true, createdAt: true },
		where: { userId },
	})
	const connections: Array<{
		providerName: ProviderName
		id: string
		displayName: string
		link?: string | null
		createdAtFormatted: string
	}> = []
	for (const connection of rawConnections) {
		const r = ProviderNameSchema.safeParse(connection.providerName)
		if (!r.success) continue
		const providerName = r.data
		const connectionData = await resolveConnectionData(
			providerName,
			connection.providerId,
			{ timings },
		)
		connections.push({
			...connectionData,
			providerName,
			id: connection.id,
			createdAtFormatted: connection.createdAt.toLocaleString(),
		})
	}

	return data(
		{
			connections,
			canDeleteConnections: await userCanDeleteConnections(userId),
		},
		{ headers: { 'Server-Timing': timings.toString() } },
	)
}

export const headers: Route.HeadersFunction = pipeHeaders

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	invariantResponse(
		formData.get('intent') === 'delete-connection',
		'Invalid intent',
	)
	invariantResponse(
		await userCanDeleteConnections(userId),
		'You cannot delete your last connection unless you have a password.',
	)
	const connectionId = formData.get('connectionId')
	invariantResponse(typeof connectionId === 'string', 'Invalid connectionId')
	await prisma.connection.delete({
		where: {
			id: connectionId,
			userId: userId,
		},
	})
	const toastHeaders = await createToastHeaders({
		title: 'Deleted',
		description: 'Your connection has been deleted.',
	})
	return data({ status: 'success' } as const, { headers: toastHeaders })
}

export default function Connections({ loaderData }: Route.ComponentProps) {
	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">Connessioni</h1>
						<p className="text-muted-foreground">
							Gestisci i tuoi account collegati
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					{loaderData.connections.length ? (
						<div className="flex flex-col gap-4">
							<p className="text-sm font-medium">Le tue connessioni attuali:</p>
							<ul className="flex flex-col gap-3">
								{loaderData.connections.map((c) => (
									<li key={c.id}>
										<Connection
											connection={c}
											canDelete={loaderData.canDeleteConnections}
										/>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="rounded-lg border p-4">
							<p className="text-muted-foreground">
								Non hai ancora connessioni.
							</p>
						</div>
					)}

					<hr className="border-muted-foreground/20" />

					<div className="flex flex-col gap-3">
						<p className="text-sm font-medium">Aggiungi nuove connessioni:</p>
						{providerNames.map((providerName) => (
							<ProviderConnectionForm
								key={providerName}
								type="Connect"
								providerName={providerName}
							/>
						))}
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

function Connection({
	connection,
	canDelete,
}: {
	connection: Route.ComponentProps['loaderData']['connections'][number]
	canDelete: boolean
}) {
	const deleteFetcher = useFetcher<typeof action>()
	const [infoOpen, setInfoOpen] = useState(false)
	const icon = providerIcons[connection.providerName]
	return (
		<div className="flex justify-between gap-2">
			<span className={`inline-flex items-center gap-1.5`}>
				{icon}
				<span>
					{connection.link ? (
						<a href={connection.link} className="underline">
							{connection.displayName}
						</a>
					) : (
						connection.displayName
					)}{' '}
					({connection.createdAtFormatted})
				</span>
			</span>
			{canDelete ? (
				<deleteFetcher.Form method="POST">
					<input name="connectionId" value={connection.id} type="hidden" />
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<StatusButton
									name="intent"
									value="delete-connection"
									variant="destructive"
									size="sm"
									status={
										deleteFetcher.state !== 'idle'
											? 'pending'
											: (deleteFetcher.data?.status ?? 'idle')
									}
								>
									<Icon name="cross-1" />
								</StatusButton>
							</TooltipTrigger>
							<TooltipContent>Disconnect this account</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</deleteFetcher.Form>
			) : (
				<TooltipProvider>
					<Tooltip open={infoOpen} onOpenChange={setInfoOpen}>
						<TooltipTrigger onClick={() => setInfoOpen(true)}>
							<Icon name="question-mark-circled"></Icon>
						</TooltipTrigger>
						<TooltipContent>
							You cannot delete your last connection unless you have a password.
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	)
}
