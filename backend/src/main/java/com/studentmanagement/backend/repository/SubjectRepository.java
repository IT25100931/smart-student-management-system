package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubjectRepository
        extends JpaRepository<Subject, Integer> {
}
