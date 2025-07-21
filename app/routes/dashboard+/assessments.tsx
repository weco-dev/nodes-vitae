/**
 * @fileoverview Assessments Dashboard Route - Management interface for user ESG assessments
 *
 * ==================================================================================
 * ROUTE OVERVIEW
 * ==================================================================================
 *
 * This route provides a comprehensive dashboard for users to view, manage, and
 * navigate their ESG assessments. Features assessment listing with status indicators,
 * quick actions, and navigation to detailed views.
 *
 * KEY FEATURES:
 * 1. Assessment listing with status badges and metadata
 * 2. Quick action buttons for viewing and starting assessments
 * 3. Date formatting and progress indicators
 * 4. Responsive card-based layout
 * 5. Integration with assessment creation workflow
 *
 * ASSESSMENT MANAGEMENT:
 * - Lists all user assessments chronologically
 * - Shows assessment status (open, completed, archived)
 * - Provides quick access to assessment details and actions
 * - Supports assessment creation and continuation workflows
 *
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires date-fns
 * @requires react-router
 * @requires #app/components/ui/badge
 * @requires #app/components/ui/button
 * @requires #app/components/ui/card
 * @requires #app/utils/assessment.server
 * @requires #app/utils/auth.server
 *
 * @see {@link app/routes/dashboard+/assessment.$id.tsx} for individual assessment view
 * @see {@link app/routes/assessment+/take.tsx} for assessment creation
 */

import { format } from 'date-fns'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { Avatar, AvatarFallback } from '#app/components/ui/avatar.tsx'
import { Badge } from '#app/components/ui/badge.tsx'
import { Button } from '#app/components/ui/button.tsx'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#app/components/ui/card.tsx'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { Progress } from '#app/components/ui/progress.tsx'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select.tsx'
import { Separator } from '#app/components/ui/separator.tsx'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '#app/components/ui/tabs.tsx'
import { getUserAssessments } from '#app/utils/assessment.server.ts'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/assessments'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const assessments = await getUserAssessments(userId)

	return { assessments }
}

