# Architecture Rules

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- Tailwind CSS
- ESLint

## Project Structure
```
├── app/                    # Main application code
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication routes
│   └── [feature]/        # Feature routes
├── lib/                   # Shared utilities
├── prisma/               # Database schema and migrations
└── public/               # Static files
```

## Key Principles
1. Server Components by default
2. Client Components marked with 'use client'
3. API routes in /api directory
4. Authentication via Auth.js
5. Database access through Prisma
6. Styling with Tailwind CSS 