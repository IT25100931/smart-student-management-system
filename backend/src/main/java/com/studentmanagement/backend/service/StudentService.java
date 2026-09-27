package com.studentmanagement.backend.service;

import com.studentmanagement.backend.model.Student;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Generates the next ID in sequence: STU1001, STU1002, STU1003...
    private String generateNextStudentId() {
        Optional<String> topId = studentRepository.findTopStudentId();

        if (topId.isEmpty()) {
            return "STU1001";  // first student ever registered
        }

        String lastId = topId.get();               // e.g. "STU1005"
        int number = Integer.parseInt(lastId.substring(3)); // strips "STU", leaves 1005
        int nextNumber = number + 1;
        return "STU" + nextNumber;
    }

    public Student registerStudent(Student student) {
        student.setStudentId(generateNextStudentId());
        return studentRepository.save(student);
    }

    public Student updateStudent(String studentId, Student updatedDetails) {
        Student existing = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        existing.setFirstName(updatedDetails.getFirstName());
        existing.setLastName(updatedDetails.getLastName());
        existing.setDob(updatedDetails.getDob());
        existing.setGender(updatedDetails.getGender());
        existing.setEmail(updatedDetails.getEmail());
        existing.setContactNo(updatedDetails.getContactNo());
        existing.setAddress(updatedDetails.getAddress());

        return studentRepository.save(existing);
    }

    public Optional<Student> getStudentById(String studentId) {
        return studentRepository.findById(studentId);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}