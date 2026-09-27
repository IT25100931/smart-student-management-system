package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.model.Student;
import com.studentmanagement.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/search")
    public List<Student> search(@RequestParam String name) {
        return studentService.searchStudents(name);
    }

    @GetMapping
    public List<Student> getAll() {
        return studentService.getAllStudents();
    }
}
