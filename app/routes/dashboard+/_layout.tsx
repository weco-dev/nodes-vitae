import { Outlet, redirect } from 'react-router'
import { AppSidebar } from '#app/components/app-sidebar'
import { SiteHeader } from '#app/components/site-header'
import { SidebarInset, SidebarProvider } from '#app/components/ui/sidebar'
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
