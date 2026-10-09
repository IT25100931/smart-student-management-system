package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.Subject;
import com.studentmanagement.backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Get all subjects
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Get a subject by ID
    public Subject getSubjectById(Integer id) {
        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject not found with ID: " + id
                        ));
    }

    // Create a new subject
    public Subject createSubject(Subject subject) {
        validateSubject(subject);
        return subjectRepository.save(subject);
    }

    // Update an existing subject
    public Subject updateSubject(Integer id, Subject updatedSubject) {
        Subject existingSubject = getSubjectById(id);

        validateSubject(updatedSubject);

        existingSubject.setSubjectCode(updatedSubject.getSubjectCode());
        existingSubject.setSubjectName(updatedSubject.getSubjectName());
        existingSubject.setDescription(updatedSubject.getDescription());
        existingSubject.setCredits(updatedSubject.getCredits());

        return subjectRepository.save(existingSubject);
    }

    // Delete a subject
    public void deleteSubject(Integer id) {
        Subject subject = getSubjectById(id);
        subjectRepository.delete(subject);
    }

    // Validate subject details
    private void validateSubject(Subject subject) {
        if (subject.getSubjectCode() == null
                || subject.getSubjectCode().isBlank()) {
            throw new IllegalArgumentException(
                    "Subject code is required."
            );
        }

        if (subject.getSubjectName() == null
                || subject.getSubjectName().isBlank()) {
            throw new IllegalArgumentException(
                    "Subject name is required."
            );
        }

        if (subject.getCredits() == null || subject.getCredits() <= 0) {
            throw new IllegalArgumentException(
                    "Credits must be greater than zero."
            );
        }
    }
}