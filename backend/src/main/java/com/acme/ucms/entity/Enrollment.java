package com.acme.ucms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"studentEmail","course_id"}))
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentEmail;

    @ManyToOne(optional=false, fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant enrolledAt = Instant.now();
}
