'use client'

import { IconDots, type Icon } from '@tabler/icons-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '#app/components/ui/sidebar'
import { cn } from '#app/utils/misc'

export function NavSettings({
	items,
	className,
}: {
	items: {
		title: string
		url: string
		icon: Icon
		items?: {
			title: string
			url: string
		}[]
	}[]
	className?: string
}) {
	const { isMobile } = useSidebar()

	return (
		<SidebarGroup
			className={cn('group-data-[collapsible=icon]:hidden', className)}
		>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						</SidebarMenuButton>
						{item.items && item.items.length > 0 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm">
										<IconDots />
										<span className="sr-only">
											More options for {item.title}
										</span>
									</SidebarMenuAction>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-32 rounded-lg"
									side={isMobile ? 'bottom' : 'right'}
									align={isMobile ? 'end' : 'start'}
								>
									{item.items.map((subItem) => (
										<DropdownMenuItem key={subItem.title} asChild>
											<a href={subItem.url}>
												<span>{subItem.title}</span>
											</a>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
