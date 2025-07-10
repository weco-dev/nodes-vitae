import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import * as QRCode from 'qrcode'
import { data, redirect, Form, Link, useNavigation } from 'react-router'
import { z } from 'zod'
import { ErrorList, OTPField } from '#app/components/forms.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { isCodeValid } from '#app/routes/_auth+/verify.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { getDomainUrl, useIsPending } from '#app/utils/misc.tsx'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { getTOTPAuthUri } from '#app/utils/totp.server.ts'
import { type Route } from './+types/two-factor.verify.ts'
import { twoFAVerificationType } from './two-factor.tsx'

const CancelSchema = z.object({ intent: z.literal('cancel') })
const VerifySchema = z.object({
	intent: z.literal('verify'),
	code: z.string().min(6).max(6),
})

const ActionSchema = z.discriminatedUnion('intent', [
	CancelSchema,
	VerifySchema,
])

export const twoFAVerifyVerificationType = '2fa-verify'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const verification = await prisma.verification.findUnique({
		where: {
			target_type: { type: twoFAVerifyVerificationType, target: userId },
		},
		select: {
			id: true,
			algorithm: true,
			secret: true,
			period: true,
			digits: true,
		},
	})
	if (!verification) {
		return redirect('/dashboard/settings/profile/two-factor')
	}
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: { email: true },
	})
	const issuer = new URL(getDomainUrl(request)).host
	const otpUri = getTOTPAuthUri({
		...verification,
		accountName: user.email,
		issuer,
	})
	const qrCode = await QRCode.toDataURL(otpUri)
	return { otpUri, qrCode }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: () =>
			ActionSchema.superRefine(async (data, ctx) => {
				if (data.intent === 'cancel') return null
				const codeIsValid = await isCodeValid({
					code: data.code,
					type: twoFAVerifyVerificationType,
					target: userId,
				})
				if (!codeIsValid) {
					ctx.addIssue({
						path: ['code'],
						code: z.ZodIssueCode.custom,
						message: `Invalid code`,
					})
					return z.NEVER
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

	switch (submission.value.intent) {
		case 'cancel': {
			await prisma.verification.deleteMany({
				where: { type: twoFAVerifyVerificationType, target: userId },
			})
			return redirect('/dashboard/settings/profile/two-factor')
		}
		case 'verify': {
			await prisma.verification.update({
				where: {
					target_type: { type: twoFAVerifyVerificationType, target: userId },
				},
				data: { type: twoFAVerificationType },
			})
			return redirectWithToast('/dashboard/settings/profile/two-factor', {
				type: 'success',
				title: 'Enabled',
				description: 'Two-factor authentication has been enabled.',
			})
		}
	}
}

export default function TwoFactorRoute({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const navigation = useNavigation()

	const isPending = useIsPending()
	const pendingIntent = isPending ? navigation.formData?.get('intent') : null

	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getZodConstraint(ActionSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ActionSchema })
		},
	})
	const lastSubmissionIntent = fields.intent.value

	return (
		<div className="flex min-h-svh w-full justify-start">
			<div className="w-full max-w-[70%]">
				<div className="flex flex-col gap-12">
					<div className="text-left">
						<h1 className="text-xl font-semibold">Verifica 2FA</h1>
						<p className="text-muted-foreground">
							Scansiona il codice QR con la tua app di autenticazione
						</p>
					</div>

					<hr className="border-muted-foreground/20" />

					<div className="flex flex-col items-start gap-4">
						<img alt="qr code" src={loaderData.qrCode} className="size-56" />
						<p className="text-left">
							Scansiona questo codice QR con la tua app di autenticazione.
						</p>
						<p className="text-muted-foreground text-left text-sm">
							Se non puoi scansionare il codice QR, puoi aggiungere manualmente
							questo account alla tua app di autenticazione usando questo
							codice:
						</p>
						<div className="bg-muted rounded-lg p-3">
							<pre
								className="text-center text-sm break-all whitespace-pre-wrap"
								aria-label="One-time Password URI"
							>
								{loaderData.otpUri}
							</pre>
						</div>
						<p className="text-muted-foreground text-left text-sm">
							Una volta aggiunto l'account, inserisci il codice dalla tua app di
							autenticazione qui sotto. Una volta abilitato il 2FA, dovrai
							inserire un codice dalla tua app di autenticazione ogni volta che
							accedi o esegui azioni importanti.
						</p>
						<div className="my-4 flex w-full flex-col">
							<Form method="POST" {...getFormProps(form)} className="flex-1">
								<div className="flex">
									<OTPField
										labelProps={{
											htmlFor: fields.code.id,
											children: 'Codice',
										}}
										inputProps={{
											...getInputProps(fields.code, { type: 'text' }),
											autoFocus: true,
											autoComplete: 'one-time-code',
										}}
										errors={fields.code.errors}
									/>
								</div>
								<div className="ml-0">
									<ErrorList id={form.errorId} errors={form.errors} />
								</div>

								<div className="max-w-sm">
									<StatusButton
										className="w-full"
										status={
											pendingIntent === 'verify'
												? 'pending'
												: lastSubmissionIntent === 'verify'
													? (form.status ?? 'idle')
													: 'idle'
										}
										type="submit"
										name="intent"
										value="verify"
									>
										Verifica
									</StatusButton>
								</div>
							</Form>
						</div>
						{/* torna alla pagina profilo */}
						<div className="text-left text-sm">
							<Link
								to=".."
								className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
							>
								<Icon name="arrow-left" className="h-4 w-4" />
								Torna alla pagina 2FA
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
