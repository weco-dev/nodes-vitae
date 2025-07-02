import { Link } from 'react-router'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/index'

export async function loader({ request }: Route.LoaderArgs) {
	await requireUserId(request)
	return {}
}

export default function SettingsIndex() {
	const settingsItems = [
		{
			title: 'Profile',
			description: 'Manage your personal information and account details',
			href: '/dashboard/settings/profile',
			icon: 'file-text',
		},
		{
			title: 'Password',
			description: 'Update your password and security settings',
			href: '/dashboard/settings/profile/password',
			icon: 'lock',
		},
		{
			title: 'Two-Factor Authentication',
			description: 'Add an extra layer of security to your account',
			href: '/dashboard/settings/profile/two-factor',
			icon: 'shield',
		},
		{
			title: 'Passkeys',
			description: 'Manage your passkeys for secure authentication',
			href: '/dashboard/settings/profile/passkeys',
			icon: 'key',
		},
		{
			title: 'Connected Accounts',
			description: 'Manage third-party account connections',
			href: '/dashboard/settings/profile/connections',
			icon: 'link',
		},
		{
			title: 'Profile Photo',
			description: 'Update your profile picture',
			href: '/dashboard/settings/profile/photo',
			icon: 'camera',
		},
	]

	return (
		<div className="p-6">
			<div className="grid gap-4 md:grid-cols-2">
				{settingsItems.map((item) => (
					<Link key={item.href} to={item.href}>
						<Card className="hover:bg-muted/50 h-full transition-colors">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Icon name={item.icon as any} size="md" />
									<CardTitle className="text-lg">{item.title}</CardTitle>
								</div>
								<CardDescription>{item.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}
