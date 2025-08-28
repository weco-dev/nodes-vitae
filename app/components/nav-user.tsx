import {
	IconCreditCard,
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
	// IconNotes,
} from '@tabler/icons-react'
import { useRef } from 'react'
import { Link, Form } from 'react-router'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '#app/components/ui/sidebar'
import { useOptionalUser } from '#app/utils/user.ts'

export function NavUser() {
	const { isMobile } = useSidebar()
	const user = useOptionalUser()
	const formRef = useRef<HTMLFormElement>(null)

	// For debugging - show a placeholder if no user
	if (!user) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg">
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">No User</span>
							<span className="text-muted-foreground truncate text-xs">
								Not logged in
							</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.name ?? user.username}
								</span>
								<span className="text-muted-foreground truncate text-xs">
									@{user.username}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name ?? user.username}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										@{user.username}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings/profile">
									<IconUserCircle />
									Profilo
								</Link>
							</DropdownMenuItem>
							{/* <DropdownMenuItem asChild>
								<Link to="/dashboard/settings/#">
									<IconCreditCard />
									Billing
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings/#">
									<IconNotification />
									Notifications
								</Link>
							</DropdownMenuItem> */}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<Form action="/logout" method="POST" ref={formRef}>
							<DropdownMenuItem asChild>
								<button type="submit" className="w-full">
									<IconLogout />
									Logout
								</button>
							</DropdownMenuItem>
						</Form>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
