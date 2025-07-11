# Epic Stack Core Guidelines

## Overview

The Epic Stack is a comprehensive Remix-based web application framework designed
to provide solid opinions for teams to hit the ground running on their web
applications. This document serves as the core guideline for developing with the
Epic Stack.

## Guiding Principles

The Epic Stack is built around six core principles that should guide all
development decisions:

### 1. Limit Services

- Build, deploy, and maintain services ourselves when reasonably possible
- Run services within the app instance when feasible
- This approach saves costs and reduces complexity

### 2. Include Only Most Common Use Cases

- Focus on the most frequent scenarios rather than edge cases
- The starter app is not documentation - use docs for examples and edge cases
- Expect some code deletion as part of the customization process

### 3. Minimize Setup Friction

- Keep time-to-production as small as possible
- Defer service signup until services are actually required
- Fit within free tiers during exploration phase while targeting scalable paid
  solutions

### 4. Optimize for Adaptability

- Ensure teams can switch between third-party and custom-built services
- Maintain flexibility for changing product requirements
- Balance simplicity with adaptability

### 5. Only One Way

- Provide a single recommended approach for each task
- Applies to both pre-configured code and documentation
- Reduces decision fatigue and maintains consistency

### 6. Offline Development

- Enable offline development as much as possible
- Provide mocking capabilities for external services
- Maintain productivity without internet connectivity

## Core Technology Stack

### Web Framework

- **Remix** - Primary web framework
- **React** - UI library with built-in XSS protection
- **TypeScript** - Static typing throughout the application
- **Vite** - Build tool and development server

### Database & Storage

- **SQLite** with **LiteFS** - Multi-region distributed database
- **Prisma** - Database ORM and migration management
- **Tigris** - Image storage and serving

### Authentication & Security

- **Multi-factor authentication** supporting:
  - Username/password with bcrypt hashing
  - OAuth providers (GitHub included, extensible via remix-auth)
  - Passkey authentication using WebAuthn
  - TOTP-based two-factor authentication
- **Security measures**:
  - Content Security Policy (CSP) - strict by default, report-only initially
  - CSRF protection via remix-utils
  - Honeypot fields for bot protection
  - Rate limiting with express-rate-limit
  - Role-based permissions (RBAC)

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Light/Dark/System mode** - Theme switching without flash

### Testing & Quality

- **Playwright** - End-to-end testing
- **Vitest** - Unit testing with DOM assertions via @testing-library/jest-dom
- **MSW** - API mocking for tests and development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Forms & Validation

- **Conform** - Progressively enhanced, type-safe forms
- **Zod** - Runtime schema validation

### Caching & Performance

- **cachified** - Caching layer with in-memory and SQLite backends
- **better-sqlite3** - High-performance SQLite driver

### Deployment & Infrastructure

- **Fly.io** - Primary deployment platform with Docker
- **GitHub Actions** - CI/CD for testing and deployment
- **LiteFS** - Database replication across regions
- **Grafana** - Application monitoring via Fly Metrics

### Email & Communication

- **Resend** - Transactional email service
- **Toast notifications** - User feedback system

### Error Monitoring

- **Sentry** - Error tracking and monitoring

## Getting Started

### Initial Setup

```bash
npx epicli new <project-name>
cd <project-name>
npm run setup
npm run dev
```

### Environment Variables

- Copy `.env.example` to `.env` for local development
- Set production secrets using `fly secrets` command
- Use mock services during development when possible

### Default Credentials

- Username: `kody`
- Password: `kodylovesyou`

## Development Workflow

### Database Management

- **Migrations**: Run automatically on deploy via Prisma
- **Primary instance**: Determined by Fly's consul service
- **Local development**: Uses SQLite with automated seeding
- **Production access**: Use `fly ssh console -C database-cli`

### Testing Strategy

- **Unit tests**: Vitest for utilities and components
- **E2E tests**: Playwright with authentication fixtures
- **Mocking**: MSW for external service simulation
- **Type checking**: `npm run typecheck`

### Code Quality

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Type checking**: `npm run typecheck`

## Security Best Practices

### Authentication Flow

1. Email verification with code/link
2. Username and password setup
3. Optional 2FA configuration
4. Multiple authentication methods supported

### Data Protection

- Password hashing with bcrypt
- Session-based authentication with secure cookies
- CSRF token validation on forms
- Honeypot fields for bot protection
- Rate limiting on API endpoints

### Database Security

- Role-based access control (admin/user roles)
- Prepared statements via Prisma
- Secure backup procedures with encryption

## Deployment Guidelines

### Multi-Region Setup

- Configure primary region in `fly.toml`
- Deploy minimum 2 instances in primary region for zero-downtime
- Scale to additional regions: `fly scale count 2 --region sjc`

### Migration Strategy

Follow "widen then narrow" approach:

1. Widen app to consume A or B
2. Widen database to provide A and B, app writes to both
3. Narrow app to consume only B
4. Narrow database to provide only B

### Backup Procedures

- Manual backups: `litefs export -name sqlite.db /backups/backup-date.db`
- Secure storage required (contains user data and password hashes)
- Restoration: `litefs import -name sqlite.db /backup-file.db`

## File Organization

### Key Directories

- `/app` - Application code (routes, components, utilities)
- `/tests` - End-to-end tests
- `/prisma` - Database schema and migrations
- `/other` - Configuration files (LiteFS, deployment)
- `/public` - Static assets

### Naming Conventions

- Use TypeScript throughout
- Follow existing patterns in the codebase
- Prefer explicit imports over barrel exports
- Use kebab-case for file names
- Use PascalCase for component names

## Performance Considerations

### Caching Strategy

- In-memory caching for frequently accessed data
- SQLite-based caching for persistent data
- HTTP caching headers for static assets
- CDN integration for global asset delivery

### Database Optimization

- Connection pooling via Prisma
- Query optimization with proper indexing
- Read replica usage for non-primary instances
- Regular performance monitoring

## Common Patterns

### Form Handling

```typescript
// Use Conform for type-safe forms
import { conform, useForm } from '@conform-to/react'
import { getFormProps, getInputProps } from '@conform-to/react'
```

### Authentication Checks

```typescript
// Require authentication in routes
export async function loader({ request }: LoaderFunctionArgs) {
	await requireUserId(request)
	// Protected route logic
}
```

### Error Handling

```typescript
// Use error boundaries and proper error types
export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
```

## Troubleshooting

### Common Issues

- **Migration failures**: Follow database restoration procedures
- **Build errors**: Check TypeScript and linting issues
- **Deployment problems**: Verify environment variables and secrets
- **Performance issues**: Review caching strategy and database queries

### Debug Tools

- Fly.io logs: `fly logs`
- Database access: `fly ssh console -C database-cli`
- Prisma Studio: `npx prisma studio` (with port forwarding)
- Error monitoring: Sentry dashboard

## Support Resources

- Epic Stack Documentation: Complete reference materials
- GitHub Issues: Community support and bug reports
- Discord Community: Real-time help and discussions
- Epic Web: Advanced training and workshops

## Version Management

### Updates

- Monitor Epic Stack releases for security updates
- Test updates in staging environment first
- Follow semantic versioning for dependency updates
- Maintain backward compatibility when possible

### Migration Path

- Use example implementations for new features
- Gradually adopt new patterns and recommendations
- Maintain documentation for custom modifications
- Regular dependency audits and updates
