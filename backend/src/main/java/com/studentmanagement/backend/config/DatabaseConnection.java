package com.studentmanagement.backend.config;

import java.sql.Connection;            //link to the MySQL database
import java.sql.DriverManager;         //manages database drivers and creates connections
import java.sql.SQLException;          //Handles database access errors

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/school_lms_db";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // change to your MySQL password[cite: 2]
    private static Connection connection = null;

    private DatabaseConnection() {}

    //Checks if connection has not yet been initialized yet
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
        }
        return connection;
    }
}
