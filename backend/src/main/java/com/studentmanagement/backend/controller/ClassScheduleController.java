package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.entity.ClassSchedule;
import com.studentmanagement.backend.service.ClassScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    public ClassScheduleController(
            ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    // Get all scheduled classes
    @GetMapping
    public List<ClassSchedule> getAllClasses() {
        return classScheduleService.getAllClasses();
    }

    // Get a scheduled class by ID
    @GetMapping("/{id}")
    public ClassSchedule getClassById(@PathVariable Integer id) {
        return classScheduleService.getClassScheduleById(id);
    }

    // Get all classes assigned to a staff member
    @GetMapping("/staff/{staffId}")
    public List<ClassSchedule> getClassesByStaff(
            @PathVariable Integer staffId) {
        return classScheduleService.getClassesByStaff(staffId);
    }

    // Get a staff member's timetable for a particular day
    @GetMapping("/staff/{staffId}/day/{dayOfWeek}")
    public List<ClassSchedule> getStaffClassesByDay(
            @PathVariable Integer staffId,
            @PathVariable String dayOfWeek) {

        return classScheduleService.getStaffClassesByDay(
                staffId, dayOfWeek
        );
    }

    // Get all classes scheduled for a particular day
    @GetMapping("/day/{dayOfWeek}")
    public List<ClassSchedule> getClassesByDay(
            @PathVariable String dayOfWeek) {
        return classScheduleService.getClassesByDay(dayOfWeek);
    }

    // Create a scheduled class
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassSchedule createClass(
            @RequestBody ClassSchedule classSchedule) {
        return classScheduleService.createClass(classSchedule);
    }

    // Update an existing scheduled class
    @PutMapping("/{id}")
    public ClassSchedule updateClass(
            @PathVariable Integer id,
            @RequestBody ClassSchedule classSchedule) {

        return classScheduleService.updateClass(id, classSchedule);
    }

    // Delete a scheduled class
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClass(@PathVariable Integer id) {
        classScheduleService.deleteClass(id);
    }
}