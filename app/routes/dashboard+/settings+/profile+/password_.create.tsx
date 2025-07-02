import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, redirect, Form, Link } from 'react-router'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	checkIsCommonPassword,
	getPasswordHash,
	requireUserId,
} from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { PasswordAndConfirmPasswordSchema } from '#app/utils/user-validation.ts'
import { type Route } from './+types/password_.create.ts'

const CreatePasswordForm = PasswordAndConfirmPasswordSchema

async function requireNoPassword(userId: string) {
	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	})
	if (password) {
		throw redirect('/settings/profile/password')
	}
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	await requireNoPassword(userId)
	return {}
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	await requireNoPassword(userId)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		async: true,
		schema: CreatePasswordForm.superRefine(async ({ password }, ctx) => {
			const isCommonPassword = await checkIsCommonPassword(password)
			if (isCommonPassword) {
				ctx.addIssue({
					path: ['password'],
					code: 'custom',
					message: 'Password is too common',
				})
			}
		}),
	})
	if (submission.status !== 'success') {
		return data(
			{
				result: submission.reply({
					hideFields: ['password', 'confirmPassword'],
				}),
			},
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { password } = submission.value

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			password: {
				create: {
					hash: await getPasswordHash(password),
				},
			},
		},
	})

	return redirect(`/settings/profile`, { status: 302 })
}

export default function CreatePasswordRoute({
	actionData,
}: Route.ComponentProps) {
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'password-create-form',
		constraint: getZodConstraint(CreatePasswordForm),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CreatePasswordForm })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">Crea una password</h1>
						<p className="text-muted-foreground">
							Imposta una nuova password per il tuo account
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					<Form method="POST" {...getFormProps(form)}>
						<div className="flex flex-col">
							<Field
								labelProps={{
									htmlFor: fields.password.id,
									children: 'Nuova password',
								}}
								inputProps={{
									...getInputProps(fields.password, { type: 'password' }),
									autoComplete: 'new-password',
									placeholder: 'La tua nuova password',
								}}
								errors={fields.password.errors}
							/>
							<Field
								labelProps={{
									htmlFor: fields.confirmPassword.id,
									children: 'Conferma password',
								}}
								inputProps={{
									...getInputProps(fields.confirmPassword, {
										type: 'password',
									}),
									autoComplete: 'new-password',
									placeholder: 'Conferma la password',
								}}
								errors={fields.confirmPassword.errors}
							/>
							<div className="flex flex-col gap-3">
								<StatusButton
									type="submit"
									status={isPending ? 'pending' : (form.status ?? 'idle')}
									className="w-full"
								>
									Crea password
								</StatusButton>
								<Button variant="secondary" asChild className="w-full">
									<Link to="..">Annulla</Link>
								</Button>
							</div>
						</div>
						<ErrorList id={form.errorId} errors={form.errors} />

						{/* torna alla pagina profilo */}
						<div className="mt-4 text-sm">
							<Link to="../profile">
								<Icon name="arrow-left" className="mr-2">
									Torna alla pagina profilo
								</Icon>
							</Link>
						</div>
					</Form>
				</div>
			</div>
		</div>
	)
}
