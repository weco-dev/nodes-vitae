import { Outlet } from 'react-router'
import { AppSidebar } from '#app/components/app-sidebar'
import { SiteHeader } from '#app/components/site-header'
import { SidebarInset, SidebarProvider } from '#app/components/ui/sidebar'

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
