/**
 * @fileoverview NavMain - Primary navigation component for sidebar main content
 *
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 *
 * This component renders the main navigation section within the application sidebar,
 * featuring a prominent assessment call-to-action and dynamic navigation menu items.
 * It integrates with the assessment system to provide contextual buttons based on
 * user assessment status.
 *
 * KEY FEATURES:
 * 1. Dynamic assessment button (Start/Continue based on user state)
 * 2. Configurable navigation menu items with icons
 * 3. Contextual tooltips for enhanced UX
 * 4. Responsive design with collapsible sidebar support
 * 5. Loader data integration for real-time state updates
 *
 * ==================================================================================
 * ASSESSMENT INTEGRATION
 * ==================================================================================
 *
 * DYNAMIC BUTTON LOGIC:
 * - Reads openAssessment from loader data to determine button state
 * - "Start Assessment" for new users or completed assessments
 * - "Continue Assessment" for users with open/in-progress assessments
 * - Direct navigation to /assessment/take route
 *
 * STATE DEPENDENCIES:
 * - useLoaderData provides openAssessment status from parent routes
 * - Button styling and text adapt based on assessment state
 * - Tooltip content changes dynamically for accessibility
 *
 * ==================================================================================
 * NAVIGATION STRUCTURE
 * ==================================================================================
 *
 * MENU ORGANIZATION:
 * 1. Primary Assessment Section (Start/Continue button + Inbox icon)
 * 2. Secondary Navigation Items (Dashboard, ESG Assessment, Analytics, etc.)
 *
 * ITEM CONFIGURATION:
 * Each navigation item includes:
 * - title: Display text for the menu item
 * - url: Navigation target (React Router Link)
 * - icon: Optional Tabler icon component
 *
 * RESPONSIVE BEHAVIOR:
 * - Icons hide when sidebar is in icon-only mode
 * - Tooltips provide context when labels are hidden
 * - Smooth transitions with CSS duration classes
 *
 * @version 1.0.0
 * @author Vitae Development Team
 * @since 1.0.0
 * @requires react
 * @requires react-router
 * @requires @tabler/icons-react
 * @requires #app/components/ui/sidebar
 * @requires #app/components/ui/button
 *
 * @example
 * ```tsx
 * const navigationItems = [
 *   { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
 *   { title: "ESG Assessment", url: "/dashboard/assessments", icon: IconClipboardCheck }
 * ]
 *
 * <NavMain items={navigationItems} />
 * ```
 *
 * @see {@link app/components/app-sidebar.tsx} for parent component integration
 * @see {@link app/components/ui/sidebar.tsx} for sidebar component system
 */

import { IconCirclePlusFilled, type Icon } from '@tabler/icons-react'
import { useLoaderData, Link } from 'react-router'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '#app/components/ui/sidebar'

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: Icon
	}[]
}) {
	const { openAssessment } = useLoaderData<any>()
	const { closeMobileSidebar } = useSidebar()

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip={
								openAssessment ? 'Continua questionario' : 'Inizia questionario'
							}
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
							asChild
						>
							<Link to="/assessment/take" onClick={closeMobileSidebar}>
								<IconCirclePlusFilled />
								<span>
									{openAssessment
										? 'Continua questionario'
										: 'Inizia questionario'}
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title} asChild>
								<Link to={item.url} onClick={closeMobileSidebar}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
