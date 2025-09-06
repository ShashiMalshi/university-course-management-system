package com.acme.ucms.repo;

import com.acme.ucms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCodeContainingIgnoreCaseOrTitleContainingIgnoreCase(String code, String title);
}
