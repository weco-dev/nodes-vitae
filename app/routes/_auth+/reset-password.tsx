import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { type SEOHandle } from '@nasa-gcn/remix-seo'
import { data, redirect, Form } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	checkIsCommonPassword,
	requireAnonymous,
	resetUserPassword,
} from '#app/utils/auth.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { PasswordAndConfirmPasswordSchema } from '#app/utils/user-validation.ts'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import { type Route } from './+types/reset-password.ts'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

export const resetPasswordEmailSessionKey = 'resetPasswordEmail'

const ResetPasswordSchema = PasswordAndConfirmPasswordSchema

async function requireResetPasswordEmail(request: Request) {
	await requireAnonymous(request)
	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const resetPasswordEmail = verifySession.get(resetPasswordEmailSessionKey)
	if (typeof resetPasswordEmail !== 'string' || !resetPasswordEmail) {
		throw redirect('/login')
	}
	return resetPasswordEmail
}

export async function loader({ request }: Route.LoaderArgs) {
	const resetPasswordEmail = await requireResetPasswordEmail(request)
	return { resetPasswordEmail }
}

export async function action({ request }: Route.ActionArgs) {
	const resetPasswordEmail = await requireResetPasswordEmail(request)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		schema: ResetPasswordSchema.superRefine(async ({ password }, ctx) => {
			const isCommonPassword = await checkIsCommonPassword(password)
			if (isCommonPassword) {
				ctx.addIssue({
					path: ['password'],
					code: 'custom',
					message: 'Password is too common',
				})
			}
		}),
		async: true,
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}
	const { password } = submission.value

	await resetUserPassword({ email: resetPasswordEmail, password })
	const verifySession = await verifySessionStorage.getSession()
	return redirect('/login', {
		headers: {
			'set-cookie': await verifySessionStorage.destroySession(verifySession),
		},
	})
}

export const meta: Route.MetaFunction = () => {
	return [{ title: 'Reset Password | Vitae' }]
}

export default function ResetPasswordPage({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const isPending = useIsPending()

	const [form, fields] = useForm({
		id: 'reset-password',
		constraint: getZodConstraint(ResetPasswordSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ResetPasswordSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex min-h-full flex-col justify-center pt-20 pb-32">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Reset Password
					</h1>
					<p className="text-muted-foreground text-sm">
						Ciao, {loaderData.resetPasswordEmail}. Nessun problema, succede
						sempre.
					</p>
				</div>

				<div className="mt-8">
					<div className="mx-auto w-full max-w-md">
						<Form method="POST" {...getFormProps(form)}>
							<Field
								labelProps={{
									htmlFor: fields.password.id,
									children: 'Nuova Password',
								}}
								inputProps={{
									...getInputProps(fields.password, { type: 'password' }),
									autoComplete: 'new-password',
									autoFocus: true,
								}}
								errors={fields.password.errors}
							/>
							<Field
								labelProps={{
									htmlFor: fields.confirmPassword.id,
									children: 'Conferma Password',
								}}
								inputProps={{
									...getInputProps(fields.confirmPassword, {
										type: 'password',
									}),
									autoComplete: 'new-password',
								}}
								errors={fields.confirmPassword.errors}
							/>

							<ErrorList errors={form.errors} id={form.errorId} />

							<div className="pt-3">
								<StatusButton
									className="w-full"
									status={isPending ? 'pending' : (form.status ?? 'idle')}
									type="submit"
									disabled={isPending}
								>
									Reset password
								</StatusButton>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
