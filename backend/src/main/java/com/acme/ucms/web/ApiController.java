package com.acme.ucms.web;

import com.acme.ucms.entity.*;
import com.acme.ucms.repo.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {
    "http://localhost:5173",               // optional, local dev
    "http://localhost:3000",               // optional, local dev
    "https://ucms-frontend.onrender.com"   // deployed frontend
})
public class ApiController {

  private final CourseRepository courses;
  private final StudentRepository students;
  private final EnrollmentRepository enrollments;
  private final ResultRepository results;

  public ApiController(CourseRepository c, StudentRepository s, EnrollmentRepository e, ResultRepository r){
    this.courses=c; this.students=s; this.enrollments=e; this.results=r;
  }

  // -------- Courses CRUD --------
  @GetMapping("/courses")
  public List<Course> listCourses() { return courses.findAll(); }

  @PostMapping("/admin/courses")
  public ResponseEntity<Course> createCourse(@RequestBody Course course) {
    course.setId(null);
    return ResponseEntity.status(HttpStatus.CREATED).body(courses.save(course));
  }

  @PutMapping("/admin/courses/{id}")
  public Course updateCourse(@PathVariable Long id, @RequestBody Course payload) {
    Course c = courses.findById(id).orElseThrow();
    c.setCode(payload.getCode());
    c.setTitle(payload.getTitle());
    c.setCredit(payload.getCredit());
    c.setLecturerName(payload.getLecturerName());
    return courses.save(c);
  }

  @DeleteMapping("/admin/courses/{id}")
  public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
    courses.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // -------- Students CRUD --------
  @GetMapping("/students")
  public List<Student> listStudents() { return students.findAll(); }

  @PostMapping("/admin/students")
  public ResponseEntity<Student> createStudent(@RequestBody Student student) {
    student.setId(null);
    return ResponseEntity.status(HttpStatus.CREATED).body(students.save(student));
  }

  @PutMapping("/admin/students/{id}")
  public Student updateStudent(@PathVariable Long id, @RequestBody Student payload) {
    Student s = students.findById(id).orElseThrow();
    s.setName(payload.getName());
    s.setStudentId(payload.getStudentId());
    s.setEmail(payload.getEmail());
    return students.save(s);
  }

  @DeleteMapping("/admin/students/{id}")
  public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
    students.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // -------- Enrollments (self-enroll + admin views) --------
  @PostMapping("/enrollments")
  public ResponseEntity<?> enroll(@RequestParam String studentEmail, @RequestParam Long courseId) {
    if (enrollments.existsByStudentEmailAndCourseId(studentEmail, courseId)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Already enrolled");
    }
    Course course = courses.findById(courseId).orElseThrow();
    Enrollment enrollment = new Enrollment(null, studentEmail, course, Instant.now());
    return ResponseEntity.status(HttpStatus.CREATED).body(enrollments.save(enrollment));
  }

  // GET /enrollments or /enrollments?studentEmail=alice@example.com
  @GetMapping("/enrollments")
  public List<Enrollment> listEnrollments(@RequestParam(required = false) String studentEmail) {
    if (studentEmail != null && !studentEmail.isBlank()) {
      List<Enrollment> sorted = enrollments.findByStudentEmailOrderByEnrolledAtDesc(studentEmail);
      if (!sorted.isEmpty()) return sorted;
      return enrollments.findByStudentEmail(studentEmail); // fallback
    }
    return enrollments.findAll();
  }

  // alias used by the frontend as a fallback
  @GetMapping("/me/enrollments")
  public List<Enrollment> listMyEnrollments(@RequestParam String studentEmail) {
    List<Enrollment> sorted = enrollments.findByStudentEmailOrderByEnrolledAtDesc(studentEmail);
    if (!sorted.isEmpty()) return sorted;
    return enrollments.findByStudentEmail(studentEmail);
  }

  // optional: enable unenroll from UI (frontend handles lack of support with a toast)
  @DeleteMapping("/enrollments/{id}")
  public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
    if (!enrollments.existsById(id)) return ResponseEntity.notFound().build();
    enrollments.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  // -------- Results (upsert on enrollment) --------
  @PostMapping("/results")
  public ResponseEntity<Result> assignGrade(@RequestParam Long enrollmentId, @RequestParam String grade) {
    Enrollment enrollment = enrollments.findById(enrollmentId)
        .orElseThrow(() -> new RuntimeException("Enrollment not found"));

    Result r = results.findByEnrollmentId(enrollmentId).orElse(new Result());
    boolean existed = r.getId() != null;

    r.setEnrollment(enrollment);
    r.setGrade(grade);
    r.setUpdatedAt(Instant.now());

    Result saved = results.save(r);
    return ResponseEntity.status(existed ? HttpStatus.OK : HttpStatus.CREATED).body(saved);
  }

  @GetMapping("/results")
  public List<Result> listResults() { return results.findAll(); }

  // handy for student portal “my grades”
  @GetMapping("/results/by-student")
  public List<Result> listResultsByStudent(@RequestParam String studentEmail) {
    return results.findByEnrollment_StudentEmail(studentEmail);
  }
}
