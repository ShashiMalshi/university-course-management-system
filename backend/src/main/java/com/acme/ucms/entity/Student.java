package com.acme.ucms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String studentId;

    @Email
    private String email;
}
