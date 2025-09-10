import { faker } from '@faker-js/faker'
import { generateTOTP } from '#app/utils/totp.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'

test('Users can add 2FA to their account and use it when logging in', async ({
	page,
	login,
}) => {
	const password = faker.internet.password()
	const user = await login({ password })
	await page.goto('/dashboard/settings/profile')

	await page.getByRole('link', { name: /abilita 2fa/i }).click()

	await expect(page).toHaveURL(`/dashboard/settings/profile/two-factor`)
	const main = page.getByRole('main')
	await main.getByRole('button', { name: /abilita 2fa/i }).click()
	const otpUriString = await main
		.getByLabel(/One-Time Password URI/i)
		.innerText()

	const otpUri = new URL(otpUriString)
	const options = Object.fromEntries(otpUri.searchParams)

	await main.getByRole('textbox', { name: /codice/i }).fill(
		(
			await generateTOTP({
				...options,
				// the algorithm will be "SHA1" but we need to generate the OTP with "SHA-1"
				algorithm: 'SHA-1',
			})
		).otp,
	)
	await main.getByRole('button', { name: 'Verifica', exact: true }).click()

	await expect(main).toHaveText(/autenticazione 2fa attiva/i)
	await expect(
		main.getByRole('link', { name: /disabilita 2fa/i }),
	).toBeVisible()

	await page.getByRole('button', { name: user.name ?? user.username }).click()
	await page.getByRole('menuitem', { name: /logout/i }).click()
	await expect(page).toHaveURL(`/`)

	await page.goto('/login')
	await expect(page).toHaveURL(`/login`)
	await page.getByRole('textbox', { name: /email/i }).fill(user.email)
	await page.getByLabel(/^password$/i).fill(password)
	await page.getByRole('button', { name: 'Login', exact: true }).click()
	await expect(page).toHaveURL(/\/verify/)

	await page.getByRole('textbox', { name: /codice/i }).fill(
		(
			await generateTOTP({
				...options,
				// the algorithm will be "SHA1" but we need to generate the OTP with "SHA-1"
				algorithm: 'SHA-1',
			})
		).otp,
	)

	await page.getByRole('button', { name: /verifica/i }).click()

	await expect(
		page.getByRole('button', { name: user.name ?? user.username }),
	).toBeVisible()
})
