# UCMS Starter (Spring Boot + React)

Full-stack **University Course Management System** starter:
- **Backend:** Spring Boot 3 (Web, JPA, Validation, H2 for dev; Security open for MVP)
- **Frontend:** Vite + React + TypeScript + Tailwind (modern, responsive UI)

---

## 1) Prerequisites

1. **Java 17+** and **Maven 3.8+**
2. **Node.js 18+** (or 20+) and **npm**
3. (Optional) A cloud host for deployment (e.g., Vercel/Netlify for frontend, Render/Railway for backend)

---

## 2) Repository Layout

ucms/
├─ backend/ # Spring Boot API
│ ├─ src/main/java/... # Entities, Repos, Controller
│ ├─ src/main/resources/ # application.yml, etc.
│ └─ README.md # Backend-specific docs
├─ frontend/ # Vite + React app
│ ├─ public/ # logo.svg, login-hero.jpg, SPA rewrites
│ ├─ src/ # pages, layouts, shared helpers
│ └─ README.md # Frontend-specific docs
└─ README.md # (this file)

## 3) Quickstart (Local Development)

### 3.1 Backend

1. Open a terminal and run:
   ```bash
   cd backend
   mvn spring-boot:run

2. Verify API is running:

GET http://localhost:8080/api/v1/courses

3.2 Frontend

1. Open a second terminal and run:

cd frontend
npm install
npm run dev

2. Open the app:

http://localhost:5173

4) Environment Configuration

4.1 Frontend

   1. Create frontend/.env for local dev:

      VITE_API=http://localhost:8080/api/v1


   2. (Production) Create frontend/.env.production with your public API URL:

      VITE_API=https://api.your-domain.com/api/v1


   3. Ensure CORS on the backend allows:

      http://localhost:5173 (dev)

      your deployed frontend origin (production)

4.2 Backend (optional overrides in application.yml)

Typical dev settings:

server.port=8080
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update

Add your frontend origins to @CrossOrigin at controller or via a global CORS bean.

5) What’s Included (Functional Overview)

Admin ( /admin/* ):
   Courses & Students CRUD
   View Enrollments
   Assign Results/Grades
Student ( /portal/* ):
   Browse courses and self-enroll
   My Enrollments with grades
Login Page:
   Left: brand + illustration; Right: role-based sign-in card
   Student email picker (demo auth for MVP)
Results Analytics (Admin):
   Filters: Course, Grade, Student email
   KPIs: Average GPA, Pass rate, Totals, Courses covered
   Charts: Grade distribution, Pass vs Fail
   Results table + CSV export

6) Verify Core Flows (Smoke Test)

Login
   Open /login
   Toggle role (Student/Admin)
   Student → pick an email → Continue → lands on /portal
   Admin → Continue → lands on /admin

Admin Console
   Create a course (code unique; credit 1–6)
   Create a student
   Check Enrollments list (should reflect changes)
   Assign a result to an enrollment (A–F) and see it in Results

Stdent Portal
   Browse courses → Enroll
   Check My Enrollments; view grades (if assigned)

Results Analytics
   Open Admin → Results
   Try filters (course/grade/search)
   Export CSV and open it

7) Build & Preview (Production Bundle)

7.1 Backend JAR

Build:
   cd backend
   mvn -q -DskipTests package

Run:
   java -jar target/*.jar

7.2 Frontend Dist

Build:
   cd frontend
   npm run build

Preview (simulates production routing/assets):
   npm run preview

8) Deployment (Render — Docker Web Services)

This project uses two Render Web Services from the same GitHub repository (monorepo):
Backend at backend/ (Spring Boot)
Frontend at frontend/ (Vite build served by Nginx)
Both services use the Dockerfiles already in each folder.

8.1 Backend on Render (Docker)

Push your repo to GitHub (root contains backend/ and frontend/).
Go to Render → New → Web Service.
Connect repository → select your UCMS repo.

In Advanced:

Root Directory: backend
Environment: Docker
Set Service Name: ucms-backend (or anything).
Click Create Web Service → Render will build from backend/Dockerfile.
After deploy, note the backend URL, e.g.
https://ucms-backend.onrender.com

CORS: ensure your controller has your frontend origin allowed:

@CrossOrigin(origins = {
  "http://localhost:5173",
  "https://ucms-frontend.onrender.com" // replace with your real frontend URL
})


Re-deploy backend if you changed code.

Smoke test:

https://ucms-backend.onrender.com/api/v1/courses

8.2 Frontend on Render (Docker)

New → Web Service again.

Connect repository → same repo.

In Advanced:

Root Directory: frontend

Environment: Docker

Service Name: ucms-frontend.

Build Args (very important):

Name: VITE_API

Value: https://ucms-backend.onrender.com/api/v1
(replace with your actual backend URL)

Create the service and wait for deploy. You’ll get a URL like:
https://ucms-frontend.onrender.com

Verify:

/login loads

Student → Continue → /portal shows data from the public API

Admin → Continue → /admin works

Charts/CSV on Results page render correctly

If CORS errors appear, add the frontend URL to @CrossOrigin and re-deploy the backend.

Notes

SPA fallback is already handled by frontend/nginx.conf (try_files $uri /index.html;), so deep links like /admin/courses will work.
If you change the backend URL later, update the Build Arg VITE_API and redeploy the frontend.

8.3 (Optional) One-click with Render Blueprint

If you prefer one-click provisioning, add this file at the repo root as render.yaml, commit, then on Render choose New → Blueprint:

services:
  - type: web
    name: ucms-backend
    env: docker
    rootDir: backend
    plan: free
    autoDeploy: true

  - type: web
    name: ucms-frontend
    env: docker
    rootDir: frontend
    plan: free
    autoDeploy: true
    buildCommand: ""
    startCommand: ""
    envVars:
      - key: VITE_API
        value: https://ucms-backend.onrender.com/api/v1   # update after first backend deploy


Deploy once; then edit the VITE_API env var to your actual backend URL and re-deploy the frontend.

9) Minimal API Map (reference)

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

GET /api/v1/enrollments (filter: ?studentEmail=)
POST /api/v1/enrollments?studentEmail=&courseId= (409 on duplicate)

Results

GET /api/v1/results
POST /api/v1/results?enrollmentId=&grade= (A..F)

10) Pre-Deployment Checklist (Render)

Frontend

Build Arg VITE_API points to your backend public URL + /api/v1.
Build succeeds; pages load; deep links work (Nginx SPA fallback).
Login/Admin/Student flows OK; analytics renders; CSV downloads.

Backend

Entities & constraints OK (unique course code; unique (studentEmail, course_id); unique enrollment_id; credit 1–6).
Status codes: 201 on create, 409 on duplicate enroll.
CORS includes the Render frontend origin.
JAR builds locally (mvn -q -DskipTests package) and service responds.

Docs & Assets

.env* not committed.
login-hero.jpg optimized.
