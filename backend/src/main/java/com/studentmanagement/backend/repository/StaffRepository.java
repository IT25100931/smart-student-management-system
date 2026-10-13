//this file is only for demo purposes
package com.studentmanagement.backend.repository;

import com.studentmanagement.backend.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
}