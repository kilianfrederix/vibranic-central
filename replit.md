# Vibranic Central

## Overview
A Next.js 16 application with Prisma ORM for PostgreSQL database management. This is the central hub for monitoring all connected applications - receiving diagnostic events and metrics from other apps for centralized monitoring.

## Project Structure
- `app/` - Next.js app router pages and API routes
  - `app/page.tsx` - Main dashboard with stats, charts, and app overview
  - `app/apps/` - Applications list and detail pages
  - `app/events/` - Events log with filtering
  - `app/admin/` - Admin dashboard for app management
  - `app/api/` - API endpoints for receiving data from connected apps
    - `app/api/diagnostics/` - External endpoints for events and metrics (requires app API key)
    - `app/api/apps/` - External admin endpoints (requires ADMIN_API_KEY)
    - `app/api/admin/` - Internal dashboard endpoints
- `components/` - React UI components
  - `components/dashboard/` - Dashboard-specific components (sidebar, stats cards, charts)
  - `components/ui/` - Reusable UI components (shadcn-based)
- `lib/` - Utility libraries
  - `lib/db/queries.ts` - Database query functions
  - `lib/prisma.ts` - Prisma client singleton
  - `lib/admin-auth.ts` - Admin API key validation
  - `lib/vibranic-sdk.ts` - SDK for external apps to connect to hub
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
- `User` - Authenticated users from Replit Auth
- `Session` - User sessions with 1-week TTL

## Authentication
User authentication uses Replit Auth via OpenID Connect (OIDC):
- `lib/auth.ts` - OIDC client setup and session management
- `app/api/login/route.ts` - Initiates OAuth2 PKCE flow
- `app/api/callback/route.ts` - Handles OAuth callback with state validation
- `app/api/logout/route.ts` - Clears session
- `app/api/auth/user/route.ts` - Returns current user info
- `hooks/use-auth.ts` - React hook for auth state
- `components/auth-provider.tsx` - Context provider for auth state
- `components/protected-route.tsx` - HOC for protecting routes

## API Endpoints

### External API (for connected apps)
These endpoints require authentication via headers:
- `POST /api/diagnostics/events` - Send diagnostic events (x-api-key header)
- `POST /api/diagnostics/metrics` - Send metrics (x-api-key header)
- `POST /api/apps` - Register a new app (x-admin-key header)
- `GET /api/apps` - List all apps (x-admin-key header)
- `GET/PATCH/DELETE /api/apps/[id]` - Manage app (x-admin-key header)
- `POST /api/apps/[id]/regenerate-key` - Get new API key (x-admin-key header)

### Internal API (for dashboard)
- `GET/POST /api/admin/apps` - List/create apps
- `GET/PATCH/DELETE /api/admin/apps/[id]` - Manage app
- `POST /api/admin/apps/[id]/regenerate-key` - Regenerate API key

## Features
- **Dashboard** - Overview with stats cards, events chart, recent events, and app grid
- **Applications** - List of all connected apps with status indicators (healthy/warning/down)
- **App Detail** - View individual app events, metrics over time, and masked API keys
- **Events Log** - Filterable list of all diagnostic events by severity and app
- **Admin Dashboard** - Register new apps, edit/delete apps, view/regenerate API keys

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_API_KEY` - Secret key for external admin API access

## Recent Changes
- 2026-01-31: Added real-time updates, time range filters, uptime tracking, CSV export, and alerts
  - Dashboard auto-refreshes every 30 seconds with last updated time
  - Time range filters on dashboard and events (1h, 24h, 7d, 30d)
  - Uptime tracking records app health status when events are received
  - CSV export for events and metrics with time range filtering
  - Alerts page to configure notifications for critical events
  - Alert triggers automatically recorded when high-severity events occur
- 2026-01-31: Added dark mode support
  - Toggle button in header to switch themes
  - Respects system preference by default
  - Uses next-themes for persistence
- 2026-01-31: Added global search functionality
  - Search apps by name and description
  - Search events by message and category
  - Dropdown results with navigation to apps/events
- 2026-01-31: Added user authentication with Replit Auth
  - Implemented OAuth2 PKCE flow with OIDC
  - Created User and Session tables in PostgreSQL
  - Added login/callback/logout API routes with state validation
  - Built AuthProvider and useAuth hook for React components
  - Added UserMenu component to header with profile and sign out
  - ProtectedRoute component available for securing pages
- 2026-01-31: Added admin dashboard for app management
  - Created app management UI with add/edit/delete functionality
  - Added API key viewing (masked by default) with copy and regenerate
  - Built dialog components for modals
  - Created internal admin API endpoints
- 2026-01-31: Created API endpoints for external apps
  - POST /api/diagnostics/events for sending diagnostic events
  - POST /api/diagnostics/metrics for sending metrics
  - Admin endpoints with ADMIN_API_KEY authentication
  - SDK file for easy integration (lib/vibranic-sdk.ts)
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
