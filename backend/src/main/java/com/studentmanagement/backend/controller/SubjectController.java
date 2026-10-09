package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.Subject;
import com.studentmanagement.backend.service.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // Get all subjects
    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // Get a subject by ID
    @GetMapping("/{id}")
    public Subject getSubjectById(@PathVariable Integer id) {
        return subjectService.getSubjectById(id);
    }

    // Create a new subject
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectService.createSubject(subject);
    }

    // Update an existing subject
    @PutMapping("/{id}")
    public Subject updateSubject(
            @PathVariable Integer id,
            @RequestBody Subject subject) {
        return subjectService.updateSubject(id, subject);
    }

    // Delete a subject
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubject(@PathVariable Integer id) {
        subjectService.deleteSubject(id);
    }
}