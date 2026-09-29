package com.studentmanagement.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private LocalDate dob;
    private String gender;
    private String email;

    @Column(name = "contact_no")
    private String contactNo;

    private String address;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    private String status;

    public Student() {}

    public Long getStudentId() { 
        return studentId; 
    }
    public void setStudentId(Long studentId) { 
        this.studentId = studentId; 
    }

    public Long getUserId() {
        return userId; 
    }
    public void setUserId(Long userId) { 
        this.userId = userId; 
    }

    public String getFirstName() {
        return firstName; 
    }
    public void setFirstName(String firstName) { 
        this.firstName = firstName; 
    }

    public String getLastName() { 
        return lastName; 
    }
    public void setLastName(String lastName) { 
        this.lastName = lastName; 
    }

    public LocalDate getDob() { 
        return dob;
    }
    public void setDob(LocalDate dob) { 
        this.dob = dob;
    }

    public String getGender() { 
        return gender;
    }
    public void setGender(String gender) { 
        this.gender = gender; 
    }

    public String getEmail() { 
        return email;
    }
    public void setEmail(String email) { 
        this.email = email;
    }

    public String getContactNo() { 
        return contactNo; 
    }
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo; 
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) { 
        this.address = address; 
    }

    public LocalDate getAdmissionDate() { 
        return admissionDate;
    }
    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    public String getStatus() { 
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}


