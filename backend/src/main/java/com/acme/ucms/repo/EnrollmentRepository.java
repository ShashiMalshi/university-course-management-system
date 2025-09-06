package com.acme.ucms.repo;

import com.acme.ucms.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    // backend supports both generic and “my” views
    List<Enrollment> findByStudentEmail(String email);
    List<Enrollment> findByStudentEmailOrderByEnrolledAtDesc(String email);

    // nested property traversal (enrollment.course.id)
    boolean existsByStudentEmailAndCourseId(String email, Long courseId);

    // optional: handy for admin/reporting
    List<Enrollment> findByCourseId(Long courseId);
}
