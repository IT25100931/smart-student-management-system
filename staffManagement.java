import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// ==========================================
// 1. MODEL CLASS (Matches staff table)
// ==========================================
class Staff {
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

    public Staff() {
        this.status = "Active";
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

// ==========================================
// 2. DATABASE UTILITY CLASS
// ==========================================
class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/Staff_Management";
    private static final String USER = "root";
    private static final String PASSWORD = "your_password"; // Replace with your MySQL password

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

// ==========================================
// 3. DAO INTERFACE & IMPLEMENTATION
// ==========================================
interface StaffDAO {
    boolean addStaff(Staff staff);
    List<Staff> getAllStaff();
}

class StaffDAOImpl implements StaffDAO {

    @Override
    public boolean addStaff(Staff staff) {
        String query = "INSERT INTO staff (first_name, last_name, email, telephone, address, position, staff_type, date_joined, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, staff.getFirstName());
            stmt.setString(2, staff.getLastName());
            stmt.setString(3, staff.getEmail());
            stmt.setString(4, staff.getTelephone());
            stmt.setString(5, staff.getAddress());
            stmt.setString(6, staff.getPosition());
            stmt.setString(7, staff.getStaffType());
            stmt.setDate(8, Date.valueOf(staff.getDateJoined()));
            stmt.setString(9, staff.getStatus());

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            if (e.getErrorCode() == 1062) { // Duplicate email error
                System.out.println("\nERROR: Email address already exists.");
            } else {
                e.printStackTrace();
            }
            return false;
        }
    }

    @Override
    public List<Staff> getAllStaff() {
        List<Staff> staffList = new ArrayList<>();
        String query = "SELECT * FROM staff";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Staff staff = new Staff();
                staff.setStaffId(rs.getInt("staff_id"));
                staff.setFirstName(rs.getString("first_name"));
                staff.setLastName(rs.getString("last_name"));
                staff.setEmail(rs.getString("email"));
                staff.setTelephone(rs.getString("telephone"));
                staff.setAddress(rs.getString("address"));
                staff.setPosition(rs.getString("position"));
                staff.setStaffType(rs.getString("staff_type"));

                Date date = rs.getDate("date_joined");
                if (date != null) {
                    staff.setDateJoined(date.toLocalDate());
                }
                staff.setStatus(rs.getString("status"));

                staffList.add(staff);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return staffList;
    }
}

// ==========================================
// 4. MAIN DRIVER CLASS
// ==========================================
public class StaffManagement {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StaffDAO staffDAO = new StaffDAOImpl();

        System.out.println("=== Enter Staff Details ===");

        System.out.print("First Name: ");
        String firstName = scanner.nextLine();

        System.out.print("Last Name: ");
        String lastName = scanner.nextLine();

        System.out.print("Email: ");
        String email = scanner.nextLine();

        System.out.print("Telephone: ");
        String telephone = scanner.nextLine();

        System.out.print("Address: ");
        String address = scanner.nextLine();

        System.out.print("Position: ");
        String position = scanner.nextLine();

        System.out.print("Staff Type: ");
        String staffType = scanner.nextLine();

        Staff newStaff = new Staff(firstName, lastName, email, telephone, address, position, staffType, LocalDate.now());

        if (staffDAO.addStaff(newStaff)) {
            System.out.println("\nSUCCESS: Staff member added successfully!");
        } else {
            System.out.println("\nFAILED: Could not add staff member.");
        }

        scanner.close();
    }
}