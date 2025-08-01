/**
 * @fileoverview Demo Layout Route
 *
 * This layout provides the shared UI structure for all demo routes.
 * It includes demo mode indicators, navigation, and easy exit paths.
 * No authentication is required for demo routes.
 */

import { Outlet, Link } from 'react-router'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { type Route } from './+types/_layout'

export async function loader({}: Route.LoaderArgs) {
	// No authentication required for demo routes
	return {}
}

export default function DemoLayout() {
	return (
		<div className="bg-background min-h-screen">
			<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
				<div className="container flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
						>
							<Icon name="arrow-left" className="h-4 w-4" />
							<span className="hidden sm:inline">Back to Home</span>
							<span className="sm:hidden">Back</span>
						</Link>
						<div className="bg-border h-6 w-px" />
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
							<span className="text-muted-foreground text-sm font-medium">
								Demo Mode
							</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
							<Icon name="check" className="h-3 w-3" />
							<span>No registration required</span>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link to="/signup">Create Account</Link>
						</Button>
					</div>
				</div>
			</header>

			<main className="flex-1">
				<Outlet />
			</main>

			{/* Demo footer with additional context */}
			<footer className="bg-muted/30 border-t">
				<div className="container py-4">
					<div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Icon name="question-mark-circled" className="h-4 w-4" />
								<span>This is a demo with 25 sample questions</span>
							</div>
							<div className="bg-border hidden h-4 w-px sm:block" />
							<div className="hidden items-center gap-2 sm:flex">
								<Icon name="clock" className="h-4 w-4" />
								<span>Takes ~5 minutes</span>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<Link
								to="/about"
								className="hover:text-foreground transition-colors"
							>
								Learn More
							</Link>
							<Link
								to="/support"
								className="hover:text-foreground transition-colors"
							>
								Support
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}

export function ErrorBoundary() {
	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
					<Icon name="cross-1" className="text-destructive h-8 w-8" />
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">Demo Unavailable</h1>
					<p className="text-muted-foreground max-w-md">
						The demo is temporarily unavailable. This might be due to a
						technical issue or your browser settings.
					</p>
				</div>

				<div className="flex flex-col justify-center gap-3 sm:flex-row">
					<Button variant="outline" onClick={() => window.location.reload()}>
						<Icon name="reset" className="mr-2 h-4 w-4" />
						Try Again
					</Button>
					<Button asChild>
						<Link to="/">Return to Home</Link>
					</Button>
				</div>

				<div className="text-muted-foreground pt-4 text-sm">
					<p>
						If the problem persists, you can{' '}
						<Link to="/signup" className="underline hover:no-underline">
							create a free account
						</Link>{' '}
						to access the full assessment.
					</p>
				</div>
			</div>
		</div>
	)
}
