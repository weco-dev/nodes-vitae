/**
 * @fileoverview Main application sidebar component that provides navigation structure
 * 
 * This component renders the primary navigation sidebar for the Vitae application,
 * including main navigation items, document links, settings, and user information.
 * It uses a collapsible offcanvas sidebar pattern for responsive design.
 * 
 * Key features:
 * - Responsive collapsible sidebar
 * - Structured navigation sections (main, documents, settings)
 * - Brand logo and application title
 * - User profile section in footer
 * 
 * @author Vitae Development Team
 * @since 1.0.0
 */

import {
	IconCamera,
	IconChartBar,
	IconClipboardCheck,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react'
import * as React from 'react'

import { NavMain } from '#app/components/nav-main'
import { NavSettings } from '#app/components/nav-settings'
import { NavUser } from '#app/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '#app/components/ui/sidebar'

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'ESG Assessment',
			url: '/dashboard/assessments',
			icon: IconClipboardCheck,
		},
	],
	navClouds: [
		{
			title: 'Capture',
			icon: IconCamera,
			isActive: true,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Proposal',
			icon: IconFileDescription,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
		{
			title: 'Prompts',
			icon: IconFileAi,
			url: '#',
			items: [
				{
					title: 'Active Proposals',
					url: '#',
				},
				{
					title: 'Archived',
					url: '#',
				},
			],
		},
	],
	documents: [
		{
			name: 'Data Library',
			url: '#',
			icon: IconDatabase,
		},
		{
			name: 'Reports',
			url: '#',
			icon: IconReport,
		},
		{
			name: 'Word Assistant',
			url: '#',
			icon: IconFileWord,
		},
	],
	navSettings: [
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: IconSettings,
			// items: [
			// 	{
			// 		title: 'Il mio profilo',
			// 		url: '/dashboard/settings/profile',
			// 	},
			// 	{
			// 		title: 'Piano pagamento',
			// 		url: '#',
			// 	},
			// 	{
			// 		title: 'Notifiche',
			// 		url: '#',
			// 	},
			// ],
		},
		{
			title: 'Get Help',
			url: '#',
			icon: IconHelp,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">Vitae</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSettings items={data.navSettings} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
