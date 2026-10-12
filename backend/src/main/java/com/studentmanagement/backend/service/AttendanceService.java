package com.studentmanagement.backend.service;

import com.studentmanagement.backend.dto.AttendanceSummaryResponse;
import com.studentmanagement.backend.dto.WeeklyAttendanceRequest;
import com.studentmanagement.backend.model.Attendance;
import com.studentmanagement.backend.model.AttendanceSummary;
import com.studentmanagement.backend.model.Student;
import com.studentmanagement.backend.repository.AttendanceRepository;
import com.studentmanagement.backend.repository.AttendanceSummaryRepository;
import com.studentmanagement.backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepo;
    private final AttendanceSummaryRepository summaryRepo;
    private final StudentRepository studentRepo;

    public AttendanceService(AttendanceRepository attendanceRepo,
                             AttendanceSummaryRepository summaryRepo,
                             StudentRepository studentRepo) {
        this.attendanceRepo = attendanceRepo;
        this.summaryRepo = summaryRepo;
        this.studentRepo = studentRepo;
    }

    /** Saves one week of attendance for many students at once. */
    @Transactional
    public int saveWeeklyAttendance(WeeklyAttendanceRequest req) {
        if (req.weekStartDate() == null || req.weekEndDate() == null
                || req.weekEndDate().isBefore(req.weekStartDate())) {
            throw new IllegalArgumentException("Invalid week dates");
        }
        if (req.totalDays() <= 0 || req.totalDays() > 7) {
            throw new IllegalArgumentException("Total days must be between 1 and 7");
        }
        if (req.entries() == null || req.entries().isEmpty()) {
            throw new IllegalArgumentException("No student entries supplied");
        }

        int saved = 0;
        for (WeeklyAttendanceRequest.StudentEntry e : req.entries()) {
            if (e.daysPresent() < 0 || e.daysPresent() > req.totalDays()) {
                throw new IllegalArgumentException(
                        "Days present must be between 0 and " + req.totalDays()
                                + " for student " + e.studentId());
            }
            if (attendanceRepo.existsByStudent_StudentIdAndWeekEndDate(e.studentId(), req.weekEndDate())) {
                throw new IllegalStateException("Attendance already entered for student "
                        + e.studentId() + " for week ending " + req.weekEndDate());
            }
            Student student = studentRepo.findById(e.studentId())
                    .orElseThrow(() -> new NoSuchElementException("Student not found: " + e.studentId()));

            Attendance a = new Attendance();
            a.setStudent(student);
            a.setWeekStartDate(req.weekStartDate());
            a.setWeekEndDate(req.weekEndDate());
            a.setTotalDays(req.totalDays());
            a.setDaysPresent(e.daysPresent());
            a.setRemarks(e.remarks());
            attendanceRepo.save(a);
            saved++;
        }
        return saved;
    }

    public List<Attendance> getStudentAttendance(String studentId) {
        return attendanceRepo.findByStudent_StudentIdOrderByWeekEndDateDesc(studentId);
    }

    /** Calculates the monthly percentage. A week counts toward the month of its week-ending date. */
    @Transactional
    public List<AttendanceSummaryResponse> generateMonthlySummary(int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        List<Attendance> weeks = attendanceRepo.findByWeekEndDateBetween(ym.atDay(1), ym.atEndOfMonth());

        Map<String, List<Attendance>> byStudent =
                weeks.stream().collect(Collectors.groupingBy(a -> a.getStudent().getStudentId()));

        List<AttendanceSummaryResponse> result = new ArrayList<>();
        for (List<Attendance> records : byStudent.values()) {
            Student student = records.get(0).getStudent();
            int totalDays = records.stream().mapToInt(Attendance::getTotalDays).sum();
            int present = records.stream().mapToInt(Attendance::getDaysPresent).sum();

            BigDecimal pct = totalDays == 0 ? BigDecimal.ZERO
                    : BigDecimal.valueOf(present * 100.0 / totalDays).setScale(2, RoundingMode.HALF_UP);

            AttendanceSummary s = summaryRepo
                    .findByStudent_StudentIdAndYearAndMonth(student.getStudentId(), year, month)
                    .orElseGet(AttendanceSummary::new);
            s.setStudent(student);
            s.setYear(year);
            s.setMonth(month);
            s.setTotalDays(totalDays);
            s.setDaysPresent(present);
            s.setPercentage(pct);
            s.setGeneratedAt(LocalDateTime.now());
            result.add(AttendanceSummaryResponse.from(summaryRepo.save(s)));
        }
        return result;
    }

    public List<AttendanceSummaryResponse> getMonthlySummaries(int year, int month) {
        return summaryRepo.findByYearAndMonth(year, month).stream()
                .map(AttendanceSummaryResponse::from).toList();
    }

    public List<AttendanceSummaryResponse> getStudentSummaries(String studentId) {
        return summaryRepo.findByStudent_StudentIdOrderByYearDescMonthDesc(studentId).stream()
                .map(AttendanceSummaryResponse::from).toList();
    }
}