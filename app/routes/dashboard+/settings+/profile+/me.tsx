import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { data, Link, useFetcher } from 'react-router'
import { z } from 'zod'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { cn } from '#app/utils/misc.tsx'
import { NameSchema, UsernameSchema } from '#app/utils/user-validation.ts'
import { type Route } from './+types/index.ts'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

const ProfileFormSchema = z.object({
	name: NameSchema.nullable().default(null),
	username: UsernameSchema,
})

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: { id: true, name: true, username: true, email: true },
	})

	return { user }
}

type ProfileActionArgs = {
	request: Request
	userId: string
	formData: FormData
}

const profileUpdateActionIntent = 'update-profile'
export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')
	switch (intent) {
		case profileUpdateActionIntent: {
			return profileUpdateAction({ request, userId, formData })
		}
		default: {
			throw new Response(`Invalid intent "${intent}"`, { status: 400 })
		}
	}
}

export default function EditUserProfile({ loaderData }: Route.ComponentProps) {
	return (
		<div className="flex flex-col">
			<UpdateProfile loaderData={loaderData} />
		</div>
	)
}

async function profileUpdateAction({ userId, formData }: ProfileActionArgs) {
	const submission = await parseWithZod(formData, {
		async: true,
		schema: ProfileFormSchema.superRefine(async ({ username }, ctx) => {
			const existingUsername = await prisma.user.findUnique({
				where: { username },
				select: { id: true },
			})
			if (existingUsername && existingUsername.id !== userId) {
				ctx.addIssue({
					path: ['username'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this username',
				})
			}
		}),
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { username, name } = submission.value

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			name: name,
			username: username,
		},
	})

	return {
		result: submission.reply(),
	}
}

function UpdateProfile({
	loaderData,
}: {
	loaderData: Route.ComponentProps['loaderData']
}) {
	const fetcher = useFetcher<typeof profileUpdateAction>()

	const [form, fields] = useForm({
		id: 'edit-profile',
		constraint: getZodConstraint(ProfileFormSchema),
		lastResult: fetcher.data?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ProfileFormSchema })
		},
		defaultValue: {
			username: loaderData.user.username,
			name: loaderData.user.name,
		},
	})

	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className={cn('flex flex-col gap-6')}>
					<div>
						<h1 className="text-xl font-semibold">Aggiorna il tuo profilo</h1>
						<p className="text-muted-foreground">
							Modifica le tue informazioni personali qui sotto
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					<fetcher.Form method="POST" {...getFormProps(form)}>
						<div className="flex flex-col">
							<Field
								labelProps={{
									htmlFor: fields.username.id,
									children: 'Nome utente',
								}}
								inputProps={{
									...getInputProps(fields.username, { type: 'text' }),
									placeholder: 'Il tuo nome utente',
								}}
								errors={fields.username.errors}
							/>
							<Field
								labelProps={{
									htmlFor: fields.name.id,
									children: 'Nome completo',
								}}
								inputProps={{
									...getInputProps(fields.name, { type: 'text' }),
									placeholder: 'Il tuo nome completo',
								}}
								errors={fields.name.errors}
							/>
							<div className="flex flex-col gap-3">
								<StatusButton
									type="submit"
									name="intent"
									value={profileUpdateActionIntent}
									status={
										fetcher.state !== 'idle'
											? 'pending'
											: (form.status ?? 'idle')
									}
									className="w-full"
								>
									Salva modifiche
								</StatusButton>
							</div>
						</div>
						<ErrorList errors={form.errors} id={form.errorId} />

						{/* torna alla pagina profilo */}
						<div className="mt-4 text-sm">
							<Link to="../profile">
								<Icon name="arrow-left" className="mr-2">
									Torna alla pagina profilo
								</Icon>
							</Link>
						</div>
					</fetcher.Form>
				</div>
			</div>
		</div>
	)
}
