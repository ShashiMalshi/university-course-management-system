# UniCMS — University Course Management System (Frontend)

Vite + React + TypeScript + Tailwind CSS  
Role-based SPA for **Admins** and **Students** with a modern UI, analytics, CSV export, and dark mode support.

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

- **Split Login**: Image on the left (white background), form on the right (#d9e8ea) with branding and role toggle.  
- **Role-based Routing & Guards**:  
  Admin pages under `/admin/*`, Student portal under `/portal/*` with proper access control.  
- **Admin Console**:
  - Courses & Students **CRUD**
  - View **Enrollments**
  - Assign **Results/Grades**
- **Student Portal**:
  - Browse courses and **self-enroll**
  - View **My Enrollments** with grades
- **Results Analytics**:
  - Filters (course, grade, search by email)
  - KPIs (GPA, pass rate, totals)
  - Charts (grade distribution, pass vs fail)
  - Results table + **CSV export**
- **Responsive, Accessible UI** with keyboard navigation and focus styles.  
- **Light/Dark Mode Ready** styles.

---

## Tech Stack

- **Vite** (React + TypeScript)  
- **Tailwind CSS** (custom palette + component layer)  
- **Recharts** (analytics)  
- **React Router** (nested routes, guards)

---

## Project Structure

```text
frontend/
├─ public/                 
│  ├─ logo.svg             
│  └─ login-hero.jpg       
├─ src/                    
│  ├─ layouts/             
│  │  └─ MainLayout.tsx    
│  ├─ pages/               
│  │  ├─ Login.tsx         
│  │  ├─ Dashboard.tsx     
│  │  ├─ Courses.tsx       
│  │  ├─ Students.tsx      
│  │  ├─ Enrollments.tsx   
│  │  ├─ Results.tsx       
│  │  └─ portal/           
│  │     ├─ StudentDashboard.tsx
│  │     ├─ StudentCourses.tsx
│  │     └─ StudentEnrollments.tsx
│  ├─ shared/              
│  │  ├─ api.ts            
│  │  └─ auth.ts           
│  ├─ App.tsx              
│  ├─ main.tsx             
│  └─ index.css            
├─ index.html              
├─ tailwind.config.ts      
├─ tsconfig.json           
├─ postcss.config.js       
├─ package.json            
├─ package-lock.json       
├─ vite.config.ts          
└─ .env.example            
Environment Setup
Create .env for local dev and .env.production for deployment:

bash
Copy code
# .env (local)
VITE_API=http://localhost:8080/api/v1

# .env.production
VITE_API=https://your-backend-url.onrender.com/api/v1
Ensure your backend CORS allows these frontend origins.

Node.js: Use Node 18+ or 20+.

Run Locally
bash
Copy code
npm install
npm run dev
Open http://localhost:5173 in your browser.

Ensure backend is running and reachable.

Build & Preview
bash
Copy code
npm run build
npm run preview
Routing & Auth
Login writes a lightweight user object to localStorage:

json
Copy code
{ "role": "ADMIN" | "STUDENT", "email": "user@example.com" }
Guards (in App.tsx):

Unauthenticated users → /login

Admin → /admin/*

Student → /portal/*

Root / redirects based on role

API Contract

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
Returns 409 on duplicate (unique constraint (studentEmail, course_id))

Results

GET /results
POST /results?enrollmentId={id}&grade={A..F}

Entities/Constraints:

Course: unique code, credit 1–6

Enrollment: unique (studentEmail, course_id)

Result: unique enrollment_id

Design System & Palette

Tailwind with custom palette (primary neon-blue, secondary rose, accent vivid-sky)
Reusable classes: .btn, .btn-primary, .btn-secondary, .input, .card, .table, .badge-*
Layout helpers: .section-title, .page-header
Light/Dark mode toggle supported globally

Login Page Layout:

Left: white with logo + welcome text + illustration
Right: #d9e8ea with white card for login form, role toggle

Results Analytics (Admin)

Accessible via /admin/results:
Filters: course, grade (A–F), search by student email
KPIs: Average GPA, pass rate, graded count, courses covered
Charts: Grade distribution (A–F + N/A), Pass vs Fail
Table: student email, course (code/title), credit, grade badge, updated time, result id
CSV Export: filtered data (results.csv)

Deployment (SPA)
BrowserRouter used; configure SPA fallback on your host:

Netlify:

Create public/_redirects:

bash
Copy code
/*   /index.html   200

Pre-Deployment Checklist

Core flows: Login matches spec; role toggle works; guards prevent cross-access
Admin: Courses & Students CRUD, enrollments, results persist
Student: Browse & enroll, view enrollments
Config & Build: .env.production points to backend; npm run build & npm run preview succeed; SPA fallback configured
Assets: Optimized (login-hero.jpg ≤ 600 KB)
Docs: README updated; .env* not committed

Troubleshooting

Blank styles → check tailwind.config.ts paths & postcss.config.cjs CommonJS export
CORS errors → add frontend origins to backend @CrossOrigin
Deep links 404 → configure SPA fallback (_redirects, vercel.json, or 404.html)
Wrong API base → check .env / .env.production and rebuild
