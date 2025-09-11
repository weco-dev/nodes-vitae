/**
 * @fileoverview Demo Session Client Utilities
 *
 * This module provides client-side utilities for managing demo session IDs.
 * It handles session ID generation and retrieval from localStorage.
 *
 * Key Features:
 * - Generate unique session IDs for demo tracking
 * - Persist session IDs in localStorage
 * - Initialize demo session tracking
 */

const DEMO_SESSION_ID_KEY = 'vitae-demo-session-id'

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
	// Generate a UUID-like string for session tracking
	return 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Get demo session ID from localStorage or generate a new one
 */
export function getDemoSessionId(): string {
	if (typeof window === 'undefined') {
		return generateSessionId()
	}

	try {
		let sessionId = localStorage.getItem(DEMO_SESSION_ID_KEY)
		if (!sessionId) {
			sessionId = generateSessionId()
			localStorage.setItem(DEMO_SESSION_ID_KEY, sessionId)
		}
		return sessionId
	} catch (error) {
		console.warn('Failed to get/set demo session ID:', error)
		return generateSessionId()
	}
}

/**
 * Initialize demo session tracking (generate and store session ID)
 */
export function initializeDemoSession(): string {
	const sessionId = getDemoSessionId()
	return sessionId
}

/**
 * Clear demo session ID (for demo reset)
 */
export function clearDemoSessionId(): void {
	if (typeof window === 'undefined') return

	try {
		localStorage.removeItem(DEMO_SESSION_ID_KEY)
	} catch (error) {
		console.warn('Failed to clear demo session ID:', error)
	}
}
