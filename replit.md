# Vibranic Central

## Overview
A Next.js 16 application with Prisma ORM for PostgreSQL database management. This is a diagnostic events and metrics monitoring dashboard for tracking application health and performance.

## Project Structure
- `app/` - Next.js app router pages and API routes
- `components/` - React UI components
- `lib/` - Utility libraries and Prisma client
- `prisma/` - Database schema and seed files
- `public/` - Static assets

## Tech Stack
- **Framework**: Next.js 16.1.3 with Turbopack
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4, Radix UI, shadcn components
- **Charts**: Recharts

## Commands
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed the database
- `npm run db:studio` - Open Prisma Studio

## Database
PostgreSQL database is configured via the `DATABASE_URL` environment variable. The schema includes:
- `App` - Registered applications
- `DiagnosticEvent` - Event logs from applications
- `MetricSnapshot` - Performance metrics from applications

## Recent Changes
- 2026-01-31: Initial setup for Replit environment
  - Configured Next.js to run on port 5000 with 0.0.0.0 binding
  - Added allowedDevOrigins for Replit proxy compatibility
  - Set up PostgreSQL database with Prisma
