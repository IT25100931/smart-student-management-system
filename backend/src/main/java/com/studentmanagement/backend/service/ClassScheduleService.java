package com.studentmanagement.backend.service;

import com.studentmanagement.backend.entity.ClassSchedule;
import com.studentmanagement.backend.entity.Subject;
import com.studentmanagement.backend.entity.Staff;
import com.studentmanagement.backend.repository.ClassScheduleRepository;
import com.studentmanagement.backend.repository.SubjectRepository;
import com.studentmanagement.backend.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class ClassScheduleService {

    private final ClassScheduleRepository classScheduleRepository;
    private final SubjectRepository subjectRepository;
    private final StaffRepository staffRepository;

    public ClassScheduleService(
            ClassScheduleRepository classScheduleRepository,
            SubjectRepository subjectRepository,
            StaffRepository staffRepository) {

        this.classScheduleRepository = classScheduleRepository;
        this.subjectRepository = subjectRepository;
        this.staffRepository = staffRepository;
    }

    // Get all scheduled classes
    public List<ClassSchedule> getAllClasses() {
        return classScheduleRepository.findAll();
    }

    // Get one scheduled class by ID
    public ClassSchedule getClassScheduleById(Integer id) {
        return classScheduleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Class not found with ID: " + id
                        ));
    }

    // Get all classes assigned to a staff member
    public List<ClassSchedule> getClassesByStaff(Integer staffId) {
        if (!staffRepository.existsById(staffId)) {
            throw new IllegalArgumentException(
                    "Staff not found with ID: " + staffId
            );
        }

        return classScheduleRepository.findByStaffStaffId(staffId);
    }

    // Get a staff member's timetable for a particular day
    public List<ClassSchedule> getStaffClassesByDay(
            Integer staffId,
            String dayOfWeek) {

        if (!staffRepository.existsById(staffId)) {
            throw new IllegalArgumentException(
                    "Staff not found with ID: " + staffId
            );
        }

        String day = normalizeDayOfWeek(dayOfWeek);

        return classScheduleRepository
                .findByStaffStaffIdAndDayOfWeekIgnoreCaseOrderByStartTimeAsc(
                        staffId, day
                );
    }

    // Get all classes scheduled for a particular day
    public List<ClassSchedule> getClassesByDay(String dayOfWeek) {
        String day = normalizeDayOfWeek(dayOfWeek);

        return classScheduleRepository
                .findByDayOfWeekIgnoreCaseOrderByStartTimeAsc(day);
    }

    // Create a scheduled class
    public ClassSchedule createClass(ClassSchedule classSchedule) {
        validateAndSetReferences(classSchedule);
        return classScheduleRepository.save(classSchedule);
    }

    // Update an existing scheduled class
    public ClassSchedule updateClass(
            Integer id,
            ClassSchedule updatedClass) {

        ClassSchedule existingClass = getClassScheduleById(id);

        validateAndSetReferences(updatedClass);

        existingClass.setSubject(updatedClass.getSubject());
        existingClass.setStaff(updatedClass.getStaff());
        existingClass.setClassName(updatedClass.getClassName());
        existingClass.setRoomNo(updatedClass.getRoomNo());
        existingClass.setDayOfWeek(updatedClass.getDayOfWeek());
        existingClass.setStartTime(updatedClass.getStartTime());
        existingClass.setEndTime(updatedClass.getEndTime());
        existingClass.setSemester(updatedClass.getSemester());
        existingClass.setAcademicYear(updatedClass.getAcademicYear());

        return classScheduleRepository.save(existingClass);
    }

    // Delete a scheduled class
    public void deleteClass(Integer id) {
        ClassSchedule classSchedule = getClassScheduleById(id);
        classScheduleRepository.delete(classSchedule);
    }

    // Validate class details and load existing Subject and Staff records
    private void validateAndSetReferences(ClassSchedule classSchedule) {

        if (classSchedule == null) {
            throw new IllegalArgumentException(
                    "Class details are required."
            );
        }

        if (classSchedule.getClassName() == null
                || classSchedule.getClassName().isBlank()) {
            throw new IllegalArgumentException(
                    "Class name is required."
            );
        }

        classSchedule.setDayOfWeek(
                normalizeDayOfWeek(classSchedule.getDayOfWeek())
        );

        if (classSchedule.getStartTime() == null
                || classSchedule.getEndTime() == null) {
            throw new IllegalArgumentException(
                    "Start time and end time are required."
            );
        }

        if (!classSchedule.getEndTime()
                .isAfter(classSchedule.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time must be later than start time."
            );
        }

        if (classSchedule.getSubject() == null
                || classSchedule.getSubject().getSubjectId() == null) {
            throw new IllegalArgumentException(
                    "A subject must be selected."
            );
        }

        if (classSchedule.getStaff() == null
                || classSchedule.getStaff().getStaffId() == null) {
            throw new IllegalArgumentException(
                    "A staff member must be selected."
            );
        }

        Integer subjectId = classSchedule.getSubject().getSubjectId();
        Integer staffId = classSchedule.getStaff().getStaffId();

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject not found with ID: " + subjectId
                        ));

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Staff not found with ID: " + staffId
                        ));

        classSchedule.setSubject(subject);
        classSchedule.setStaff(staff);
    }

    // Accept day names regardless of capitalization
    private String normalizeDayOfWeek(String dayOfWeek) {

        if (dayOfWeek == null || dayOfWeek.isBlank()) {
            throw new IllegalArgumentException(
                    "Day of week is required."
            );
        }

        switch (dayOfWeek.trim().toLowerCase(Locale.ROOT)) {
            case "monday":
                return "Monday";
            case "tuesday":
                return "Tuesday";
            case "wednesday":
                return "Wednesday";
            case "thursday":
                return "Thursday";
            case "friday":
                return "Friday";
            case "saturday":
                return "Saturday";
            case "sunday":
                return "Sunday";
            default:
                throw new IllegalArgumentException(
                        "Invalid day of week. Use Monday to Sunday."
                );
        }
    }
}