package entity;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "LEAVE_REQUESTS")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer leaveId;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)

    private Staff staff;

    private String leaveType;
    private LocalDate startDate;

    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer totalDays;

    private String reason;

    private String status;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private Staff approvedBy;

    private LocalDateTime approvedAt;
    private LocalDateTime appliedAt;

    // getters/setters
}
