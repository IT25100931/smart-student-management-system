package com.studentmanagement.backend.model;

public class SalarySummary {

    private int month;
    private int year;
    private int totalRecords;
    private int paidCount;
    private double paidTotal;
    private int pendingCount;
    private double pendingTotal;
    private double grandTotal;

    public SalarySummary() {
    }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public int getTotalRecords() { return totalRecords; }
    public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }

    public int getPaidCount() { return paidCount; }
    public void setPaidCount(int paidCount) { this.paidCount = paidCount; }

    public double getPaidTotal() { return paidTotal; }
    public void setPaidTotal(double paidTotal) { this.paidTotal = paidTotal; }

    public int getPendingCount() { return pendingCount; }
    public void setPendingCount(int pendingCount) { this.pendingCount = pendingCount; }

    public double getPendingTotal() { return pendingTotal; }
    public void setPendingTotal(double pendingTotal) { this.pendingTotal = pendingTotal; }

    public double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }
}
