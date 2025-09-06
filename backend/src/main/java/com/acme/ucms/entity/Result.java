package com.acme.ucms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(uniqueConstraints=@UniqueConstraint(columnNames={"enrollment_id"}))
public class Result {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional=false, fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id", nullable = false, unique = true)
    private Enrollment enrollment;

    @Column(length=2)
    private String grade; // A–F

    @Column(columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant updatedAt = Instant.now();
}
