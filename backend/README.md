UniCMS — University Course Management System (Backend)

REST API for UniCMS, a University Course Management System.
Provides CRUD operations for Courses & Students, Student self-enrollment, and Results/Grades management.

Table of Contents

Tech Stack
Run Locally
Build & Run JAR
Configuration
Data Model
API Endpoints
Examples
H2 Console (Development Only)
CORS
Pre-Deployment Checklist

Tech Stack

Java 17, Spring Boot 3 (Web, Data JPA, Validation)
JPA Entities: Course, Student, Enrollment, Result
Database: H2 (development), PostgreSQL (production)

Run Locally

Prerequisites: JDK 17+, Maven

# Run in development mode
mvn spring-boot:run

# Build and run JAR
mvn -q -DskipTests package
java -jar target/*.jar

Configuration

Configuration can be set via application.yml or environment variables. Use placeholders for sensitive info.

# Server
server.port=8080

# PostgreSQL (Production)
spring.datasource.url=jdbc:postgresql://<DB_HOST>:5432/<DB_NAME>
spring.datasource.username=<DB_USERNAME>
spring.datasource.password=<DB_PASSWORD>
spring.datasource.driverClassName=org.postgresql.Driver

# H2 (Development)
spring.datasource.url=jdbc:h2:mem:ucms;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.h2.console.enabled=true

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

# Backend API URL for frontend (use environment variable)
VITE_API=https://<BACKEND_URL>

Data Model

Course: id, code (unique), title, credit (1–6), lecturerName

Student: id, name, studentId, email

Enrollment: id, studentEmail, course (ManyToOne), enrolledAt

Unique constraint: (studentEmail, course_id)

Result: id, enrollment (OneToOne), grade (A–F), updatedAt

Unique constraint: enrollment_id

API Endpoints
Courses
Method	Endpoint	Description
GET	/api/v1/courses	List all courses
POST	/api/v1/admin/courses	Create a new course
PUT	/api/v1/admin/courses/{id}	Update an existing course
DELETE	/api/v1/admin/courses/{id}	Delete a course
Students
Method	Endpoint	Description
GET	/api/v1/students	List all students
POST	/api/v1/admin/students	Create a new student
PUT	/api/v1/admin/students/{id}	Update student details
DELETE	/api/v1/admin/students/{id}	Delete a student
Enrollments
Method	Endpoint	Description
GET	/api/v1/enrollments	List enrollments (optional filter: ?studentEmail=<email>)
POST	/api/v1/enrollments?studentEmail=<email>&courseId=<id>	Enroll a student; returns 409 if already enrolled
Results
Method	Endpoint	Description
GET	/api/v1/results	List all results
POST	/api/v1/results?enrollmentId=<id>&grade=<grade>	Assign or update a grade (A–F)
Examples

Create Course

POST /api/v1/admin/courses
{
  "code": "CS101",
  "title": "Intro to Computer Science",
  "credit": 3,
  "lecturerName": "Dr. Smith"
}


Enroll Student

POST /api/v1/enrollments?studentEmail=alice@example.com&courseId=2


Assign Grade

POST /api/v1/results?enrollmentId=2&grade=A

H2 Console (Development Only)

URL: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:ucms

User/Password: default (unless configured)

Toggle via: spring.h2.console.enabled=true/false

CORS

Add your frontend origins at the controller level or via a global CORS configuration.

Minimum for development:

@CrossOrigin(origins = {"http://localhost:5173", "https://<FRONTEND_URL>"})
@RestController
@RequestMapping("/api/v1")
public class ApiController { ... }

Pre-Deployment Checklist

Entities and constraints match spec
Endpoints return correct HTTP status codes (201 on creation, 409 on duplicates)
CORS includes production frontend URL
Profiles: dev uses H2, prod uses PostgreSQL
Logging in production does not expose sensitive info
Build succeeds: mvn -q -DskipTests package
Smoke test with curl/Postman:
Create course & student
Enroll student (check 409 on duplicate)
Assign result
List results and enrollments (with ?studentEmail= filter)
