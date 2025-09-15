import { useLocation } from 'react-router'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '#app/components/ui/breadcrumb'

interface BreadcrumbItem {
	label: string
	href?: string
}

// Map of routes to their breadcrumb configurations
const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
	'/': [{ label: 'Dashboard' }],
	'/dashboard': [{ label: 'Dashboard' }],
	'/settings/assessments': [
		{ label: 'Dashbaord', href: '/dashbaord' },
		{ label: 'Assessments' },
	],
	'/settings': [{ label: 'Settings' }],
	'/settings/profile': [
		{ label: 'Settings', href: '/settings' },
		{ label: 'Profile' },
	],
	'/help': [{ label: 'Get Help' }],
}

// Function to generate breadcrumbs from pathname
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
	// Check if we have an exact match
	if (routeBreadcrumbs[pathname]) {
		return routeBreadcrumbs[pathname]
	}

	// Generate breadcrumbs from path segments
	const segments = pathname.split('/').filter(Boolean)
	const breadcrumbs: BreadcrumbItem[] = []

	// Always start with Dashboard/Home
	// if (segments.length > 0) {
	// 	breadcrumbs.push({ label: 'Dashboard', href: '/' })
	// }

	// Add each segment as a breadcrumb
	segments.forEach((segment, index) => {
		const href = '/' + segments.slice(0, index + 1).join('/')
		const label =
			segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')

		if (index === segments.length - 1) {
			// Last segment is the current page (no href)
			breadcrumbs.push({ label })
		} else {
			breadcrumbs.push({ label, href })
		}
	})

	return breadcrumbs
}

export function DynamicBreadcrumb() {
	const location = useLocation()
	const breadcrumbs = generateBreadcrumbsFromPath(location.pathname)

	// Don't show breadcrumb if we're on the root/dashboard
	if (location.pathname === '/' || breadcrumbs.length <= 1) {
		return (
			<h1 className="text-base font-medium">
				{breadcrumbs[0]?.label || 'Dashboard'}
			</h1>
		)
	}

	const currentPage = breadcrumbs[breadcrumbs.length - 1]

	return (
		<>
			{/* Mobile: Show only current page */}
			<div className="sm:hidden">
				<h1 className="text-base font-medium">{currentPage?.label}</h1>
			</div>

			{/* Desktop: Show full breadcrumb */}
			<Breadcrumb className="hidden sm:block">
				<BreadcrumbList>
					{breadcrumbs.map((breadcrumb, index) => (
						<div key={index} className="flex items-center">
							<BreadcrumbItem>
								{breadcrumb.href ? (
									<BreadcrumbLink href={breadcrumb.href}>
										<span className="text-base font-medium">
											{breadcrumb.label}
										</span>
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage>
										<span className="text-base font-medium">
											{breadcrumb.label}
										</span>
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
						</div>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</>
	)
}
