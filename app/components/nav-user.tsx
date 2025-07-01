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

import { Avatar, AvatarFallback, AvatarImage } from '#app/components/ui/avatar'
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
import { getUserImgSrc } from '#app/utils/misc.tsx'
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
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarFallback className="rounded-lg">?</AvatarFallback>
						</Avatar>
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
							<Avatar className="h-8 w-8 rounded-lg grayscale">
								<AvatarImage
									src={getUserImgSrc(user.image?.objectKey)}
									alt={user.name ?? user.username}
								/>
								<AvatarFallback className="rounded-lg">
									{(user.name ?? user.username).slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
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
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={getUserImgSrc(user.image?.objectKey)}
										alt={user.name ?? user.username}
									/>
									<AvatarFallback className="rounded-lg">
										{(user.name ?? user.username).slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
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
								<Link to={`/users/${user.username}`}>
									<IconUserCircle />
									Account
								</Link>
							</DropdownMenuItem>
							{/* <DropdownMenuItem asChild>
								<Link to={`/users/${user.username}/notes`}>
									<IconNotes />
									Notes
								</Link>
							</DropdownMenuItem> */}
							<DropdownMenuItem>
								<IconCreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconNotification />
								Notifications
							</DropdownMenuItem>
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
