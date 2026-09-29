package com.studentmanagement.backend;

import com.studentmanagement.backend.model.PaymentSlip;
import com.studentmanagement.backend.model.StudentFee;
import com.studentmanagement.backend.service.PaymentManagementService;

import java.math.BigDecimal;
import java.util.List;

public class PaymentModuleRunner {

    public static void main(String[] args) {
        PaymentManagementService service = new PaymentManagementService();
        String testStudent = "STU1001";

        System.out.println("=================================================");
        System.out.println("   MEMBER 3: PAYMENT MANAGEMENT BACKEND TEST     ");
        System.out.println("=================================================\n");

        // -------------------------------------------------------------
        // TEST 1: FUNCTION 6 - Current Status & Outstanding Balance
        // -------------------------------------------------------------
        System.out.println("--- [TEST 1] Fetching Payment Status for " + testStudent + " ---");
        List fees = service.getStudentFeeStatus(testStudent);
        for (StudentFee f : fees) {
            System.out.println("Fee ID: " + f.getFeeId() +
                    " | Type: " + f.getFeeType() +
                    " | Total: " + f.getTotalAmount() +
                    " | Paid: " + f.getPaidAmount() +
                    " | Balance: " + f.getBalance() +
                    " | Status: " + f.getPaymentStatus());
        }

        BigDecimal totalBalance = service.calculateTotalOutstandingBalance(testStudent);
        System.out.println(">> Total Calculated Outstanding Balance: " + totalBalance + "\n");

        // -------------------------------------------------------------
        // TEST 2: FUNCTION 7 - Slip Submission with File Path Reference
        // -------------------------------------------------------------
        System.out.println("--- [TEST 2] Submitting a Payment Slip ---");
        String uniqueRef = "REF-" + System.currentTimeMillis(); // Generates unique reference code
        PaymentSlip newSlip = new PaymentSlip();
        newSlip.setFeeId(2);
        newSlip.setStudentId(testStudent);
        newSlip.setPaymentReference(uniqueRef);
        newSlip.setAmount(new BigDecimal("5000.00"));
        newSlip.setSlipFilePath("/uploads/slips/" + uniqueRef + ".pdf");

        boolean isSubmitted = service.submitPaymentSlip(newSlip);
        System.out.println(">> Slip Submitted Successfully: " + isSubmitted);
        System.out.println(">> Reference ID: " + uniqueRef + "\n");

        // -------------------------------------------------------------
        // TEST 3: FUNCTION 8 - Record Viewing and Filtering
        // -------------------------------------------------------------
        System.out.println("--- [TEST 3] Viewing Payment Slips for " + testStudent + " ---");
        List slips = service.getPaymentSlips(testStudent, null);
        for (PaymentSlip s : slips) {
            System.out.println("Slip ID: " + s.getSlipId() +
                    " | Ref: " + s.getPaymentReference() +
                    " | Amount: " + s.getAmount() +
                    " | File Path: " + s.getSlipFilePath() +
                    " | Status: " + s.getVerificationStatus());
        }
        System.out.println("\n=================================================");
        System.out.println("             TEST SUITE FINISHED                 ");
        System.out.println("=================================================");
    }
}