import java.time.LocalDate;

public class Staff {
    private int staffId;
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;
    private String address;
    private String position;
    private String staffType;
    private LocalDate dateJoined;
    private String status;

    // Constructors
    public Staff() {
        this.status = "Active"; // Default value matching DB schema
    }

    public Staff(String firstName, String lastName, String email, String telephone,
                 String address, String position, String staffType, LocalDate dateJoined) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.address = address;
        this.position = position;
        this.staffType = staffType;
        this.dateJoined = dateJoined;
        this.status = "Active";
    }

    // Getters and Setters
    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getStaffType() { return staffType; }
    public void setStaffType(String staffType) { this.staffType = staffType; }

    public LocalDate getDateJoined() { return dateJoined; }
    public void setDateJoined(LocalDate dateJoined) { this.dateJoined = dateJoined; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}