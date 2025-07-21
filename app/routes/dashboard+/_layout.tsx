/**
 * @fileoverview Dashboard Layout - Main application layout with sidebar navigation
 * 
 * ==================================================================================
 * LAYOUT OVERVIEW
 * ==================================================================================
 * 
 * This layout component provides the main application shell for all dashboard routes,
 * including sidebar navigation, header, and content area. It handles user authentication,
 * assessment state loading, and provides a responsive sidebar interface.
 * 
 * KEY FEATURES:
 * 1. Integrated sidebar with assessment state awareness
 * 2. User authentication validation and redirect handling
 * 3. Assessment data preloading for navigation context
 * 4. Responsive sidebar provider with collapsible design
 * 5. Consistent header and layout structure
 * 
 * DATA LOADING:
 * - User authentication and validation
 * - Open assessment status for dynamic navigation
 * - User assessment history for dashboard context
 * - User profile data for sidebar display
 * 
 * @version 1.0.0
 * @author Vitae Development Team
 * @since 1.0.0
 * @requires react-router
 * @requires #app/components/app-sidebar
 * @requires #app/components/site-header
 * @requires #app/components/ui/sidebar
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 * @requires #app/utils/db.server
 * 
 * @see {@link app/components/app-sidebar.tsx} for sidebar implementation
 * @see {@link app/components/site-header.tsx} for header component
 */

import { Outlet, redirect } from 'react-router'
import { AppSidebar } from '#app/components/app-sidebar'
import { SiteHeader } from '#app/components/site-header'
import { SidebarInset, SidebarProvider } from '#app/components/ui/sidebar'
import {
	getUserOpenAssessment,
	getUserAssessments,
} from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { type Route } from './+types/_layout'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({ where: { id: userId } })

	if (!user) {
		const redirectTo = '/'
		return redirect(redirectTo)
	}

	// Get assessment data for sidebar
	const openAssessment = await getUserOpenAssessment(userId)
	const assessments = await getUserAssessments(userId)
	const recentAssessments = assessments.slice(0, 3) // Show last 3 assessments

	return { user, openAssessment, recentAssessments }
}

export default function Page() {
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
