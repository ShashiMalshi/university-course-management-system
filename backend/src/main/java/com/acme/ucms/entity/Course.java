package com.acme.ucms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Column(unique = true)
    private String code;
    @NotBlank
    private String title;
    @Min(1) @Max(6)
    private int credit = 3;
    private String lecturerName;
}
