# UniCMS — University Course Management System - Backend (Spring Boot)

REST API for the **University Course Management System**.  
Provides CRUD for Courses & Students, Student self-enrollment, and Results/Grades.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [Build & Run JAR](#build--run-jar)
- [Configuration](#configuration)
- [Data Model](#data-model)
- [API Summary](#api-summary)
- [Endpoints & Examples](#endpoints--examples)
- [H2 Console (Dev Only)](#h2-console-dev-only)
- [CORS](#cors)
- [Pre-Deployment Checklist (Backend)](#pre-deployment-checklist-backend)

---

## Tech Stack
- Java **17**, Spring Boot (Web, Data JPA, Validation, H2 for dev)
- JPA entities: `Course`, `Student`, `Enrollment`, `Result`

---

## Run Locally

**Prereqs:** JDK 17+, Maven.

```bash
mvn spring-boot:run

Build & Run JAR

mvn -q -DskipTests package
java -jar target/*.jar

Configuration

Common properties (set via application.yml or env vars):

Server:
server.port=8080

H2 (dev):
spring.datasource.url=jdbc:h2:mem:ucms;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.h2.console.enabled=true

JPA:
spring.jpa.hibernate.ddl-auto=update (dev convenience)

CORS:
In the controller:
@CrossOrigin(origins={"http://localhost:5173","https://your-frontend.example"})

Data Model

Course (id, code unique, title, credit 1..6, lecturerName)
Student (id, name, studentId, email)
Enrollment (id, studentEmail, course (ManyToOne), enrolledAt)
Unique constraint: (studentEmail, course_id)
Result (id, enrollment (OneToOne), grade in A..F, updatedAt)
Unique constraint: enrollment_id

API Endpoints

Courses

GET /api/v1/courses
→ List all courses (optional ?q= to search by code/title, if implemented)

POST /api/v1/admin/courses
→ Create a new course (expects JSON body)

PUT /api/v1/admin/courses/{id}
→ Update an existing course

DELETE /api/v1/admin/courses/{id}
→ Delete a course

Students

GET /api/v1/students
→ List all students

POST /api/v1/admin/students
→ Create a new student (expects JSON body)

PUT /api/v1/admin/students/{id}
→ Update student details

DELETE /api/v1/admin/students/{id}
→ Delete a student

Enrollments

GET /api/v1/enrollments
→ List enrollments (optional filter: ?studentEmail=)

POST /api/v1/enrollments?studentEmail=&courseId=
→ Enroll a student in a course
→ Returns 409 Conflict if already enrolled

Results

GET /api/v1/results
→ List all results

POST /api/v1/results?enrollmentId=&grade=
→ Assign or update a grade for an enrollment

Endpoints & Examples

Courses

GET /api/v1/courses
Optional search: /api/v1/courses?q=data

POST /api/v1/admin/courses

{
  "code": "CS101",
  "title": "Intro to Computer Science",
  "credit": 3,
  "lecturerName": "Dr. Smith"
}


PUT /api/v1/admin/courses/1

{
  "code": "CS101",
  "title": "Intro to CS",
  "credit": 3,
  "lecturerName": "Dr. Smith"
}


DELETE /api/v1/admin/courses/1

Students

GET /api/v1/students

POST /api/v1/admin/students

{
  "name": "Alice",
  "studentId": "S001",
  "email": "alice@example.com"
}


PUT /api/v1/admin/students/1

{
  "name": "Alice B.",
  "studentId": "S001",
  "email": "alice@example.com"
}


DELETE /api/v1/admin/students/1

Enrollments

GET /api/v1/enrollments
Filter by student: /api/v1/enrollments?studentEmail=alice@example.com

POST /api/v1/enrollments?studentEmail=alice@example.com&courseId=2

201 with created enrollment JSON

409 if the student is already enrolled in the course (unique constraint)

Results

GET /api/v1/results
POST /api/v1/results?enrollmentId=2&grade=A
201 with created result JSON
Grades accepted: A B C D E F (case-insensitive)

H2 Console (Dev Only)

URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:ucms
User/Pass: leave default unless configured
Toggle on/off via spring.h2.console.enabled=true/false

CORS

Add your frontend origins to @CrossOrigin (controller level) or configure a global CORS bean.
At minimum include:
http://localhost:5173 (Vite dev)
Your production frontend URL (e.g., https://ucms.your-domain.com)

Example (controller):

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:5173","https://ucms.your-domain.com"})
public class ApiController { ... }

Pre-Deployment Checklist (Backend)

 Entities & Constraints match spec (Course unique code; Enrollment unique (studentEmail, course_id); Result unique enrollment_id; Course credit 1..6).
 Endpoints match this README and return correct status codes (201 on create, 409 on duplicate enroll).
 CORS includes your production frontend origin.
 Profiles: dev uses H2; prod points to your SQL database (if applicable).
 Logging level sane in prod (no SQL debug).
 Build: mvn -q -DskipTests package succeeds.
 Smoke test with curl/Postman:
    Create course & student
    Enroll student (ensure 409 on duplicate)
    Add result
    List results and enrollments (with ?studentEmail= filter)
