package com.studentmanagement.backend.service;

import com.studentmanagement.backend.model.Student;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.studentmanagement.backend.dao.StudentFeeDAO;
import com.studentmanagement.backend.model.StudentFee;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    private final StudentFeeDAO studentFeeDAO = new StudentFeeDAO();

    private static final BigDecimal TERM_FEE_AMOUNT = new BigDecimal("50000");
    private static final String TERM_FEE_TYPE = "Semester Fee";
    private static final int TERM_FEE_DUE_DAYS = 30;

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
        Student saved = studentRepository.save(student);

        StudentFee fee = new StudentFee();
        fee.setStudentId(saved.getStudentId());
        fee.setFeeType(TERM_FEE_TYPE);
        fee.setTotalAmount(TERM_FEE_AMOUNT);
        fee.setPaidAmount(BigDecimal.ZERO);
        fee.setDueDate(LocalDate.now().plusDays(TERM_FEE_DUE_DAYS));
        fee.setPaymentStatus("UNPAID");

        boolean feeCreated = studentFeeDAO.addStudentFee(fee);
        if (!feeCreated) {
            // Roll back manually so we never have a student without a fee
            studentRepository.deleteById(saved.getStudentId());
            throw new RuntimeException("Student registration failed: could not create term fee.");
        }

        return saved;
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