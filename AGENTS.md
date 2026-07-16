# CareerBridge - AI Agent Instructions

## Project Overview

CareerBridge is a production-ready full-stack Job Portal platform built using a Monorepo architecture.

Primary user roles:

* Job Seekers
* Employers / Recruiters
* Admins
* Super Admins

---

# Technology Stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS v4
* TanStack Query (React Query)
* React Hook Form
* Zod
* Firebase Authentication

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* MongoDB

---

# Repository Structure

```txt
careerbridge/
├── client/
├── server/
└── shared/
```

Do not introduce additional applications or architectures unless explicitly requested.

---

# Frontend Architecture

Use Next.js App Router.

Use:

```txt
client/app/
```

Do NOT create:

```txt
client/src/
```

Prefer feature-oriented organization.

Example:

```txt
client/
├── app/
├── components/
├── hooks/
├── services/
├── lib/
├── types/
├── constants/
├── data/
└── providers/
```

---

# Backend Architecture

Use feature-based MVC architecture.

Example:

```txt
server/
├── modules/
│
├── auth/
├── users/
├── companies/
├── jobs/
├── applications/
├── resumes/
├── interviews/
├── notifications/
├── analytics/
├── employers/
├── job-seekers/
├── admin/
│
├── middleware/
├── utils/
├── config/
└── types/
```

Keep business logic inside Services.

Controllers should remain thin.

---

# Authentication

Authentication Provider:

* Firebase Authentication

Supported:

* Email/Password Login
* Email/Password Registration
* Google Login

Roles:

```ts
type UserRole =
  | "job_seeker"
  | "employer"
  | "admin"
  | "super_admin";
```

Always enforce role-based access.

Examples:

```txt
/job-seeker/*
/employer/*
/admin/*
```

Unauthorized users must be redirected appropriately.

---

# State Management

## Server State

Use:

* TanStack Query

Required:

* Query keys must be centralized
* Avoid duplicate API requests
* Reuse existing query hooks

## Local State

Use:

```ts
useState
useReducer
```

## Global State

Use Context API only when necessary.

Do not introduce Redux unless explicitly requested.

---

# API Layer Standards

Never call fetch() directly inside page components.

Always use:

```txt
services/
```

Example:

```ts
jobs.service.ts
applications.service.ts
profile.service.ts
```

Page Components
→ Hooks
→ Services
→ API

Follow this pattern consistently.

---

# Forms

Use:

* React Hook Form
* Zod

Requirements:

* Shared validation schemas when possible
* Clear validation messages
* Type-safe form values

---

# Shared Types

Always create reusable TypeScript types.

Prefer:

```txt
shared/types/
```

or

```txt
client/types/
```

Avoid duplicate interface definitions.

---

# UI Component Rules

Always search for existing reusable components first.

Prefer reusing:

* Button
* Input
* Textarea
* Select
* Card
* Badge
* Modal
* Table
* Pagination
* SearchBar
* Avatar
* StatusBadge

Never create duplicate components.

If a reusable component already exists:

* Extend it
* Do not recreate it

---

# Dashboard Component Rules

Dashboard widgets must be reusable.

Design reusable dashboard components for:

* Job Seeker Dashboard
* Employer Dashboard
* Admin Dashboard

Examples:

```txt
DashboardMetricCard
DashboardChartCard
DashboardStatsCard
DashboardSection
DashboardFilterBar
```

Avoid dashboard-specific duplicates.

---

# Profile Module Rules

Profile-related components should be reusable between:

```txt
My Profile
Edit Profile
Public Candidate Profile
Employer Profile
Company Profile
```

Examples:

```txt
ProfileHeader
SkillsSection
ExperienceSection
EducationSection
ResumeSection
SocialLinksSection
```

---

# Styling Rules

Use:

* Tailwind CSS v4

Follow:

* Existing design system
* Existing color palette
* Existing typography
* Existing spacing scale

Requirements:

* Mobile-first
* Tablet support
* Desktop support

Do not introduce new design systems.

---

# Data Fetching Rules

Always provide:

* Loading state
* Error state
* Empty state

Use React Query for all API-based data.

Avoid client-side fetching inside deeply nested components when parent queries can provide data.

---

# Performance Rules

Follow Next.js best practices.

Requirements:

* Use Server Components when possible
* Use Client Components only when necessary
* Lazy-load heavy components
* Minimize re-renders
* Memoize expensive calculations
* Keep query keys stable

---

# Database Rules

Database:

* MongoDB

Requirements:

* Reuse existing collections
* Reuse existing schemas
* Avoid duplicate data models

Example collections:

```txt
users
companies
jobs
applications
resumes
saved_jobs
job_alerts
interviews
notifications
blogs
```

---

# Coding Standards

Always:

* TypeScript first
* Strong typing
* Reusable code
* Clear naming
* Small maintainable files
* Consistent folder structure

Avoid:

* Dead code
* Unused imports
* Any types when avoidable
* Large monolithic components

---

# Before Implementing Any Feature

Always perform:

1. Analyze project structure
2. Analyze existing components
3. Analyze existing hooks
4. Analyze existing services
5. Analyze existing types
6. Analyze existing routes
7. Reuse existing architecture
8. Minimize breaking changes

---

# File Creation Rules

Before creating a new file:

* Check whether an equivalent file already exists
* Reuse or extend existing implementation

Avoid unnecessary file creation.

---

# Implementation Workflow

For every feature:

1. Feature analysis
2. Architecture review
3. File-by-file plan
4. Create files
5. Update files
6. Implement code
7. Verify type safety
8. Verify responsive behavior
9. Verify route protection
10. Verify React Query integration

---

# Output Requirements

When implementing a feature, always provide:

## Files Created

List all new files.

## Files Updated

List all modified files.

## Reused Components

List reused components.

## API Integration

List APIs used or prepared.

## Architectural Decisions

Explain important decisions.

## Testing Checklist

Provide verification steps.

---

# Important Rules

Never:

* Create a src folder
* Change project architecture unnecessarily
* Introduce Redux without approval
* Duplicate reusable components
* Hardcode production API data
* Break existing routes
* Break role-based authentication
* Add unnecessary dependencies

Always prioritize:

* Reusability
* Scalability
* Maintainability
* Performance
* Consistency

```
```
