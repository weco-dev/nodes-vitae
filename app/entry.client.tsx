import {
	init,
	replayIntegration,
	browserTracingIntegration,
} from '@sentry/remix'
import { startTransition, useEffect } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { useLocation, useMatches } from 'react-router'
import { HydratedRouter } from 'react-router/dom'

init({
	dsn: 'https://8fcaa852673013dbd0acd12fbb23c51c@o4506620132655104.ingest.us.sentry.io/4509588576075776',
	tracesSampleRate: 1,

	integrations: [
		browserTracingIntegration({
			useEffect,
			useLocation,
			useMatches,
		}),
		replayIntegration({
			maskAllText: true,
			blockAllMedia: true,
		}),
	],

	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
})

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	void import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

startTransition(() => {
	hydrateRoot(document, <HydratedRouter />)
})
