'use client'

import { useRef } from 'react'
import { Form, Link } from 'react-router'

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '#app/components/ui/sidebar'
import { cn } from '#app/utils/misc'
import { Button } from './ui/button'
import { Icon } from './ui/icon'

export function NavSettings({
	//items,
	className,
}: {
	// items: {
	// 	title: string
	// 	url: string
	// 	icon: Icon
	// 	items?: {
	// 		title: string
	// 		url: string
	// 	}[]
	// }[]
	className?: string
}) {
	//const { isMobile } = useSidebar()
	const formRef = useRef<HTMLFormElement>(null)

	return (
		<SidebarGroup
			className={cn('group-data-[collapsible=icon]:hidden', className)}
		>
			<SidebarGroupLabel>Altro</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<Link to="/dashboard/settings">
							<Icon name="settings" />
							Impostazioni
						</Link>
					</SidebarMenuButton>
					<SidebarMenuButton asChild>
						<Link to="https://we.co.it">
							<Icon name="heart" />
							Weco
						</Link>
					</SidebarMenuButton>
					<SidebarMenuButton asChild>
						<Form action="/logout" method="POST" ref={formRef}>
							<Button
								variant="ghost"
								type="submit"
								className="pl-0 font-normal"
							>
								<Icon name="log-out" />
								Esci dalla Dashboard
							</Button>
						</Form>
					</SidebarMenuButton>
				</SidebarMenuItem>
				{/* {items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton asChild>
							<Link to={item.url}>
								<item.icon />
								<span>{item.title}</span>
							</Link>
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
									className="w-64 rounded-lg"
									side={isMobile ? 'bottom' : 'right'}
									align={isMobile ? 'end' : 'start'}
								>
									{item.items.map((subItem) => (
										<DropdownMenuItem key={subItem.title} asChild>
											<Link to={subItem.url}>
												<span>{subItem.title}</span>
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SidebarMenuItem>
				))} */}
			</SidebarMenu>
		</SidebarGroup>
	)
}
