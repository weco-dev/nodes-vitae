/**
 * @fileoverview SectionDisplay - Section navigation component for ESG assessment
 *
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 *
 * This component provides section navigation and progress tracking during ESG
 * (Environmental, Social, Governance) assessment completion. It displays a dropdown
 * to navigate between different sections and shows numerical progress.
 *
 * KEY FEATURES:
 * 1. Section dropdown navigation with clean section names
 * 2. Numerical progress indicator (current question / total questions)
 * 3. Section-to-question mapping for direct navigation
 * 4. Clean, consistent visual design with muted backgrounds
 * 5. Responsive layout with flexbox positioning
 *
 * @version 2.0.0
 * @author ESG Assessment Team
 * @since 2025-07-18
 * @requires react
 * @requires #app/components/ui/select
 */

import { Button } from '#app/components/ui/button'
import { Icon } from '#app/components/ui/icon'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '#app/components/ui/select'
import { cn } from '#app/utils/misc.tsx'

interface SectionDisplayProps {
	section: string
	currentQuestion: number
	totalQuestions: number
	questions: Array<{
		questionId: string
		section: string
		title: string
		isRequired: boolean
	}>
	onSectionChange: (sectionIndex: number) => Promise<void> | void
	isNavigating?: boolean
	onNavigatePrevious?: () => Promise<void> | void
	onNavigateNext?: () => Promise<void> | void
	canNavigatePrevious?: boolean
	canNavigateNext?: boolean
}

export function SectionDisplay({
	section,
	currentQuestion,
	totalQuestions,
	questions,
	onSectionChange,
	isNavigating = false,
	onNavigatePrevious,
	onNavigateNext,
	canNavigatePrevious = false,
	canNavigateNext = false,
}: SectionDisplayProps) {
	// Extract unique sections and their first question indices
	const sections = questions.reduce(
		(acc, question, index) => {
			if (!acc.find((s) => s.section === question.section)) {
				acc.push({
					section: question.section,
					firstQuestionIndex: index,
					label: question.section || 'Unknown Section', // Use full section name
				})
			}
			return acc
		},
		[] as Array<{
			section: string
			firstQuestionIndex: number
			label: string
		}>,
	)

	const handleSectionChange = async (sectionName: string) => {
		if (!isNavigating) {
			const selectedSection = sections.find((s) => s.section === sectionName)
			if (selectedSection) {
				try {
					await onSectionChange(selectedSection.firstQuestionIndex)
				} catch (error) {
					console.error('Section navigation failed:', error)
				}
			}
		}
	}

	return (
		<div className="bg-muted mb-6 rounded-lg p-4">
			<div className="flex items-center justify-between">
				<div className="mr-4 flex-1">
					<p className="text-muted-foreground mb-2 text-sm">
						Navigate to Section
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onNavigatePrevious}
							disabled={!canNavigatePrevious || isNavigating}
							className={cn(
								'shrink-0',
								isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
							)}
						>
							<Icon name="arrow-left" className="h-4 w-4" />
							Previous
						</Button>
						<Select
							value={section}
							onValueChange={handleSectionChange}
							disabled={isNavigating}
						>
							<SelectTrigger
								className={cn(
									'flex-1',
									isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
								)}
							>
								<SelectValue placeholder="Select section..." />
							</SelectTrigger>
							<SelectContent>
								{sections.map((sectionItem) => (
									<SelectItem
										key={sectionItem.section}
										value={sectionItem.section}
									>
										{sectionItem.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="sm"
							onClick={onNavigateNext}
							disabled={!canNavigateNext || isNavigating}
							className={cn(
								'shrink-0',
								isNavigating && 'animate-pulse cursor-not-allowed opacity-50',
							)}
						>
							Next
							<Icon name="arrow-right" className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="text-right">
					<p className="text-muted-foreground text-sm">Question</p>
					<p className="text-lg font-semibold">
						{currentQuestion} / {totalQuestions}
					</p>
				</div>
			</div>
		</div>
	)
}
