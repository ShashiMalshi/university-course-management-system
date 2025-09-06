# UniCMS — University Course Management System (Frontend)

Vite + React + TypeScript + Tailwind CSS  
Role-based SPA for **Admins** and **Students** with a modern UI, analytics, and CSV export.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Run Locally](#run-locally)
- [Build & Preview](#build--preview)
- [Routing & Auth](#routing--auth)
- [API Contract](#api-contract)
- [Design System & Palette](#design-system--palette)
- [Results Analytics (Admin)](#results-analytics-admin)
- [Deployment (SPA)](#deployment-spa)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Troubleshooting](#troubleshooting)


---

## Features

- **Split Login**: Image on the left (white background), form on the right (**#d9e8ea**), with branding and role toggle.
- **Role-based Routing & Guards**:  
  Admin pages under `/admin/*`, Student portal under `/portal/*` with proper access control.
- **Admin Console**:
  - Courses & Students **CRUD**
  - View **Enrollments**
  - Assign **Results/Grades**
- **Student Portal**:
  - Browse courses and **self-enroll**
  - See **My Enrollments** with grades
- **Results Analytics**:
  - Filters (course, grade, search by email)
  - KPIs (GPA, pass rate, totals)
  - Charts (grade distribution, pass vs fail)
  - Results table + **CSV export**
- **Responsive, Accessible UI** with keyboard navigation and focus styles.
- **Light/Dark Ready** styles.

---

## Tech Stack

- **Vite** (React + TypeScript)
- **Tailwind CSS** (custom palette + component layer)
- **Recharts** (analytics)
- **React Router** (nested routes, guards)

---

## Project Structure

frontend/
├─ public/                 # Static assets served directly
│  ├─ logo.svg             # Project logo
│  └─ login-hero.jpg       # Hero image for login page
├─ src/                    # Source code
│  ├─ layouts/             # Layout components
│  │  └─ MainLayout.tsx    # Main layout wrapper for pages
│  ├─ pages/               # Application pages
│  │  ├─ Login.tsx         # Login page
│  │  ├─ Dashboard.tsx     # Admin dashboard
│  │  ├─ Courses.tsx       # Admin courses management
│  │  ├─ Students.tsx      # Admin student management
│  │  ├─ Enrollments.tsx   # Admin enrollment management
│  │  ├─ Results.tsx       # Admin analytics/results
│  │  └─ portal/           # Student portal pages
│  │     ├─ StudentDashboard.tsx
│  │     ├─ StudentCourses.tsx
│  │     └─ StudentEnrollments.tsx
│  ├─ shared/              # Shared utilities
│  │  ├─ api.ts            # API helpers (getJSON/postJSON)
│  │  └─ auth.ts           # LocalStorage-based auth helpers
│  ├─ App.tsx              # Nested routes and guards
│  ├─ main.tsx             # App entry point
│  └─ index.css            # Tailwind + global styles
├─ index.html              # HTML template
├─ tailwind.config.ts      # Tailwind CSS configuration
├─ tsconfig.json           # TypeScript configuration
├─ postcss.config.js       # PostCSS configuration
├─ package.json            # NPM dependencies and scripts
├─ package-lock.json       # Locked package versions
├─ vite.config.ts          # Vite configuration
└─ .env.example            # Sample environment variables


## Environment Setup

Create `.env` for local dev and `.env.production` for deployment:

```bash
# .env (local)
VITE_API=http://localhost:8080/api/v1

# .env.production (example)
VITE_API=https://api.your-domain.com/api/v1

The app reads import.meta.env.VITE_API. Make sure your backend CORS allows your frontend origins (localhost and your prod URL).

Node.js: Use Node 18+ (or 20+).

Run Locally

npm install
npm run dev

Open http://localhost:5173

Ensure your backend is running and reachable from the browser.

Routing & Auth

Login writes a lightweight user object to localStorage:

{ "role": "ADMIN" | "STUDENT", "email": "user@example.com" }


Guards (in App.tsx):

Unauthenticated users are redirected to /login.

Admins can access /admin/*; Students can access /portal/*.

Root / redirects to /admin or /portal based on role.

API Contract

The frontend expects these endpoints:

Courses

GET /courses
POST /admin/courses
PUT /admin/courses/{id}
DELETE /admin/courses/{id}

Students

GET /students
POST /admin/students
PUT /admin/students/{id}
DELETE /admin/students/{id}

Enrollments

GET /enrollments
POST /enrollments?studentEmail={email}&courseId={id}
Returns 409 on duplicate (unique (studentEmail, course_id)).

Results
GET /results
POST /results?enrollmentId={id}&grade={A..F}

Entities/Constraints (expected)
Course: unique code, credit 1–6
Enrollment: unique (studentEmail, course_id)
Result: unique enrollment_id

Design System & Palette

Tailwind with a custom palette (primary neon-blue, secondary rose, accent vivid-sky).
Reusable classes in src/index.css:

Buttons: .btn, .btn-primary, .btn-secondary, .btn-accent, .btn-ghost
Inputs/Card/Table/Badges: .input, .card, .table, .badge-*
Layout helpers: .section-title, .page-header

Login Page

Left: white background with logo + “UniCMS / University Course Management / Welcome back!” (palette tinted), illustration placed near the bottom.
Right: background #d9e8ea with a white form card and role toggle (Student → primary, Admin → secondary).

Results Analytics (Admin)

Accessible via /admin/results:

Filters: course, grade (A–F), search by student email
KPIs: Average GPA (4.0, weighted if credit is provided), pass rate, graded count, courses covered
Charts: Grade distribution (A–F + N/A), Pass vs Fail
Table: student email, course (code/title), credit, grade badge, updated time, result id
Export: filtered CSV (results.csv)

Deployment (SPA)

This app uses BrowserRouter; configure history fallback on your host:

Netlify

Create public/_redirects:

/*   /index.html   200

Pre-Deployment Checklist

Core flows

 Login page matches spec (left white with copy + bottom image; right #d9e8ea with white card).
 Role toggle works; Student → /portal, Admin → /admin.
 Guards prevent cross-access (Admin vs Student) and redirect unauthenticated users to /login.

Admin

 Courses & Students CRUD works.
 Enrollments list displays correctly.
 Results assignment persists and appears in analytics/table.

Student

 Browse courses and self-enroll (no duplicate enrollment).
 My Enrollments displays courses and grades.

Config & Build

 VITE_API points to production in .env.production.
 CORS includes your deployed frontend origin.
 npm run build and npm run preview succeed.
 SPA fallback configured for your host.
 Assets optimized (e.g., login-hero.jpg ideally ≤ 600 KB).

Docs & Repo

 README updated; .env* are not committed.

Troubleshooting

Blank styles / unstyled UI:
Ensure tailwind.config.ts content matches paths and postcss.config.cjs uses CommonJS (module.exports = { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } }).

CORS errors:
Add your frontend origins to @CrossOrigin in Spring Boot (http://localhost:5173 and your production URL).

Deep links 404 in production:
Missing SPA fallback — add _redirects (Netlify), vercel.json (Vercel), or 404.html (GitHub Pages).

Wrong API base:
Set VITE_API in .env / .env.production and rebuild.
