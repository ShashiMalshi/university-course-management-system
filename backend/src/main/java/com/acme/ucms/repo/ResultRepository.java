package com.acme.ucms.repo;

import com.acme.ucms.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    // check if a result already exists for an enrollment
    Optional<Result> findByEnrollmentId(Long id);

    // useful for student portal results view
    List<Result> findByEnrollment_StudentEmail(String studentEmail);
}
