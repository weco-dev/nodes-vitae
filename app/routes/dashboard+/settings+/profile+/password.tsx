import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, redirect, Form, Link } from 'react-router'
import { z } from 'zod'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	checkIsCommonPassword,
	getPasswordHash,
	requireUserId,
	verifyUserPassword,
} from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { PasswordSchema } from '#app/utils/user-validation.ts'
import { type Route } from './+types/password.ts'

const ChangePasswordForm = z
	.object({
		currentPassword: PasswordSchema,
		newPassword: PasswordSchema,
		confirmNewPassword: PasswordSchema,
	})
	.superRefine(({ confirmNewPassword, newPassword }, ctx) => {
		if (confirmNewPassword !== newPassword) {
			ctx.addIssue({
				path: ['confirmNewPassword'],
				code: z.ZodIssueCode.custom,
				message: 'The passwords must match',
			})
		}
	})

async function requirePassword(userId: string) {
	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	})
	if (!password) {
		throw redirect('/dashboard/settings/profile/password/create')
	}
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	await requirePassword(userId)
	return {}
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	await requirePassword(userId)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		async: true,
		schema: ChangePasswordForm.superRefine(
			async ({ currentPassword, newPassword }, ctx) => {
				if (currentPassword && newPassword) {
					const user = await verifyUserPassword({ id: userId }, currentPassword)
					if (!user) {
						ctx.addIssue({
							path: ['currentPassword'],
							code: z.ZodIssueCode.custom,
							message: 'Incorrect password.',
						})
					}
					const isCommonPassword = await checkIsCommonPassword(newPassword)
					if (isCommonPassword) {
						ctx.addIssue({
							path: ['newPassword'],
							code: 'custom',
							message: 'Password is too common',
						})
					}
				}
			},
		),
	})
	if (submission.status !== 'success') {
		return data(
			{
				result: submission.reply({
					hideFields: ['currentPassword', 'newPassword', 'confirmNewPassword'],
				}),
			},
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { newPassword } = submission.value

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			password: {
				update: {
					hash: await getPasswordHash(newPassword),
				},
			},
		},
	})

	return redirectWithToast(
		`/dashboard/settings/profile`,
		{
			type: 'success',
			title: 'Password Changed',
			description: 'Your password has been changed.',
		},
		{ status: 302 },
	)
}

export default function ChangePasswordRoute({
	actionData,
}: Route.ComponentProps) {
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'password-change-form',
		constraint: getZodConstraint(ChangePasswordForm),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ChangePasswordForm })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">Cambia password</h1>
						<p className="text-muted-foreground">
							Aggiorna la tua password qui sotto
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					<Form method="POST" {...getFormProps(form)}>
						<div className="flex flex-col">
							<Field
								labelProps={{
									htmlFor: fields.currentPassword.id,
									children: 'Password attuale',
								}}
								inputProps={{
									...getInputProps(fields.currentPassword, {
										type: 'password',
									}),
									autoComplete: 'current-password',
									placeholder: 'La tua password attuale',
								}}
								errors={fields.currentPassword.errors}
							/>
							<Field
								labelProps={{
									htmlFor: fields.newPassword.id,
									children: 'Nuova password',
								}}
								inputProps={{
									...getInputProps(fields.newPassword, { type: 'password' }),
									autoComplete: 'new-password',
									placeholder: 'La tua nuova password',
								}}
								errors={fields.newPassword.errors}
							/>
							<Field
								labelProps={{
									htmlFor: fields.confirmNewPassword.id,
									children: 'Conferma nuova password',
								}}
								inputProps={{
									...getInputProps(fields.confirmNewPassword, {
										type: 'password',
									}),
									autoComplete: 'new-password',
									placeholder: 'Conferma la nuova password',
								}}
								errors={fields.confirmNewPassword.errors}
							/>
							<div className="flex flex-col gap-3">
								<StatusButton
									type="submit"
									status={isPending ? 'pending' : (form.status ?? 'idle')}
									className="w-full"
								>
									Cambia password
								</StatusButton>
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
