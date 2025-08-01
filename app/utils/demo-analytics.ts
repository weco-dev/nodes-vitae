/**
 * @fileoverview Demo Analytics Utilities
 * 
 * This module provides specialized analytics tracking for the demo assessment.
 * It builds on the base demo storage utilities to provide higher-level analytics
 * functions and demo-specific event tracking.
 * 
 * Key Features:
 * - Demo-specific event tracking with context
 * - User journey analytics (start, progress, completion, abandonment)
 * - Performance tracking (loading times, navigation speed)
 * - Error and issue tracking for demo improvements
 * - Integration with existing monitoring infrastructure
 */

import { trackDemoAnalytics, getDemoDataFromLocalStorage, isDemoSessionFresh } from './demo-storage'

/**
 * Initialize demo analytics when user starts the demo
 */
export function initializeDemoAnalytics(): void {
  const isFirstTime = isDemoSessionFresh()
  
  trackDemoAnalytics('demo_initialized', {
    isFirstTime,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'unknown',
    timestamp: Date.now(),
    referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
    screenResolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown',
    colorDepth: typeof screen !== 'undefined' ? screen.colorDepth : 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown'
  })
  
  // Track if this is a returning user
  if (!isFirstTime) {
    const demoData = getDemoDataFromLocalStorage()
    trackDemoAnalytics('demo_resumed', {
      currentPage: demoData.currentPageIndex,
      questionsAnswered: Object.keys(demoData.surveyData).length,
      sessionAge: Date.now() - demoData.startTime
    })
  }
}

/**
 * Track when user answers a demo question
 */
export function trackDemoQuestionAnswer(
  questionId: string, 
  questionName: string, 
  answer: any,
  metadata?: {
    section?: string
    questionType?: string
    timeSpent?: number
  }
): void {
  trackDemoAnalytics('demo_question_answered', {
    questionId,
    questionName,
    answerType: typeof answer,
    hasValue: answer !== null && answer !== undefined && answer !== '',
    answerLength: typeof answer === 'string' ? answer.length : 0,
    section: metadata?.section,
    questionType: metadata?.questionType,
    timeSpent: metadata?.timeSpent
  })
}

/**
 * Track demo navigation between pages/sections
 */
export function trackDemoNavigation(from: number, to: number, trigger: 'button' | 'direct' | 'auto' = 'button'): void {
  const direction = to > from ? 'forward' : 'backward'
  const distance = Math.abs(to - from)
  
  trackDemoAnalytics('demo_navigation', {
    fromPage: from,
    toPage: to,
    direction,
    distance,
    trigger,
    timestamp: Date.now()
  })
}

/**
 * Track when user abandons the demo (leaves without completing)
 */
export function trackDemoAbandonment(reason: 'timeout' | 'manual' | 'error' | 'unknown' = 'unknown'): void {
  const demoData = getDemoDataFromLocalStorage()
  const sessionDuration = Date.now() - demoData.startTime
  const questionsAnswered = Object.keys(demoData.surveyData).length
  
  trackDemoAnalytics('demo_abandoned', {
    reason,
    sessionDuration,
    questionsAnswered,
    lastPage: demoData.currentPageIndex,
    completionRate: questionsAnswered / 25 // Assuming 25 total questions
  })
}

/**
 * Track demo completion with comprehensive metrics
 */
export function trackDemoCompletion(): void {
  const demoData = getDemoDataFromLocalStorage()
  const sessionDuration = Date.now() - demoData.startTime
  const questionsAnswered = Object.keys(demoData.surveyData).length
  
  trackDemoAnalytics('demo_completed', {
    sessionDuration,
    questionsAnswered,
    totalPages: demoData.currentPageIndex + 1,
    completionRate: 1.0,
    averageTimePerQuestion: sessionDuration / Math.max(questionsAnswered, 1),
    startTime: demoData.startTime,
    endTime: Date.now()
  })
}

/**
 * Track demo loading performance
 */
export function trackDemoLoadingPerformance(
  component: string,
  loadTime: number,
  success: boolean = true
): void {
  trackDemoAnalytics('demo_performance', {
    component,
    loadTime,
    success,
    timestamp: Date.now()
  })
}

/**
 * Track demo errors for debugging and improvement
 */
export function trackDemoError(
  error: Error | string,
  context: {
    component?: string
    action?: string
    fatal?: boolean
    data?: Record<string, any>
  } = {}
): void {
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack : undefined
  
  trackDemoAnalytics('demo_error', {
    error: errorMessage,
    stack: errorStack?.substring(0, 500), // Truncate stack trace
    component: context.component,
    action: context.action,
    fatal: context.fatal ?? false,
    data: context.data,
    timestamp: Date.now()
  })
}

