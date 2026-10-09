package com.studentmanagement.backend.controller;

import com.studentmanagement.backend.model.PaymentSlip;
import com.studentmanagement.backend.model.StudentFee;
import com.studentmanagement.backend.service.PaymentManagementService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentManagementService paymentService = new PaymentManagementService();
    private static final String UPLOAD_DIR = "uploads/slips/";

    @GetMapping("/fees/{studentId}")
    public ResponseEntity<List<StudentFee>> getStudentFees(@PathVariable String studentId) {
        return ResponseEntity.ok(paymentService.getStudentFeeStatus(studentId));
    }

    @GetMapping("/slips/{studentId}")
    public ResponseEntity<List<PaymentSlip>> getStudentSlips(
            @PathVariable String studentId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(paymentService.getPaymentSlips(studentId, status));
    }

    @PostMapping("/submit-slip")
    public ResponseEntity<?> submitSlip(
            @RequestParam("feeId") int feeId,
            @RequestParam("studentId") String studentId,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("reference") String reference,
            @RequestParam("file") MultipartFile file) {

        try {
            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String savedFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = Paths.get(UPLOAD_DIR + savedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            PaymentSlip slip = new PaymentSlip();
            slip.setFeeId(feeId);
            slip.setStudentId(studentId);
            slip.setAmount(amount);
            slip.setPaymentReference(reference);
            slip.setSlipFilePath(targetPath.toString());

            boolean success = paymentService.submitPaymentSlip(slip);
            return success ? ResponseEntity.ok("Slip submitted") : ResponseEntity.badRequest().body("Failed");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Upload error: " + e.getMessage());
        }
    }

    // ===== NEW: admin approves or rejects a slip (updates paymentslips AND student_fees) =====
    @PostMapping("/verify")
    public ResponseEntity<?> verifySlip(
            @RequestParam int slipId,
            @RequestParam int feeId,
            @RequestParam BigDecimal amount,
            @RequestParam String status,          // APPROVED or REJECTED
            @RequestParam String staffId,
            @RequestParam(required = false, defaultValue = "") String remarks) {

        if (!"APPROVED".equalsIgnoreCase(status) && !"REJECTED".equalsIgnoreCase(status)) {
            return ResponseEntity.badRequest().body("Status must be APPROVED or REJECTED");
        }
        boolean ok = paymentService.processSlipVerification(slipId, feeId, amount, status.toUpperCase(), staffId, remarks);
        return ok ? ResponseEntity.ok("Slip " + status.toUpperCase()) : ResponseEntity.badRequest().body("Failed");
    }

    // ===== NEW: lets the admin open the uploaded slip image/PDF =====
    @GetMapping("/slip-file")
    public ResponseEntity<Resource> slipFile(@RequestParam String name) throws IOException {
        Path path = Paths.get(UPLOAD_DIR).resolve(Paths.get(name).getFileName().toString());
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        String type = Files.probeContentType(path);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(type != null ? type : "application/octet-stream"))
                .body(new FileSystemResource(path));
    }
}
