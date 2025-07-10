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
				<div className="flex flex-col gap-4 py-4 md:mt-4 md:ml-12 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						<div className="flex flex-col gap-4">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
