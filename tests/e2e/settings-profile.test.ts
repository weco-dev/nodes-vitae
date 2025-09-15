import { invariant } from '@epic-web/invariant'
import { faker } from '@faker-js/faker'
import { verifyUserPassword } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { readEmail } from '#tests/mocks/utils.ts'
import { expect, test, createUser, waitFor } from '#tests/playwright-utils.ts'

const CODE_REGEX = /Here's your verification code: (?<code>[\d\w]+)/

test('Users can update their basic info', async ({ page, login }) => {
	await login()
	await page.goto('/dashboard/settings/profile')

	// Click on "Modifica profilo" link to go to the edit form
	await page.getByRole('link', { name: /modifica profilo/i }).click()

	const newUserData = createUser()

	await page
		.getByRole('textbox', { name: /nome utente/i })
		.fill(newUserData.username)
	await page
		.getByRole('textbox', { name: /nome completo/i })
		.fill(newUserData.name)

	await page.getByRole('button', { name: /salva modifiche/i }).click()
})

test('Users can update their password', async ({ page, login }) => {
	const oldPassword = faker.internet.password()
	const newPassword = faker.internet.password()
	const user = await login({ password: oldPassword })
	await page.goto('/dashboard/settings/profile')

	await page.getByRole('link', { name: /cambia password/i }).click()

	await page
		.getByRole('textbox', { name: /password attuale/i })
		.fill(oldPassword)
	await page
		.getByRole('textbox', { name: /^nuova password$/i })
		.fill(newPassword)
	await page
		.getByRole('textbox', { name: /conferma nuova password/i })
		.fill(newPassword)

	await page.getByRole('button', { name: /cambia password/i }).click()

	await expect(page).toHaveURL(`/dashboard/settings/profile`)

	const { email } = user
	expect(
		await verifyUserPassword({ email }, oldPassword),
		'Old password still works',
	).toBeNull()
	expect(
		await verifyUserPassword({ email }, newPassword),
		'New password does not work',
	).toEqual({ id: user.id })
})

test('Users can update their profile photo', async ({ page, login }) => {
	const user = await login()
	await page.goto('/dashboard/settings/profile')

	// Handle both cases: existing image or avatar icon
	let beforeSrc: string | null = null
	const imageExists = await page
		.getByRole('main')
		.getByRole('img', { name: `${user.name ?? user.username}'s profile` })
		.isVisible()
		.catch(() => false)

	if (imageExists) {
		beforeSrc = await page
			.getByRole('main')
			.getByRole('img', { name: `${user.name ?? user.username}'s profile` })
			.getAttribute('src')
	}

	await page.getByRole('link', { name: /cambia foto profilo/i }).click()

	await expect(page).toHaveURL(`/dashboard/settings/profile/photo`)

	await page
		.getByRole('button', { name: /cambia/i })
		.setInputFiles('./tests/fixtures/images/user/kody.png')

	await page.getByRole('button', { name: /salva foto/i }).click()

	await expect(
		page,
		'Was not redirected after saving the profile photo',
	).toHaveURL(`/dashboard/settings/profile`)

	// After uploading, there should definitely be an img element
	await expect(
		page
			.getByRole('main')
			.getByRole('img', { name: `${user.name ?? user.username}'s profile` }),
	).toHaveAttribute('src')

	const afterSrc = await page
		.getByRole('main')
		.getByRole('img', { name: `${user.name ?? user.username}'s profile` })
		.getAttribute('src')

	// If there was an image before, verify it changed
	if (beforeSrc) {
		expect(beforeSrc).not.toEqual(afterSrc)
	}
})

test('Users can change their email address', async ({ page, login }) => {
	const preUpdateUser = await login()
	const newEmailAddress = faker.internet.email().toLowerCase()
	expect(preUpdateUser.email).not.toEqual(newEmailAddress)
	await page.goto('/dashboard/settings/profile')
	await page.getByRole('link', { name: /cambia email/i }).click()
	await page
		.getByRole('textbox', { name: /nuova email/i })
		.fill(newEmailAddress)
	await page.getByRole('button', { name: /invia conferma/i }).click()
	await expect(page.getByText(/controlla la tua email/i)).toBeVisible()
	const email = await waitFor(() => readEmail(newEmailAddress), {
		errorMessage: 'Confirmation email was not sent',
	})
	invariant(email, 'Email was not sent')
	const codeMatch = email.text.match(CODE_REGEX)
	const code = codeMatch?.groups?.code
	invariant(code, 'Onboarding code not found')
	await page.getByLabel(/codice/i).fill(code)
	await page.getByRole('button', { name: /verifica/i }).click()
	await expect(page.getByText(/email changed/i)).toBeVisible()

	const updatedUser = await prisma.user.findUnique({
		where: { id: preUpdateUser.id },
		select: { email: true },
	})
	invariant(updatedUser, 'Updated user not found')
	expect(updatedUser.email).toBe(newEmailAddress)
	const noticeEmail = await waitFor(() => readEmail(preUpdateUser.email), {
		errorMessage: 'Notice email was not sent',
	})
	expect(noticeEmail.subject).toContain('changed')
})
