package com.studentmanagement.backend.service;


import com.example.schoollms.dao.AcademicStaffDAO;
import com.example.schoollms.model.LeaveRequest;
import com.example.schoollms.model.Salary;
import com.example.schoollms.model.Staff;

import java.util.List;

public class AcademicStaffService {

    private final AcademicStaffDAO dao =
            new AcademicStaffDAO();


    // View staff details
    public Staff getStaffDetails(int staffId) {

        return dao.getStaffDetails(staffId);
    }


    // View salary details
    public List<Salary> getSalaryDetails(int staffId) {

        return dao.getSalaryDetails(staffId);
    }


    // Request leave
    public boolean requestLeave(LeaveRequest leaveRequest) {

        return dao.requestLeave(leaveRequest);
    }
}