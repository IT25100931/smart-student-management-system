
import java.sql.*;
        import java.util.Scanner;

public class AcademicStaffManagement {

    // ==============================
    // DATABASE CONNECTION
    // ==============================

    private static final String URL =
            "jdbc:mysql://localhost:3306/school_lms_db";

    private static final String USER = "root";

    private static final String PASSWORD = "YOUR_PASSWORD";


    public static Connection connectDatabase() {

        try {
            Connection connection =
                    DriverManager.getConnection(URL, USER, PASSWORD);

            return connection;

        } catch (SQLException e) {

            System.out.println("Database connection failed!");
            e.printStackTrace();

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

        System.out.print("Enter Staff ID: ");
        String staffId = scanner.nextLine();

        String sql = """
                SELECT staff_id,
                       first_name,
                       last_name,
                       assigned_class,
                       Subject_Assigned
                FROM STAFF
                WHERE staff_id = ?
                """;

        try (
                Connection connection = connectDatabase();
                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(1, staffId);

            ResultSet result = statement.executeQuery();

            if (result.next()) {

                System.out.println("\nStaff ID       : "
                        + result.getString("staff_id"));

                System.out.println("Name           : "
                        + result.getString("first_name")
                        + " "
                        + result.getString("last_name"));

                System.out.println("Assigned Class : "
                        + result.getString("assigned_class"));

                System.out.println("Subject        : "
                        + result.getString("Subject_Assigned"));

            } else {

                System.out.println("\nStaff member not found.");
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

        System.out.print("Enter Staff ID: ");
        int staffId;

        try {

            staffId = Integer.parseInt(scanner.nextLine());

        } catch (NumberFormatException e) {

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


        try (
                Connection connection = connectDatabase();
                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, staffId);

            ResultSet result = statement.executeQuery();

            boolean found = false;

            while (result.next()) {

                found = true;

                System.out.println("\n------------------------------------");

                System.out.println("Salary ID      : "
                        + result.getInt("salary_id"));

                System.out.println("Month          : "
                        + result.getInt("salary_month"));

                System.out.println("Year           : "
                        + result.getInt("salary_year"));

                System.out.println("Base Salary    : "
                        + result.getDouble("base_salary"));

                System.out.println("Allowances     : "
                        + result.getDouble("allowances"));

                System.out.println("Deductions     : "
                        + result.getDouble("deductions"));

                System.out.println("Net Salary     : "
                        + result.getDouble("net_salary"));

                System.out.println("Payment Date   : "
                        + result.getDate("payment_date"));

                System.out.println("Payment Status : "
                        + result.getString("payment_status"));
            }

            if (!found) {

                System.out.println("\nNo salary records found.");
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


        System.out.print("Enter Staff ID: ");
        int staffId;

        try {

            staffId = Integer.parseInt(scanner.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Invalid Staff ID.");
            return;
        }


        System.out.print("Enter Leave Type (Leave / Day Off): ");
        String leaveType = scanner.nextLine();


        System.out.print("Enter Start Date (YYYY-MM-DD): ");
        String startDate = scanner.nextLine();


        System.out.print("Enter End Date (YYYY-MM-DD): ");
        String endDate = scanner.nextLine();


        System.out.print("Enter Total Days: ");
        int totalDays;

        try {

            totalDays = Integer.parseInt(scanner.nextLine());

        } catch (NumberFormatException e) {

            System.out.println("Invalid number of days.");
            return;
        }


        System.out.print("Enter Reason: ");
        String reason = scanner.nextLine();


        String sql = """
                INSERT INTO LEAVE_REQUESTS
                (
                    staff_id,
                    leave_type,
                    start_date,
                    end_date,
                    total_days,
                    reason,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
                """;


        try (
                Connection connection = connectDatabase();
                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, staffId);
            statement.setString(2, leaveType);
            statement.setDate(3, Date.valueOf(startDate));
            statement.setDate(4, Date.valueOf(endDate));
            statement.setInt(5, totalDays);
            statement.setString(6, reason);


            int rowsInserted = statement.executeUpdate();


            if (rowsInserted > 0) {

                System.out.println("\nLeave request submitted successfully!");
                System.out.println("Status: PENDING");

            } else {

                System.out.println("\nLeave request could not be submitted.");
            }

        } catch (IllegalArgumentException e) {

            System.out.println(
                    "\nInvalid date format. Please use YYYY-MM-DD."
            );

        } catch (SQLException e) {

            System.out.println("\nError submitting leave request.");
            e.printStackTrace();
        }
    }


    // ==============================
    // MAIN MENU
    // ==============================

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.println("========================================");
        System.out.println("     ACADEMIC STAFF MANAGEMENT SYSTEM");
        System.out.println("========================================");


        // Test database connection

        Connection testConnection = connectDatabase();

        if (testConnection == null) {

            System.out.println(
                    "\nPlease check your MySQL server, database, username and password."
            );

            scanner.close();
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

            System.out.print("Enter your choice: ");


            try {

                choice = Integer.parseInt(scanner.nextLine());

            } catch (NumberFormatException e) {

                System.out.println("\nPlease enter a valid number.");
                choice = 0;
                continue;
            }


            switch (choice) {

                case 1:

                    viewClassSubjectDetails(scanner);
                    break;


                case 2:

                    viewSalaryDetails(scanner);
                    break;


                case 3:

                    requestLeave(scanner);
                    break;


                case 4:

                    System.out.println(
                            "\nThank you for using the system!"
                    );

                    break;


                default:

                    System.out.println(
                            "\nInvalid choice. Please try again."
                    );
            }

        } while (choice != 4);


        scanner.close();
    }
}