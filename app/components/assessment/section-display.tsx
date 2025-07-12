/**
 * @fileoverview SectionDisplay - Progress tracking component for ESG assessment navigation
 * 
 * ==================================================================================
 * COMPONENT OVERVIEW
 * ==================================================================================
 * 
 * This component provides visual progress tracking and section identification during
 * ESG (Environmental, Social, Governance) assessment completion. It displays the
 * current section being evaluated and numerical progress through the assessment.
 * 
 * KEY FEATURES:
 * 1. Real-time section identification (Environmental, Social, Governance)
 * 2. Numerical progress indicator (current question / total questions)
 * 3. Clean, consistent visual design with muted backgrounds
 * 4. Responsive layout with flexbox positioning
 * 5. Semantic text hierarchy for accessibility
 * 
 * ==================================================================================
 * INTEGRATION PATTERNS
 * ==================================================================================
 * 
 * USAGE IN ASSESSMENT FLOW:
 * Parent Route (take.tsx) → Track current page/section → Update SectionDisplay →
 * Visual feedback to user → Enhanced UX during assessment completion
 * 
 * DATA FLOW:
 * - section: Derived from current question's section metadata
 * - currentQuestion: Page index + 1 for human-readable numbering
 * - totalQuestions: Static count from assessment questions array
 * 
 * RESPONSIVE BEHAVIOR:
 * - Flexible layout adapts to different screen sizes
 * - Text sizing maintains readability across devices
 * - Spacing adjusts for mobile and desktop viewing
 * 
 * ==================================================================================
 * DESIGN SYSTEM INTEGRATION
 * ==================================================================================
 * 
 * STYLING APPROACH:
 * - Uses Tailwind CSS utility classes for consistent design
 * - Follows application's color palette (muted backgrounds, muted foreground text)
 * - Maintains spacing consistency with other assessment components
 * - Rounded corners align with application's design language
 * 
 * ACCESSIBILITY CONSIDERATIONS:
 * - Clear text hierarchy with size variations
 * - Sufficient color contrast for readability
 * - Semantic HTML structure for screen readers
 * - Descriptive labels for progress information
 * 
 * @version 1.0.0
 * @author ESG Assessment Team
 * @since 2025-07-11
 * @requires react
 * 
 * @example
 * ```tsx
 * // Usage in assessment route
 * <SectionDisplay
 *   section="Environmental"
 *   currentQuestion={5}
 *   totalQuestions={24}
 * />
 * 
 * // Results in display showing:
 * // Current Section: Environmental
 * // Progress: 5 / 24
 * ```
 * 
 * @see {@link app/routes/assessment+/take.tsx} for implementation context
 */

interface SectionDisplayProps {
  section: string
  currentQuestion: number
  totalQuestions: number
}

export function SectionDisplay({
  section,
  currentQuestion,
  totalQuestions
}: SectionDisplayProps) {
  return (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Section</p>
          <h3 className="text-lg font-semibold">{section}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Question</p>
          <p className="text-lg font-semibold">
            {currentQuestion} / {totalQuestions}
          </p>
        </div>
      </div>
    </div>
  )
}