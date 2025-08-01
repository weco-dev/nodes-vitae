/**
 * @fileoverview Demo Storage Utilities
 * 
 * This module provides localStorage-based data persistence for the demo assessment.
 * It handles demo progress, answers, completion status, and analytics tracking.
 * 
 * Key Features:
 * - localStorage-based persistence (no database required)
 * - Session data management with progress tracking
 * - Analytics event collection for demo usage
 * - Error handling for quota limits and browser compatibility
 * - Automatic cleanup and data isolation from production
 */

const DEMO_STORAGE_KEY = 'vitae-demo-assessment'
const DEMO_ANALYTICS_KEY = 'vitae-demo-analytics'

export interface DemoData {
  currentPageIndex: number
  surveyData: Record<string, any>
  startTime: number
  lastUpdated: number
  isCompleted: boolean
  version: string // For future migrations if needed
}

export interface DemoAnalyticsEvent {
  event: string
  timestamp: number
  data: Record<string, any>
}

/**
 * Get demo data from localStorage with fallback to defaults
 */
export function getDemoDataFromLocalStorage(): DemoData {
  if (typeof window === 'undefined') {
    return getDefaultDemoData()
  }

  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!stored) return getDefaultDemoData()
    
    const parsed = JSON.parse(stored) as DemoData
    
    // Ensure we have all required fields
    return {
      currentPageIndex: parsed.currentPageIndex ?? 0,
      surveyData: parsed.surveyData ?? {},
      startTime: parsed.startTime ?? Date.now(),
      lastUpdated: parsed.lastUpdated ?? Date.now(),
      isCompleted: parsed.isCompleted ?? false,
      version: parsed.version ?? '1.0'
    }
  } catch (error) {
    console.warn('Failed to parse demo data from localStorage:', error)
    return getDefaultDemoData()
  }
}

/**
 * Save demo progress to localStorage
 */
export function saveDemoProgressToLocalStorage(surveyData: Record<string, any>, pageIndex: number): void {
  if (typeof window === 'undefined') return

  try {
    const current = getDemoDataFromLocalStorage()
    const updated: DemoData = {
      ...current,
      surveyData,
      currentPageIndex: pageIndex,
      lastUpdated: Date.now()
    }
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.warn('Failed to save demo progress:', error)
    // Could be quota exceeded - try to clean up old data
    try {
      const current = getDemoDataFromLocalStorage()
      clearOldDemoAnalytics()
      const updated: DemoData = {
        ...current,
        surveyData,
        currentPageIndex: pageIndex,
        lastUpdated: Date.now()
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated))
    } catch (retryError) {
      console.error('Failed to save demo progress after cleanup:', retryError)
    }
  }
}

/**
 * Save individual demo answer to localStorage
 */
export function saveDemoAnswerToLocalStorage(questionName: string, answer: any): void {
  if (typeof window === 'undefined') return

  try {
    const current = getDemoDataFromLocalStorage()
    const updated: DemoData = {
      ...current,
      surveyData: {
        ...current.surveyData,
        [questionName]: answer
      },
      lastUpdated: Date.now()
    }
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.warn('Failed to save demo answer:', error)
  }
}

/**
 * Mark demo as completed in localStorage
 */
export function completeDemoInLocalStorage(): void {
  if (typeof window === 'undefined') return

  try {
    const current = getDemoDataFromLocalStorage()
    const updated: DemoData = {
      ...current,
      isCompleted: true,
      lastUpdated: Date.now()
    }
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated))
    trackDemoAnalytics('demo_completed', { 
      totalQuestions: Object.keys(current.surveyData).length,
      sessionDuration: Date.now() - current.startTime
    })
  } catch (error) {
    console.warn('Failed to complete demo:', error)
  }
}

/**
 * Clear all demo data from localStorage
 */
export function clearDemoData(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(DEMO_STORAGE_KEY)
    localStorage.removeItem(DEMO_ANALYTICS_KEY)
  } catch (error) {
    console.warn('Failed to clear demo data:', error)
  }
}

/**
 * Track demo analytics event
 */
