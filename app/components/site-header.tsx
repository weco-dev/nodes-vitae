import { useRef } from 'react'
import { Form, Link } from 'react-router'
import { DynamicBreadcrumb } from '#app/components/dynamic-breadcrumb'
import { Button } from '#app/components/ui/button'
import { Separator } from '#app/components/ui/separator'
import { SidebarTrigger } from '#app/components/ui/sidebar'
import { Icon } from './ui/icon'

export function SiteHeader() {
	const formRef = useRef<HTMLFormElement>(null)
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<DynamicBreadcrumb />
				<div className="ml-auto flex items-center gap-2">
					<Link to="https://we.co.it">
						<Button variant="ghost" className="w-full">
							<Icon name="heart" />
							Weco
						</Button>
					</Link>

					<Form action="/logout" method="POST" ref={formRef}>
						<Button variant="ghost" type="submit" className="w-full">
							<Icon name="log-out" />
							Esci dalla Dashboard
						</Button>
					</Form>
				</div>
			</div>
		</header>
	)
}
