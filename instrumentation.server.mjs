import * as Sentry from '@sentry/remix'

Sentry.init({
	dsn: 'https://8fcaa852673013dbd0acd12fbb23c51c@o4506620132655104.ingest.us.sentry.io/4509588576075776',
	tracesSampleRate: 1,
})
