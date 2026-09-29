package com.studentmanagement.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity //to indicate this class is a database table
@Table(name = "students")
public class Student {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //MySQL auto-increments the ID

    @Column(name = "student_id") //studentId in tha java program connect to the student_id column in the database
    private Long studentId; //stores a whole number

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private LocalDate dob; //Year - Month - Day
    private String gender;
    private String email;

    @Column(name = "contact_no")
    private String contactNo;

    private String address;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    private String status;

    public Student() {} //creates a Student object without giving any values initially.
    //default constructor without any initial values

    //getter and setter student ID
    public Long getStudentId() {
        return studentId;
    }
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    //getter and setter user ID
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    //getter and setter first name
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    //getter and setter Last name
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    //getter and setter DOB
    public LocalDate getDob() {
        return dob;
    }
    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    //getter and setter Gender
    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    //getter and setter Email
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    //getter and setter Contact No
    public String getContactNo() {
        return contactNo;
    }
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    //getter and setter Address
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    //getter and setter Admission Date
    public LocalDate getAdmissionDate() {
        return admissionDate;
    }
    public void setAdmissionDate(LocalDate admissionDate) {
        this.admissionDate = admissionDate;
    }

    //getter and setter status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}

