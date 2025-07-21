/**
 * @fileoverview Progress - Reusable progress bar component for visual progress indication
 * 
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 * 
 * A flexible progress bar component that provides visual feedback for completion
 * status, loading states, and step-by-step processes. Built with accessibility
 * in mind and styled with Tailwind CSS for consistent design integration.
 * 
 * KEY FEATURES:
 * 1. Percentage-based progress indication (0-100)
 * 2. Smooth CSS transitions for animated progress updates
 * 3. Accessible HTML structure with proper semantics
 * 4. Customizable styling through className prop
 * 5. ForwardRef implementation for advanced use cases
 * 
 * STYLING APPROACH:
 * - Rounded design with primary color fill
 * - Secondary background for unfilled portion
 * - CSS transform animations for smooth progression
 * - Responsive height and width configurations
 * 
 * @version 1.0.0
 * @author Vitae Development Team
 * @since 1.0.0
 * @requires react
 * @requires #app/utils/misc.tsx
 * 
 * @example
 * ```tsx
 * // Basic usage with 60% completion
 * <Progress value={60} />
 * 
 * // Custom styling
 * <Progress value={75} className="h-4 w-full" />
 * 
 * // Assessment progress tracking
 * <Progress value={(currentQuestion / totalQuestions) * 100} />
 * ```
 * 
 * @see {@link app/components/assessment/section-display.tsx} for usage context
 */

import * as React from "react"
import { cn } from "#app/utils/misc.tsx"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
  }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }