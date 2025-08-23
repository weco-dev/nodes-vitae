/**
 * @fileoverview Question Filtering Utilities - Helper functions for filtering assessment questions
 *
 * ==================================================================================
 * MODULE OVERVIEW
 * ==================================================================================
 *
 * This module provides utility functions for filtering and categorizing assessment
 * questions based on their types and properties. It's particularly useful for
 * excluding umbrella/group questions from calculations and progress tracking.
 *
 * KEY RESPONSIBILITIES:
 * 1. Filter answerable questions (exclude umbrella/group questions)
 * 2. Calculate accurate progress percentages
 * 3. Support proper question counting for UI components
 * 4. Maintain separation of concerns from core question configuration
 *
 * USAGE SCENARIOS:
 * - Progress bar calculations
 * - Assessment completion percentage
 * - Total question counts for UI display
 * - Question validation and requirements checking
 *
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-29
 * @requires #app/utils/assessment-questions
 */

import {
	type QuestionConfig,
	assessmentQuestions,
} from './assessment-questions.ts'

/**
 * @function getAnswerableQuestions
 * @description Returns only questions that require user input (excludes umbrella/group questions)
 *
 * This utility function filters out umbrella questions (type: 'group') from the total
 * question count since they are navigation-only questions that don't require answers
 * and shouldn't be counted in progress calculations.
 *
 * @returns {QuestionConfig[]} Array of questions that can be answered (excludes group questions)
 *
 * @example
 * ```typescript
 * import { getAnswerableQuestions } from '#app/utils/question-filtering.ts'
 *
 * // Get total count of answerable questions
 * const totalQuestions = getAnswerableQuestions().length
 *
 * // Calculate completion percentage
 * const completionPercentage = (answeredQuestions / totalQuestions) * 100
 * ```
 *
 * @since 1.0.0
 * @author ESG Assessment Team
 */
export function getAnswerableQuestions(): QuestionConfig[] {
	return assessmentQuestions.filter((question) => question.type !== 'group')
}

/**
 * @function getRequiredAnswerableQuestions
 * @description Returns only required questions that need user input (excludes umbrella/group questions)
 *
 * This function combines filtering for both answerable questions and required status,
 * useful for calculating mandatory completion percentages.
 *
 * @returns {QuestionConfig[]} Array of required questions that can be answered
 *
 * @example
 * ```typescript
 * import { getRequiredAnswerableQuestions } from '#app/utils/question-filtering.ts'
 *
 * // Get count of required answerable questions
 * const requiredQuestions = getRequiredAnswerableQuestions().length
 *
 * // Calculate mandatory completion percentage
 * const mandatoryPercentage = (answeredRequired / requiredQuestions) * 100
 * ```
 *
 * @since 1.0.0
 * @author ESG Assessment Team
 */
export function getRequiredAnswerableQuestions(): QuestionConfig[] {
	return getAnswerableQuestions().filter((question) => question.isRequired)
}

/**
 * @function getGroupQuestions
 * @description Returns only umbrella/group questions (navigation-only questions)
 *
 * This function returns questions that serve as umbrella/group questions for
 * organizational purposes but don't require user input.
 *
 * @returns {QuestionConfig[]} Array of group/umbrella questions
 *
 * @example
 * ```typescript
 * import { getGroupQuestions } from '#app/utils/question-filtering.ts'
 *
 * // Get all umbrella questions
 * const umbrellaQuestions = getGroupQuestions()
 *
 * // Check if a specific question is an umbrella question
 * const isUmbrella = umbrellaQuestions.some(q => q.questionId === 'S2.2.Group')
 * ```
 *
 * @since 1.0.0
 * @author ESG Assessment Team
 */
export function getGroupQuestions(): QuestionConfig[] {
	return assessmentQuestions.filter((question) => question.type === 'group')
}
