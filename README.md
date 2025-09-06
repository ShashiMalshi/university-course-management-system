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