export function trackDemoAnalytics(event: string, data: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return

  try {
    const events = getDemoAnalyticsEvents()
    const newEvent: DemoAnalyticsEvent = {
      event,
      timestamp: Date.now(),
      data: {
        ...data,
        userAgent: navigator.userAgent.substring(0, 100), // Truncate for storage
        referrer: document.referrer,
        demo: true // Always mark as demo
      }
    }
    
    events.push(newEvent)
    
    // Keep only last 100 events to prevent storage overflow
    const trimmedEvents = events.slice(-100)
    
    localStorage.setItem(DEMO_ANALYTICS_KEY, JSON.stringify(trimmedEvents))
    
    // Also send to monitoring if available (gtag, analytics, etc.)
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', event, { 
          ...data, 
          demo: true,
          event_category: 'demo'
        })
      }
      
      // Google Analytics Universal (legacy)
      if (window.ga) {
        window.ga('send', 'event', 'demo', event, JSON.stringify(data))
      }
      
      // Custom analytics handler
      if (window.customAnalytics) {
        window.customAnalytics.track(event, { ...data, demo: true })
      }
    }
  } catch (error) {
    console.warn('Failed to track demo analytics:', error)
  }
}

/**
 * Get current demo analytics events
 */
export function getDemoAnalyticsEvents(): DemoAnalyticsEvent[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(DEMO_ANALYTICS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed as DemoAnalyticsEvent[] : []
  } catch (error) {
    console.warn('Failed to get demo analytics events:', error)
    return []
  }
}

/**
 * Get demo session statistics
 */
export function getDemoSessionStats(): {
  questionsAnswered: number
  sessionDuration: number
  completionRate: number
  isCompleted: boolean
} {
  const demoData = getDemoDataFromLocalStorage()
  const questionsAnswered = Object.keys(demoData.surveyData).length
  const sessionDuration = Date.now() - demoData.startTime
  
  // Assume 25 total demo questions for completion rate
  const totalQuestions = 25
  const completionRate = questionsAnswered / totalQuestions
  
  return {
    questionsAnswered,
    sessionDuration,
    completionRate,
    isCompleted: demoData.isCompleted
  }
}

/**
 * Check if demo session is fresh (just started)
 */
export function isDemoSessionFresh(): boolean {
  const demoData = getDemoDataFromLocalStorage()
  return (
    demoData.currentPageIndex === 0 && 
    Object.keys(demoData.surveyData).length === 0 &&
    !demoData.isCompleted
  )
}

/**
 * Check if demo session has been abandoned (inactive for too long)
 */
export function isDemoSessionAbandoned(timeoutMinutes: number = 30): boolean {
  const demoData = getDemoDataFromLocalStorage()
  const timeSinceLastUpdate = Date.now() - demoData.lastUpdated
  const timeoutMs = timeoutMinutes * 60 * 1000
  
  return timeSinceLastUpdate > timeoutMs && !demoData.isCompleted
}

/**
 * Get default demo data structure
 */
function getDefaultDemoData(): DemoData {
  return {
    currentPageIndex: 0,
    surveyData: {},
    startTime: Date.now(),
    lastUpdated: Date.now(),
    isCompleted: false,
    version: '1.0'
  }
}

/**
 * Clean up old analytics events to free storage space
 */
function clearOldDemoAnalytics(): void {
  if (typeof window === 'undefined') return

  try {
    const events = getDemoAnalyticsEvents()
    // Keep only last 50 events
    const recentEvents = events.slice(-50)
    localStorage.setItem(DEMO_ANALYTICS_KEY, JSON.stringify(recentEvents))
  } catch {
    // If we can't clean up, just remove all analytics
    try {
      localStorage.removeItem(DEMO_ANALYTICS_KEY)
    } catch {
      // Silently fail if we can't even remove the analytics
    }
  }
}

/**
 * Export demo data for debugging or support
 */
export function exportDemoData(): {
  demoData: DemoData
  analytics: DemoAnalyticsEvent[]
  stats: ReturnType<typeof getDemoSessionStats>
  exportTime: number
} {
  return {
    demoData: getDemoDataFromLocalStorage(),
    analytics: getDemoAnalyticsEvents(),
    stats: getDemoSessionStats(),
    exportTime: Date.now()
  }
}

// Type augmentation for global analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    ga?: (...args: any[]) => void
    customAnalytics?: {
      track: (event: string, data: Record<string, any>) => void
    }
  }
}