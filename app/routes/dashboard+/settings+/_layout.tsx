import { Outlet } from 'react-router'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/_layout'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	return {}
}

export default function SettingsLayout() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="flex flex-col gap-4">
							<div>
								<h1 className="text-2xl font-semibold">Settings</h1>
								<p className="text-muted-foreground">
									Manage your account settings and preferences.
								</p>
							</div>
							<div className="bg-card rounded-lg border">
								<Outlet />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
