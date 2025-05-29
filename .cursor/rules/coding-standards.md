# Coding Standards

## Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- API Routes: kebab-case (`user-profile/route.ts`)
- Types: PascalCase with T prefix (`TUser`)
- Constants: UPPER_SNAKE_CASE

## Components
- Use Server Components by default
- Mark Client Components with 'use client'
- Split into presentational and container components
- Use Tailwind for styling
- Keep components small and focused
- Use TypeScript interfaces for props

## API
- REST API in `/api` directory
- Use Route Handlers
- Validate with Zod
- Error handling with try/catch
- Return proper HTTP status codes
- Use TypeScript for request/response types

## Database
- Use Prisma as ORM
- Keep migrations in `/prisma/migrations`
- Use typed queries
- Use transactions for complex operations
- Follow naming conventions in schema 