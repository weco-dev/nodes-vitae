# React Router v7 Performance Issues Research Report

## Problem Summary

Investigation of performance issues in a React Router v7 application migrated from Remix v2, specifically:

- Navigation elements (dots, button, select) interacting with SurveyJS component are very slow
- "Unable to decode turbo-stream response remix" errors
- Initial /assessment/take GET requests sometimes take 2 minutes, sometimes 0.5 seconds
- Inconsistent performance with no apparent pattern
- Application was fast with previous Remix V2 setup

## Main Issues Identified

### 1. React Router v7 Development Performance Problems
- **Known issue**: "unacceptably slow" performance in large projects (30-40s page renders)
- ESBuild consuming 60% CPU during development
- root.tsx loads all JavaScript route files, causing slow navigation
- Performance particularly problematic for large applications in development environments

### 2. "Unable to decode turbo-stream response" Error
Common in React Router v7/Remix applications, caused by:
- Middleware response incompatibilities with turbo-stream format
- Redirect issues when preserving headers through actions
- Empty data structures (Map/Set objects) that can't be serialized
- Web Application Firewalls rejecting requests
- Improper response formatting for turbo-stream compatibility

### 3. Inconsistent GET Request Performance
- React Router v7 has documented performance bottlenecks
- Some developers report breaking out of framework conventions for complex SPAs
- Navigation timing changes in v7 where URL changes before route rendering completes
- Can cause exceptions when mandatory query parameters go missing during transitions

### 4. SurveyJS Performance Issues
SurveyJS itself contributes to performance problems:
- Very slow with relatively large JSON models
- Memory usage spikes to 4.5GB with large datasets (~23,000 records, ~32 questions)
- 5+ second freezes when selecting multiple choice options
- Performance issues particularly severe in question-per-page mode
- Initial startup can be very slow with complex visibility logic

## Migration Context

React Router v7 represents a significant architectural shift from Remix v2:
- React Router v7 is essentially Remix v3 with a new name
- Migration should be straightforward if all Remix v2 future flags were enabled
- Most shared APIs have been collapsed into react-router package
- No breaking changes if future flags were properly adopted

## Solutions & Recommendations

### Immediate Actions
1. **Upgrade to React Router v7.5+** - Includes faster, more granular lazy loading optimizations
2. **Implement performance monitoring** using OpenTelemetry/Sentry to identify specific bottlenecks
3. **Use lazy loading with React.Suspense** for heavy components to show loading states
4. **Optimize SurveyJS configuration**:
   - Reduce JSON model size where possible
   - Avoid question-per-page mode if not necessary
   - Minimize complex visibility logic

### Architectural Considerations
1. **Consider hybrid data fetching approaches**:
   - Use loaders for global data
   - Implement alternative solutions (TRPC, direct fetch) for component-specific data
   - Prioritize user experience over framework purity
2. **Implement proper error handling** for turbo-stream compatibility
3. **Review middleware responses** to ensure they're properly formatted for turbo-stream

### Debugging Steps
1. Use browser performance tools to analyze script execution
2. Monitor network requests to identify slow endpoints
3. Implement observability for loader and action functions
4. Consider temporary fallback to simpler routing patterns for critical paths

## Development Environment Optimization

Given the documented development performance issues:
- Consider using production builds for performance testing
- Implement development-specific optimizations
- Monitor CPU usage during development builds
- Consider breaking large applications into smaller modules

## Conclusion

The performance issues appear to be a combination of:
1. Known React Router v7 development performance problems
2. SurveyJS's inherent performance limitations with complex surveys
3. Turbo-stream compatibility issues in the new architecture

The compound effect of these issues likely explains the inconsistent and poor performance experienced after migration from the previously fast Remix v2 setup.