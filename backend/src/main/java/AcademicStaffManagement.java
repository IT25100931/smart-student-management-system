package com.studentmanagement.backend;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;

public class AcademicStaffManagement {

    // ==============================
    // DATABASE CONNECTION
    // ==============================

    private static final String URL = "jdbc:mysql://localhost:3306/school_lms_db";
    private static final String USER = "root";
    private static final String PASSWORD = "YOUR_PASSWORD";

    public static Connection connectDatabase() {
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            System.out.println("Database connection failed: " + e.getMessage());
            return null;
        }
    }

    // Reads a whole number; returns null if the input is not a number
    private static Integer readInt(Scanner scanner, String prompt) {
        System.out.print(prompt);
        try {
            return Integer.parseInt(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }


    // ==============================
    // FUNCTION 1
    // VIEW CLASS & SUBJECT DETAILS
    // ==============================

    public static void viewClassSubjectDetails(Scanner scanner) {

        System.out.println("\n====================================");
        System.out.println("     VIEW CLASS & SUBJECT DETAILS");
        System.out.println("====================================");

        Integer staffId = readInt(scanner, "Enter Staff ID: ");
        if (staffId == null) {
            System.out.println("Invalid Staff ID.");
            return;
        }

        String sql = """
                SELECT staff_id,
                       first_name,
                       last_name,
                       assigned_class,
                       Subject_Assigned
                FROM STAFF
                WHERE staff_id = ?
                """;

        Connection connection = connectDatabase();
        if (connection == null) {
            return;
        }

        try (connection;
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {
                    System.out.println("\nStaff ID       : " + result.getInt("staff_id"));
                    System.out.println("Name           : "
                            + result.getString("first_name") + " "
                            + result.getString("last_name"));
                    System.out.println("Assigned Class : " + result.getString("assigned_class"));
                    System.out.println("Subject        : " + result.getString("Subject_Assigned"));
                } else {
                    System.out.println("\nStaff member not found.");
                }
            }

        } catch (SQLException e) {
            System.out.println("\nError retrieving class and subject details.");
            e.printStackTrace();
        }
    }


    // ==============================
    // FUNCTION 2
    // VIEW SALARY DETAILS
    // ==============================

    public static void viewSalaryDetails(Scanner scanner) {

        System.out.println("\n====================================");
        System.out.println("          VIEW SALARY DETAILS");
        System.out.println("====================================");

        Integer staffId = readInt(scanner, "Enter Staff ID: ");
        if (staffId == null) {
            System.out.println("Invalid Staff ID.");
            return;
        }

        String sql = """
                SELECT salary_id,
                       staff_id,
                       salary_month,
                       salary_year,
                       base_salary,
                       allowances,
                       deductions,
                       net_salary,
                       payment_date,
                       payment_status
                FROM STAFF_SALARY
                WHERE staff_id = ?
                ORDER BY salary_year DESC, salary_month DESC
                """;

        Connection connection = connectDatabase();
        if (connection == null) {
            return;
        }

        try (connection;
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);

            try (ResultSet result = statement.executeQuery()) {

                boolean found = false;

                while (result.next()) {
                    found = true;

                    System.out.println("\n------------------------------------");
                    System.out.println("Salary ID      : " + result.getInt("salary_id"));
                    System.out.println("Month          : " + result.getInt("salary_month"));
                    System.out.println("Year           : " + result.getInt("salary_year"));
                    System.out.println("Base Salary    : " + result.getDouble("base_salary"));
                    System.out.println("Allowances     : " + result.getDouble("allowances"));
                    System.out.println("Deductions     : " + result.getDouble("deductions"));
                    System.out.println("Net Salary     : " + result.getDouble("net_salary"));
                    System.out.println("Payment Date   : " + result.getDate("payment_date"));
                    System.out.println("Payment Status : " + result.getString("payment_status"));
                }

                if (!found) {
                    System.out.println("\nNo salary records found.");
                }
            }

        } catch (SQLException e) {
            System.out.println("\nError retrieving salary details.");
            e.printStackTrace();
        }
    }


    // ==============================
    // FUNCTION 3
    // REQUEST LEAVE / DAY OFF
    // ==============================

    public static void requestLeave(Scanner scanner) {

        System.out.println("\n====================================");
        System.out.println("       REQUEST LEAVE / DAY OFF");
        System.out.println("====================================");

        Integer staffId = readInt(scanner, "Enter Staff ID: ");
        if (staffId == null) {
            System.out.println("Invalid Staff ID.");
            return;
        }

        System.out.print("Enter Leave Type (Leave / Day Off): ");
        String leaveType = scanner.nextLine().trim();

        System.out.print("Enter Start Date (YYYY-MM-DD): ");
        String startDateText = scanner.nextLine().trim();

        System.out.print("Enter End Date (YYYY-MM-DD): ");
        String endDateText = scanner.nextLine().trim();

        Date startDate;
        Date endDate;

        try {
            startDate = Date.valueOf(startDateText);
            endDate = Date.valueOf(endDateText);
        } catch (IllegalArgumentException e) {
            System.out.println("\nInvalid date format. Please use YYYY-MM-DD.");
            return;
        }

        if (endDate.before(startDate)) {
            System.out.println("\nEnd date cannot be earlier than the start date.");
            return;
        }

        Integer totalDays = readInt(scanner, "Enter Total Days: ");
        if (totalDays == null || totalDays <= 0) {
            System.out.println("Invalid number of days.");
            return;
        }

        System.out.print("Enter Reason: ");
        String reason = scanner.nextLine().trim();

        String sql = """
                INSERT INTO LEAVE_REQUESTS
                (staff_id, leave_type, start_date, end_date,
                 total_days, reason, status)
                VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
                """;

        Connection connection = connectDatabase();
        if (connection == null) {
            return;
        }

        try (connection;
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, staffId);
            statement.setString(2, leaveType);
            statement.setDate(3, startDate);
            statement.setDate(4, endDate);
            statement.setInt(5, totalDays);
            statement.setString(6, reason);

            if (statement.executeUpdate() > 0) {
                System.out.println("\nLeave request submitted successfully!");
                System.out.println("Status: PENDING");
            } else {
                System.out.println("\nLeave request could not be submitted.");
            }

        } catch (SQLException e) {
            System.out.println("\nError submitting leave request.");
            e.printStackTrace();
        }
    }


    // ==============================
    // MAIN MENU
    // ==============================

    public static void main(String[] args) {

        try (Scanner scanner = new Scanner(System.in)) {

            System.out.println("========================================");
            System.out.println("     ACADEMIC STAFF MANAGEMENT SYSTEM");
            System.out.println("========================================");

            // Test the database connection once at start-up
            Connection testConnection = connectDatabase();

            if (testConnection == null) {
                System.out.println("\nPlease check your MySQL server, database, username and password.");
                return;
            }

            try {
                testConnection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }

            int choice;

            do {
                System.out.println("\n========================================");
                System.out.println("                 MENU");
                System.out.println("========================================");
                System.out.println("1. View Class & Subject Details");
                System.out.println("2. View Salary Details");
                System.out.println("3. Request Leave / Day Off");
                System.out.println("4. Exit");
                System.out.println("========================================");

                Integer input = readInt(scanner, "Enter your choice: ");
                choice = (input == null) ? 0 : input;

                switch (choice) {
                    case 1 -> viewClassSubjectDetails(scanner);
                    case 2 -> viewSalaryDetails(scanner);
                    case 3 -> requestLeave(scanner);
                    case 4 -> System.out.println("\nThank you for using the system!");
                    default -> System.out.println("\nInvalid choice. Please try again.");
                }

            } while (choice != 4);
        }
    }
}