export default function AssessmentsRoute() {
	const { assessments } = useLoaderData<typeof loader>()
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [viewMode, setViewMode] = useState('grid')

	// Filter assessments based on search and status
	const filteredAssessments = assessments.filter((assessment) => {
		const matchesSearch = assessment.id
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesStatus =
			statusFilter === 'all' || assessment.status === statusFilter
		return matchesSearch && matchesStatus
	})

	// Calculate statistics
	const totalAssessments = assessments.length
	const completedAssessments = assessments.filter(
		(a) => a.status === 'completed',
	).length
	const openAssessments = assessments.filter((a) => a.status === 'open').length
	const completionRate =
		totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0

	const getStatusVariant = (status: string) => {
		switch (status) {
			case 'completed':
				return 'default'
			case 'open':
				return 'secondary'
			default:
				return 'outline'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed':
				return 'check'
			case 'open':
				return 'clock'
			default:
				return 'file-text'
		}
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="px-4 lg:px-6">
						{/* Header with enhanced styling */}
						<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="space-y-1">
								<h1 className="text-3xl font-bold tracking-tight">
									ESG Assessments
								</h1>
								<p className="text-muted-foreground text-lg">
									Manage and track your ESG assessment progress
								</p>
							</div>
							<Button asChild>
								<Link to="/assessment/take">
									<Icon name="plus" className="mr-2 h-4 w-4" />
									Start new assessment
								</Link>
							</Button>
						</div>

						{/* Statistics Cards */}
						<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Assessments
									</CardTitle>
									<Icon
										name="file-text"
										className="text-muted-foreground h-4 w-4"
									/>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{totalAssessments}</div>
									<p className="text-muted-foreground text-xs">
										All time assessments
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Completed
									</CardTitle>
									<Icon
										name="check"
										className="text-muted-foreground h-4 w-4"
									/>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{completedAssessments}
									</div>
									<p className="text-muted-foreground text-xs">
										Finished assessments
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										In Progress
									</CardTitle>
									<Icon
										name="clock"
										className="text-muted-foreground h-4 w-4"
									/>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{openAssessments}</div>
									<p className="text-muted-foreground text-xs">
										Ongoing assessments
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Completion Rate
									</CardTitle>
									<Icon
										name="arrow-right"
										className="text-muted-foreground h-4 w-4"
									/>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{completionRate.toFixed(0)}%
									</div>
									<Progress value={completionRate} className="mt-2" />
								</CardContent>
							</Card>
						</div>

						{/* Filters and Search */}
						<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="flex flex-1 gap-4">
								<div className="relative max-w-sm flex-1">
									<Icon
										name="magnifying-glass"
										className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
									/>
									<Input
										placeholder="Search assessments..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
										<SelectItem value="open">In Progress</SelectItem>
										<SelectItem value="archived">Archived</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex gap-2">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('grid')}
								>
									<Icon name="camera" className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'list' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('list')}
								>
									<Icon name="file-text" className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Assessments Content */}
						<Tabs defaultValue="all" className="space-y-6">
							<TabsList>
								<TabsTrigger value="all">All Assessments</TabsTrigger>
								<TabsTrigger value="completed">Completed</TabsTrigger>
								<TabsTrigger value="open">In Progress</TabsTrigger>
							</TabsList>

							<TabsContent value="all" className="space-y-4">
								{viewMode === 'grid' ? (
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{filteredAssessments.map((assessment) => (
											<Card
												key={assessment.id}
												className="transition-shadow hover:shadow-md"
											>
												<CardHeader>
													<div className="flex items-start justify-between">
														<div className="space-y-1">
															<CardTitle className="flex items-center gap-2 text-lg">
																<Icon
																	name={getStatusIcon(assessment.status)}
																	className="h-4 w-4"
																/>
																Assessment #{assessment.id.slice(-6)}
															</CardTitle>
															<CardDescription>
																ESG Assessment Report
															</CardDescription>
														</div>
														<DropdownMenu>
															{' '}
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="sm">
																	<Icon
																		name="dots-horizontal"
																		className="h-4 w-4"
																	/>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>{' '}
																<DropdownMenuItem asChild>
																	<Link
																		to={`/dashboard/assessment/${assessment.id}`}
																	>
																		<Icon
																			name="arrow-right"
																			className="mr-2 h-4 w-4"
																		/>
																		View Details
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Icon
																		name="download"
																		className="mr-2 h-4 w-4"
																	/>
																	Download Report
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem className="text-destructive">
																	<Icon name="trash" className="mr-2 h-4 w-4" />
																	Archive
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													<Badge
														variant={getStatusVariant(assessment.status)}
														className="w-fit"
													>
														<Icon
															name={getStatusIcon(assessment.status)}
															className="mr-1 h-3 w-3"
														/>
														{assessment.status}
													</Badge>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid grid-cols-2 gap-4 text-sm">
														<div>
															<p className="text-muted-foreground">Created</p>
															<p className="font-medium">
																{format(
																	new Date(assessment.createdAt),
																	'MMM dd, yyyy',
																)}
															</p>
														</div>
														{assessment.completedAt && (
															<div>
																<p className="text-muted-foreground">
																	Completed
																</p>
																<p className="font-medium">
																	{format(
																		new Date(assessment.completedAt),
																		'MMM dd, yyyy',
																	)}
																</p>
															</div>
														)}
														<div>
															<p className="text-muted-foreground">Answers</p>
															<p className="font-medium">
																{assessment.answers.length}
															</p>
														</div>
														<div>
															<p className="text-muted-foreground">Progress</p>
															<div className="flex items-center gap-2">
																<Progress
																	value={
																		assessment.status === 'completed' ? 100 : 65
																	}
																	className="flex-1"
																/>
																<span className="text-xs">
																	{assessment.status === 'completed'
																		? '100%'
																		: '65%'}
																</span>
															</div>
														</div>
													</div>

													<Separator />

													<div className="flex gap-2">
														{assessment.status === 'open' ? (
															<Button asChild size="sm" className="flex-1">
																<Link to="/assessment/take">
																	<Icon
																		name="arrow-right"
																		className="mr-2 h-4 w-4"
																	/>
																	Continue
																</Link>
															</Button>
														) : (
															<Button
																asChild
																size="sm"
																variant="outline"
																className="flex-1"
															>
																<Link
																	to={`/dashboard/assessment/${assessment.id}`}
																>
																	<Icon
																		name="arrow-right"
																		className="mr-2 h-4 w-4"
																	/>
																	View Details
																</Link>
															</Button>
														)}
														<Button size="sm" variant="ghost">
															<Icon name="link-2" className="h-4 w-4" />
														</Button>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className="space-y-4">
										{filteredAssessments.map((assessment) => (
											<Card
												key={assessment.id}
												className="transition-shadow hover:shadow-sm"
											>
												<CardContent className="flex items-center justify-between p-4">
													<div className="flex items-center space-x-4">
														<Avatar className="h-8 w-8">
															<AvatarFallback>
																<Icon
																	name={getStatusIcon(assessment.status)}
																	className="h-4 w-4"
																/>
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="text-sm leading-none font-medium">
																Assessment #{assessment.id.slice(-6)}
															</p>
															<p className="text-muted-foreground text-sm">
																Created{' '}
																{format(
																	new Date(assessment.createdAt),
																	'MMM dd, yyyy',
																)}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-4">
														<Badge
															variant={getStatusVariant(assessment.status)}
														>
															{assessment.status}
														</Badge>
														<div className="text-right">
															<p className="text-sm font-medium">
																{assessment.answers.length} answers
															</p>
															<p className="text-muted-foreground text-sm">
																{assessment.status === 'completed'
																	? 'Completed'
																	: 'In Progress'}
															</p>
														</div>
														{assessment.status === 'open' ? (
															<Button asChild size="sm">
																<Link to="/assessment/take">Continue</Link>
															</Button>
														) : (
															<Button asChild size="sm" variant="outline">
																<Link
																	to={`/dashboard/assessment/${assessment.id}`}
																>
																	View
																</Link>
															</Button>
														)}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</TabsContent>

							<TabsContent value="completed">
								{filteredAssessments.filter((a) => a.status === 'completed')
									.length > 0 ? (
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{filteredAssessments
											.filter((a) => a.status === 'completed')
											.map((assessment) => (
												<Card
													key={assessment.id}
													className="transition-shadow hover:shadow-md"
												>
													{/* Same card structure as above, but filtered for completed */}
													<CardHeader>
														<div className="flex items-start justify-between">
															<CardTitle className="flex items-center gap-2 text-lg">
																<Icon
																	name="check"
																	className="text-primary h-4 w-4"
																/>
																Assessment #{assessment.id.slice(-6)}
															</CardTitle>
															<Badge variant="default">
																<Icon name="check" className="mr-1 h-3 w-3" />
																Completed
															</Badge>
														</div>
													</CardHeader>
													<CardContent className="space-y-4">
														<div className="text-sm">
															<p className="text-muted-foreground">
																Completed on
															</p>
															<p className="font-medium">
																{assessment.completedAt &&
																	format(
																		new Date(assessment.completedAt),
																		'PPP',
																	)}
															</p>
														</div>
														<Button asChild size="sm" className="w-full">
															<Link
																to={`/dashboard/assessment/${assessment.id}`}
															>
																<Icon
																	name="arrow-right"
																	className="mr-2 h-4 w-4"
																/>
																View Report
															</Link>
														</Button>
													</CardContent>
												</Card>
											))}
									</div>
								) : (
									<Card className="py-12 text-center">
										<CardContent className="space-y-4">
											<div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
												<Icon
													name="check"
													className="text-muted-foreground h-6 w-6"
												/>
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">
													No completed assessments
												</h3>
												<p className="text-muted-foreground mx-auto max-w-sm">
													You haven't completed any ESG assessments yet. Start
													your first assessment to see it here when complete.
												</p>
											</div>
											<Button asChild className="mt-4">
												<Link to="/assessment/take">
													<Icon name="plus" className="mr-2 h-4 w-4" />
													Start New Assessment
												</Link>
											</Button>
										</CardContent>
									</Card>
								)}
							</TabsContent>

							<TabsContent value="open">
								{filteredAssessments.filter((a) => a.status === 'open').length >
								0 ? (
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{filteredAssessments
											.filter((a) => a.status === 'open')
											.map((assessment) => (
												<Card
													key={assessment.id}
													className="border-secondary transition-shadow hover:shadow-md"
												>
													<CardHeader>
														<div className="flex items-start justify-between">
															<CardTitle className="flex items-center gap-2 text-lg">
																<Icon
																	name="clock"
																	className="text-secondary-foreground h-4 w-4"
																/>
																Assessment #{assessment.id.slice(-6)}
															</CardTitle>
															<Badge variant="secondary">
																<Icon name="clock" className="mr-1 h-3 w-3" />
																In Progress
															</Badge>
														</div>
													</CardHeader>
													<CardContent className="space-y-4">
														<div className="text-sm">
															<p className="text-muted-foreground">
																Started on
															</p>
															<p className="font-medium">
																{format(new Date(assessment.createdAt), 'PPP')}
															</p>
														</div>
														<div>
															<div className="mb-2 flex items-center justify-between text-sm">
																<span className="text-muted-foreground">
																	Progress
																</span>
																<span>65%</span>
															</div>
															<Progress value={65} />
														</div>
														<Button asChild size="sm" className="w-full">
															<Link to="/assessment/take">
																<Icon
																	name="arrow-right"
																	className="mr-2 h-4 w-4"
																/>
																Continue Assessment
															</Link>
														</Button>
													</CardContent>
												</Card>
											))}
									</div>
								) : (
									<Card className="py-12 text-center">
										<CardContent className="space-y-4">
											<div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
												<Icon
													name="clock"
													className="text-muted-foreground h-6 w-6"
												/>
											</div>
											<div className="space-y-2">
												<h3 className="text-lg font-semibold">
													No assessments in progress
												</h3>
												<p className="text-muted-foreground mx-auto max-w-sm">
													You don't have any ongoing assessments. Start a new
													assessment to begin tracking your ESG progress.
												</p>
											</div>
											<Button asChild className="mt-4">
												<Link to="/assessment/take">
													<Icon name="plus" className="mr-2 h-4 w-4" />
													Start New Assessment
												</Link>
											</Button>
										</CardContent>
									</Card>
								)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}
