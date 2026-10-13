package com.studentmanagement.backend.model;

public class SalaryCalculation {

    private int staffId;
    private String staffName;
    private double baseSalary;
    private double allowancePercent;
    private double allowances;
    private double deductionPercent;
    private double deductions;
    private double netSalary;

    public SalaryCalculation() {
    }

    public int getStaffId() { return staffId; }
    public void setStaffId(int staffId) { this.staffId = staffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }

    public double getAllowancePercent() { return allowancePercent; }
    public void setAllowancePercent(double allowancePercent) { this.allowancePercent = allowancePercent; }

    public double getAllowances() { return allowances; }
    public void setAllowances(double allowances) { this.allowances = allowances; }

    public double getDeductionPercent() { return deductionPercent; }
    public void setDeductionPercent(double deductionPercent) { this.deductionPercent = deductionPercent; }

    public double getDeductions() { return deductions; }
    public void setDeductions(double deductions) { this.deductions = deductions; }

    public double getNetSalary() { return netSalary; }
    public void setNetSalary(double netSalary) { this.netSalary = netSalary; }
}
