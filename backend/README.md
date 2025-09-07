# UniCMS — University Course Management System (Backend)

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

- Java 17, Spring Boot (Web, Data JPA, Validation, H2 for dev)
- JPA entities: `Course`, `Student`, `Enrollment`, `Result`
- PostgreSQL (production)

---

## Run Locally

**Prerequisites:** JDK 17+, Maven

```bash
# Run using Maven
mvn spring-boot:run
Build & Run JAR
bash
Copy code
mvn -q -DskipTests package
java -jar target/*.jar
Configuration
Common properties (set via application.yml or environment variables):

Server:

yaml
Copy code
server.port=8080
H2 (dev):

yaml
Copy code
spring.datasource.url=jdbc:h2:mem:ucms;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.h2.console.enabled=true
JPA:

yaml
Copy code
spring.jpa.hibernate.ddl-auto=update
CORS:
In the controller:

java
Copy code
@CrossOrigin(origins={"http://localhost:5173","https://your-frontend.example"})
Data Model
Course: id, code (unique), title, credit (1–6), lecturerName

Student: id, name, studentId, email

Enrollment: id, studentEmail, course (ManyToOne), enrolledAt

Unique constraint: (studentEmail, course_id)

Result: id, enrollment (OneToOne), grade (A–F), updatedAt

Unique constraint: enrollment_id

API Summary
Courses: CRUD operations

Students: CRUD operations

Enrollments: List, filter, create

Results: List, assign/update grade

Endpoints & Examples
Courses
GET /api/v1/courses

POST /api/v1/admin/courses

json
Copy code
{
  "code": "CS101",
  "title": "Intro to Computer Science",
  "credit": 3,
  "lecturerName": "Dr. Smith"
}
PUT /api/v1/admin/courses/{id}

json
Copy code
{
  "code": "CS101",
  "title": "Intro to CS",
  "credit": 3,
  "lecturerName": "Dr. Smith"
}
DELETE /api/v1/admin/courses/{id}

Students
GET /api/v1/students

POST /api/v1/admin/students

json
Copy code
{
  "name": "Alice",
  "studentId": "S001",
  "email": "alice@example.com"
}
PUT /api/v1/admin/students/{id}

json
Copy code
{
  "name": "Alice B.",
  "studentId": "S001",
  "email": "alice@example.com"
}
DELETE /api/v1/admin/students/{id}

Enrollments
GET /api/v1/enrollments

Filter by student: /api/v1/enrollments?studentEmail=alice@example.com

POST /api/v1/enrollments?studentEmail=alice@example.com&courseId=2

Returns 201 Created or 409 Conflict if already enrolled

Results
GET /api/v1/results

POST /api/v1/results?enrollmentId=2&grade=A

201 Created with JSON response

Grades accepted: A, B, C, D, E, F (case-insensitive)

H2 Console (Dev Only)
URL: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:ucms

User/Pass: default unless configured

Toggle: spring.h2.console.enabled=true/false

CORS
Add frontend origins to @CrossOrigin (controller level) or configure a global CORS bean.

Development: http://localhost:5173

Production: https://your-frontend.example

Example:

java
Copy code
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:5173","https://your-frontend.example"})
public class ApiController { ... }

Pre-Deployment Checklist (Backend)

Entities & Constraints match spec
Endpoints return correct status codes (201 on create, 409 on duplicate)
CORS includes production frontend origin
Profiles: dev uses H2, prod points to PostgreSQL
Logging: production level, no SQL debug
Build succeeds: mvn -q -DskipTests package
Smoke test endpoints with curl/Postman:
Create course & student
Enroll student (ensure 409 on duplicate)
Add result
List results and enrollments (with ?studentEmail= filter)
