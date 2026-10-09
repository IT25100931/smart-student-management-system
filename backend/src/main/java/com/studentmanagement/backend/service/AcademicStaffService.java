package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dao.AcademicStaffDAO;
import com.studentmanagement.backend.model.Salary;
import com.studentmanagement.backend.model.Staff;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AcademicStaffService {

    private final AcademicStaffDAO dao;

    public AcademicStaffService(AcademicStaffDAO dao) {
        this.dao = dao;
    }

    public Staff getStaffDetails(int staffId) {
        return dao.getStaffDetails(staffId);
    }

    public List<Salary> getSalaryDetails(int staffId) {
        return dao.getSalaryDetails(staffId);
    }
}
