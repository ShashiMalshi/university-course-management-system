# UniCMS — University Course Management System (Full-Stack)

Full-stack **University Course Management System** with role-based SPA for **Admins** and **Students**, including analytics, CSV export, and dark mode.

- **Backend:** Spring Boot 3 (Web, JPA, Validation, H2 for dev, PostgreSQL for production)
- **Frontend:** Vite + React + TypeScript + Tailwind CSS

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Layout](#repository-layout)
- [Environment Setup](#environment-setup)
- [Run Locally](#run-locally)
- [Build & Preview](#build--preview)
- [Functional Overview](#functional-overview)
- [Verify Core Flows (Smoke Test)](#verify-core-flows-smoke-test)
- [Deployment (Render)](#deployment-render)
- [Minimal API Map](#minimal-api-map)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. **Java 17+** and **Maven 3.8+** (Backend)
2. **Node.js 18+** (or 20+) and **npm** (Frontend)
3. Optional: Cloud host for deployment (Render, Vercel, Netlify)

---

## Repository Layout

```text
ucms/
├─ backend/                # Spring Boot API
│  ├─ src/main/java/...    # Entities, Repositories, Controllers
│  ├─ src/main/resources/  # application.yml, etc.
│  └─ README.md            # Backend-specific docs
├─ frontend/               # Vite + React SPA
│  ├─ public/              # Static assets
│  ├─ src/                 # Pages, layouts, shared helpers
│  └─ README.md            # Frontend-specific docs
└─ README.md               # This file
Environment Setup
Backend
Dev (H2): spring.datasource.url=jdbc:h2:mem:ucms;DB_CLOSE_DELAY=-1;MODE=PostgreSQL

Production (PostgreSQL): configure via application-prod.yml or environment variables

Enable H2 console in dev: spring.h2.console.enabled=true

CORS: allow http://localhost:5173 and deployed frontend origin

Frontend
Create .env for local dev and .env.production for deployment:

bash
Copy code
# .env (local)
VITE_API=http://localhost:8080/api/v1

# .env.production
VITE_API=https://ucms-backend.onrender.com/api/v1
Supports light/dark mode toggle globally

Ensure backend CORS includes frontend origin

Run Locally

Backend
bash
Copy code
cd backend
mvn spring-boot:run
Verify API: GET http://localhost:8080/api/v1/courses

Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Open http://localhost:5173

Build & Preview

Backend

bash
Copy code
cd backend
mvn -q -DskipTests package
java -jar target/*.jar

Frontend

bash
Copy code
cd frontend
npm run build
npm run preview

Functional Overview

Admin (/admin/*)

Courses & Students CRUD
View Enrollments
Assign Results/Grades
Results Analytics: KPIs, grade distribution, pass/fail, CSV export

Student (/portal/*)

Browse courses and self-enroll
View My Enrollments with grades
Login Page: Left branding + illustration, Right role-based sign-in card

Results Analytics (Admin)

Filters: course, grade (A–F), student email
KPIs: Average GPA, pass rate, total students, courses covered
Charts: Grade distribution (A–F + N/A), Pass vs Fail
Table: student email, course code/title, credit, grade, updated time, enrollment ID
CSV export for filtered results

Verify Core Flows (Smoke Test)

Login

Open /login, toggle role (Admin/Student)
Admin → /admin, Student → /portal

Admin Console

Create course (unique code, credit 1–6)
Create student
Check enrollments
Assign result to enrollment (A–F)

Student Portal

Browse courses → Enroll
Check My Enrollments; view grades

Results Analytics

Open /admin/results
Apply filters, export CSV

Deployment (Render)

Backend (Docker)

Push repo to GitHub
Render → New → Web Service → Connect repo → Root backend/ → Docker → Service name ucms-backend
Note backend URL: https://ucms-backend.onrender.com
Ensure CORS includes frontend origin

Frontend (Docker)

Render → New → Web Service → Connect repo → Root frontend/ → Docker → Service name ucms-frontend
Build Args:
Name: VITE_API
Value: https://ucms-backend.onrender.com/api/v1
Deploy → Verify /login, /portal, /admin flows, charts, CSV export

Minimal API Map (reference)

Courses
GET /api/v1/courses
POST /api/v1/admin/courses
PUT /api/v1/admin/courses/{id}
DELETE /api/v1/admin/courses/{id}

Students
GET /api/v1/students
POST /api/v1/admin/students
PUT /api/v1/admin/students/{id}
DELETE /api/v1/admin/students/{id}

Enrollments
GET /api/v1/enrollments?studentEmail=
POST /api/v1/enrollments?studentEmail=&courseId=

Results
GET /api/v1/results
POST /api/v1/results?enrollmentId=&grade=

Entities & Constraints

Course: unique code, credit 1–6
Enrollment: unique (studentEmail, course_id)
Result: unique enrollment_id

Pre-Deployment Checklist

Core flows: Login, role toggle, guards, light/dark mode
Admin: Courses & Students CRUD, enrollments, results persist
Student: Browse & enroll, view enrollments
Config & Build: .env.production points to backend, npm run build & preview succeed, SPA fallback configured
Assets: optimized images, charts render correctly
Docs: README updated, .env* not committed

Troubleshooting

Blank styles → check Tailwind config & PostCSS CommonJS export
CORS errors → add frontend origins to backend @CrossOrigin
Deep links 404 → configure SPA fallback (_redirects, vercel.json, or 404.html)
Wrong API base → check .env / .env.production and rebuild
