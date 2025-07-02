import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { data, Form, Link, redirect } from 'react-router'
import { z } from 'zod'
import { ErrorList, Field } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import {
	prepareVerification,
	requireRecentVerification,
} from '#app/routes/_auth+/verify.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { sendEmail } from '#app/utils/email.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { EmailSchema } from '#app/utils/user-validation.ts'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import { type Route } from './+types/change-email.ts'
import { EmailChangeEmail } from './change-email.server.tsx'

export const newEmailAddressSessionKey = 'new-email-address'

const ChangeEmailSchema = z.object({
	email: EmailSchema,
})

export async function loader({ request }: Route.LoaderArgs) {
	await requireRecentVerification(request)
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { email: true },
	})
	if (!user) {
		const params = new URLSearchParams({ redirectTo: request.url })
		throw redirect(`/login?${params}`)
	}
	return { user }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		schema: ChangeEmailSchema.superRefine(async (data, ctx) => {
			const existingUser = await prisma.user.findUnique({
				where: { email: data.email },
			})
			if (existingUser) {
				ctx.addIssue({
					path: ['email'],
					code: z.ZodIssueCode.custom,
					message: 'This email is already in use.',
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
	const { otp, redirectTo, verifyUrl } = await prepareVerification({
		period: 10 * 60,
		request,
		target: userId,
		type: 'change-email',
	})

	const response = await sendEmail({
		to: submission.value.email,
		subject: `Vitae ESG Email Change Verification`,
		react: <EmailChangeEmail verifyUrl={verifyUrl.toString()} otp={otp} />,
	})

	if (response.status === 'success') {
		const verifySession = await verifySessionStorage.getSession()
		verifySession.set(newEmailAddressSessionKey, submission.value.email)
		return redirect(redirectTo.toString(), {
			headers: {
				'set-cookie': await verifySessionStorage.commitSession(verifySession),
			},
		})
	} else {
		return data(
			{ result: submission.reply({ formErrors: [response.error.message] }) },
			{ status: 500 },
		)
	}
}

export default function ChangeEmailIndex({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const [form, fields] = useForm({
		id: 'change-email-form',
		constraint: getZodConstraint(ChangeEmailSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ChangeEmailSchema })
		},
	})

	const isPending = useIsPending()
	return (
		<div className="flex min-h-svh w-full">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-xl font-semibold">Cambia email</h1>
						<p className="text-muted-foreground">
							Riceverai un'email al nuovo indirizzo per confermare. Verrà
							inviata anche una notifica al tuo vecchio indirizzo{' '}
							{loaderData.user.email}.
						</p>
					</div>

					<hr className="border-muted-foreground/20 my-2" />

					<Form method="POST" {...getFormProps(form)}>
						<div className="flex flex-col">
							<Field
								labelProps={{
									htmlFor: fields.email.id,
									children: 'Nuova email',
								}}
								inputProps={{
									...getInputProps(fields.email, { type: 'email' }),
									autoComplete: 'email',
									placeholder: 'La tua nuova email',
								}}
								errors={fields.email.errors}
							/>
							<div className="flex flex-col gap-3">
								<StatusButton
									type="submit"
									status={isPending ? 'pending' : (form.status ?? 'idle')}
									className="w-full"
								>
									Invia conferma
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
