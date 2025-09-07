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
│ ├─ public/ # Static assets
│ ├─ src/ # Pages, layouts, shared helpers
│ └─ README.md # Frontend-specific docs
└─ README.md # This file


---

## 3. Quickstart (Local Development)

### 3.1 Backend

```bash
cd backend
mvn spring-boot:run


Verify API is running:
GET http://localhost:8080/api/v1/courses

3.2 Frontend
cd frontend
npm install
npm run dev


Open the app: http://localhost:5173

4. Environment Configuration
4.1 Frontend

Local development: create frontend/.env

VITE_API=http://localhost:8080/api/v1


Production: create frontend/.env.production

VITE_API=https://api.your-domain.com/api/v1


Ensure backend CORS allows:

http://localhost:5173 (dev)

your deployed frontend origin (production)

4.2 Backend (optional overrides in application.yml)

Typical dev settings:

server.port=8080
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=update


Add frontend origins via @CrossOrigin at controller or global CORS bean.

5. Functional Overview

Admin (/admin/*):

Courses & Students CRUD

View Enrollments

Assign Results/Grades

Student (/portal/*):

Browse courses & self-enroll

My Enrollments with grades

Login Page:

Left: brand + illustration

Right: role-based sign-in card

Student email picker (demo auth for MVP)

Results Analytics (Admin):

Filters: Course, Grade, Student email

KPIs: Average GPA, Pass rate, Totals, Courses covered

Charts: Grade distribution, Pass vs Fail

Results table + CSV export

6. Verify Core Flows (Smoke Test)

Login

Open /login

Toggle role (Student/Admin)

Student → pick an email → lands on /portal

Admin → Continue → lands on /admin

Admin Console

Create a course (unique code; credit 1–6)

Create a student

Check Enrollments list

Assign a result to an enrollment (A–F)

Student Portal

Browse courses → Enroll

Check My Enrollments; view grades

Results Analytics

Open Admin → Results

Try filters (course/grade/search)

Export CSV

7. Build & Preview (Production Bundle)
7.1 Backend JAR
cd backend
mvn -q -DskipTests package
java -jar target/*.jar

7.2 Frontend Dist
cd frontend
npm run build
npm run preview   # simulates production routing/assets

8. Deployment (Render — Docker Web Services)

Monorepo with two Render Web Services:

Backend at backend/ (Spring Boot)

Frontend at frontend/ (Vite build served by Nginx)

Both use Dockerfiles in their respective folders.

8.1 Backend on Render (Docker)

Push repo to GitHub.

Render → New → Web Service → Connect repo → select UCMS repo.

Advanced:

Root Directory: backend

Environment: Docker

Service Name: ucms-backend

Deploy → Note backend URL, e.g., https://ucms-backend.onrender.com

Ensure CORS includes frontend origin.

8.2 Frontend on Render (Docker)

Render → New → Web Service → Connect repo.

Advanced:

Root Directory: frontend

Environment: Docker

Service Name: ucms-frontend

Build Args:

Name: VITE_API
Value: https://ucms-backend.onrender.com/api/v1


Deploy → Verify /login, /portal, /admin flows, charts, CSV.

8.3 Optional: One-click Blueprint
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
        value: https://ucms-backend.onrender.com/api/v1

9. Minimal API Map (reference)

Courses

GET    /api/v1/courses
POST   /api/v1/admin/courses
PUT    /api/v1/admin/courses/{id}
DELETE /api/v1/admin/courses/{id}


Students

GET    /api/v1/students
POST   /api/v1/admin/students
PUT    /api/v1/admin/students/{id}
DELETE /api/v1/admin/students/{id}


Enrollments

GET  /api/v1/enrollments?studentEmail=
POST /api/v1/enrollments?studentEmail=&courseId=


Results

GET  /api/v1/results
POST /api/v1/results?enrollmentId=&grade=

10. Pre-Deployment Checklist

Frontend

VITE_API points to backend public URL

Build succeeds; pages load; deep links work

Login/Admin/Student flows OK; analytics render; CSV downloads

Backend

Entities & constraints OK (unique course codes, emails, enrollment)

Status codes: 201 on create, 409 on duplicate

CORS includes frontend origin

JAR builds locally and service responds

Docs & Assets

.env* not committed

login-hero.jpg optimized