/**
 * Track user interactions with demo UI elements
 */
export function trackDemoInteraction(
  element: string,
  action: 'click' | 'hover' | 'focus' | 'scroll',
  metadata?: Record<string, any>
): void {
  trackDemoAnalytics('demo_interaction', {
    element,
    action,
    ...metadata,
    timestamp: Date.now()
  })
}

/**
 * Track demo help system usage
 */
export function trackDemoHelpUsage(
  questionId: string,
  helpType: 'help' | 'reporting' | 'docs',
  action: 'open' | 'close' | 'expand'
): void {
  trackDemoAnalytics('demo_help_usage', {
    questionId,
    helpType,
    action,
    timestamp: Date.now()
  })
}

/**
 * Track conversion events (demo to signup)
 */
export function trackDemoConversion(
  conversionType: 'signup_clicked' | 'contact_clicked' | 'learn_more_clicked' | 'restart_clicked' | 'demo_clicked',
  location: 'completion' | 'header' | 'inline' | 'footer' | 'hero' | 'section' = 'completion'
): void {
  const demoData = getDemoDataFromLocalStorage()
  
  trackDemoAnalytics('demo_conversion', {
    conversionType,
    location,
    questionsAnswered: Object.keys(demoData.surveyData).length,
    isCompleted: demoData.isCompleted,
    sessionDuration: Date.now() - demoData.startTime,
    timestamp: Date.now()
  })
}

/**
 * Track demo feedback (if feedback mechanism is added later)
 */
export function trackDemoFeedback(
  rating: number,
  feedback?: string,
  category?: 'usability' | 'content' | 'technical' | 'general'
): void {
  trackDemoAnalytics('demo_feedback', {
    rating,
    feedback: feedback?.substring(0, 500), // Truncate feedback
    category,
    timestamp: Date.now()
  })
}

/**
 * Track demo session timeout/expiry
 */
export function trackDemoTimeout(timeoutMinutes: number): void {
  const demoData = getDemoDataFromLocalStorage()
  
  trackDemoAnalytics('demo_timeout', {
    timeoutMinutes,
    questionsAnswered: Object.keys(demoData.surveyData).length,
    lastActivity: demoData.lastUpdated,
    sessionDuration: Date.now() - demoData.startTime
  })
}

/**
 * Track when demo data is cleared/reset
 */
export function trackDemoReset(reason: 'user_action' | 'auto_cleanup' | 'error' = 'user_action'): void {
  const demoData = getDemoDataFromLocalStorage()
  
  trackDemoAnalytics('demo_reset', {
    reason,
    questionsAnswered: Object.keys(demoData.surveyData).length,
    wasCompleted: demoData.isCompleted,
    sessionDuration: Date.now() - demoData.startTime
  })
}

/**
 * Track browser/device compatibility issues
 */
export function trackDemoCompatibility(
  issue: 'localStorage_unavailable' | 'quota_exceeded' | 'feature_unsupported' | 'performance_issue',
  details?: Record<string, any>
): void {
  trackDemoAnalytics('demo_compatibility', {
    issue,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 100) : 'unknown',
    ...details,
    timestamp: Date.now()
  })
}

/**
 * Track survey component specific events
 */
export function trackDemoSurveyEvent(
  event: 'survey_loaded' | 'survey_error' | 'question_validation_error' | 'page_changed',
  data?: Record<string, any>
): void {
  trackDemoAnalytics('demo_survey_event', {
    event,
    ...data,
    timestamp: Date.now()
  })
}

/**
 * Batch track multiple events (useful for bulk operations)
 */
export function trackDemoBatchEvents(events: Array<{
  event: string
  data?: Record<string, any>
}>): void {
  events.forEach(({ event, data }) => {
    trackDemoAnalytics(event, data)
  })
}

/**
 * Get analytics summary for current demo session
 */
export function getDemoAnalyticsSummary(): {
  sessionDuration: number
  questionsAnswered: number
  pagesVisited: number
  errorsEncountered: number
  helpUsageCount: number
  isCompleted: boolean
} {
  const demoData = getDemoDataFromLocalStorage()
  
  return {
    sessionDuration: Date.now() - demoData.startTime,
    questionsAnswered: Object.keys(demoData.surveyData).length,
    pagesVisited: demoData.currentPageIndex + 1,
    errorsEncountered: 0, // Would need to track this in analytics events
    helpUsageCount: 0, // Would need to track this in analytics events
    isCompleted: demoData.isCompleted
  }
}