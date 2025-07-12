/**
 * @fileoverview Assessment Layout - Container layout for all assessment-related routes
 * 
 * Simple layout component that provides authentication protection and consistent
 * styling for assessment routes (take, complete, review). Ensures user authentication
 * and applies responsive container constraints for optimal reading experience.
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 */

import { Outlet } from 'react-router'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/_layout'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	return {}
}

export default function AssessmentLayout() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-4xl">
				<Outlet />
			</div>
		</div>
	)
}