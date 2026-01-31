# Vibranic Central

## Overview
A Next.js 16 application with Prisma ORM for PostgreSQL database management. This is the central hub for monitoring all connected applications - receiving diagnostic events and metrics from other apps for centralized monitoring.

## Project Structure
- `app/` - Next.js app router pages and API routes
  - `app/page.tsx` - Main dashboard with stats, charts, and app overview
  - `app/apps/` - Applications list and detail pages
  - `app/events/` - Events log with filtering
  - `app/admin/` - Admin dashboard
  - `app/api/` - API endpoints for receiving data from connected apps
- `components/` - React UI components
  - `components/dashboard/` - Dashboard-specific components (sidebar, stats cards, charts)
  - `components/ui/` - Reusable UI components (shadcn-based)
- `lib/` - Utility libraries
  - `lib/db/queries.ts` - Database query functions
  - `lib/prisma.ts` - Prisma client singleton
- `prisma/` - Database schema and seed files

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
- `App` - Registered applications with API keys
- `DiagnosticEvent` - Event logs from applications (errors, warnings, info)
- `MetricSnapshot` - Performance metrics from applications

## Features
- **Dashboard** - Overview with stats cards, events chart, recent events, and app grid
- **Applications** - List of all connected apps with status indicators (healthy/warning/down)
- **App Detail** - View individual app events, metrics over time, and masked API keys
- **Events Log** - Filterable list of all diagnostic events by severity and app

## Recent Changes
- 2026-01-31: Built dashboard UI
  - Created overview dashboard with stats cards and events chart
  - Built apps list page connected to database
  - Added app detail page with events, metrics visualization, and masked API keys
  - Created events log page with severity and app filtering
  - Updated sidebar navigation with icons
- 2026-01-31: Initial setup for Replit environment
  - Configured Next.js to run on port 5000 with 0.0.0.0 binding
  - Added allowedDevOrigins for Replit proxy compatibility
  - Set up PostgreSQL database with Prisma
