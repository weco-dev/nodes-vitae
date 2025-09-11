/**
 * @fileoverview Demo Session Server Utilities
 *
 * This module provides server-side utilities for managing completed demo sessions.
 * It handles saving completed demo sessions to the database for persistence and analytics.
 *
 * Key Features:
 * - Save completed demo sessions only (no partial sessions)
 * - Prevent duplicate session storage
 * - Basic analytics for completed sessions
 */

import { prisma } from './db.server.ts'

export interface CompletedDemoSessionData {
	sessionId: string
	surveyData: Record<string, any>
	startTime: number
}

/**
 * Save completed demo session to database
 */
export async function saveCompletedDemoSession(
	sessionId: string,
	demoData: CompletedDemoSessionData,
): Promise<void> {
	try {
		await prisma.demoSession.create({
			data: {
				sessionId,
				surveyData: JSON.stringify(demoData.surveyData),
				startTime: new Date(demoData.startTime),
				completedAt: new Date(),
				isCompleted: true,
			},
		})
	} catch (error) {
		// If it's a unique constraint violation (duplicate sessionId), ignore it
		if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
			console.warn(`Demo session ${sessionId} already exists, skipping save`)
			return
		}
		// Re-throw other errors
		throw error
	}
}

/**
 * Check if demo session already exists (prevent duplicates)
 */
export async function demoSessionExists(sessionId: string): Promise<boolean> {
	try {
		const session = await prisma.demoSession.findUnique({
			where: { sessionId },
			select: { id: true },
		})
		return session !== null
	} catch (error) {
		console.warn('Failed to check demo session existence:', error)
		return false
	}
}

/**
 * Get completed demo session count (for admin insights)
 */
export async function getCompletedDemoSessionsCount(): Promise<number> {
	try {
		return await prisma.demoSession.count()
	} catch (error) {
		console.warn('Failed to get completed demo sessions count:', error)
		return 0
	}
}

/**
 * Get completed demo sessions with pagination (for admin)
 */
export async function getCompletedDemoSessions(
	page: number = 1,
	limit: number = 50,
) {
	try {
		const offset = (page - 1) * limit
		const sessions = await prisma.demoSession.findMany({
			select: {
				id: true,
				sessionId: true,
				startTime: true,
				completedAt: true,
			},
			orderBy: { completedAt: 'desc' },
			skip: offset,
			take: limit,
		})

		const total = await getCompletedDemoSessionsCount()

		return {
			sessions,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	} catch (error) {
		console.warn('Failed to get completed demo sessions:', error)
		return {
			sessions: [],
			total: 0,
			page,
			limit,
			totalPages: 0,
		}
	}
}
