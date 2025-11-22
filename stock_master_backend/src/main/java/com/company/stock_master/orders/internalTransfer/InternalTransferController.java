package com.company.stock_master.orders.internalTransfer;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.orders.internalTransfer.dto.InternalTransferRequest;
import com.company.stock_master.orders.internalTransfer.dto.InternalTransferResponse;
import com.company.stock_master.orders.internalTransfer.service.InternalTransferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/internal-transfers")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class InternalTransferController {

    private final InternalTransferService internalTransferService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTransfer(@RequestBody InternalTransferRequest request) {
        InternalTransferResponse data = internalTransferService.createTransfer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Internal transfer created successfully",
                "data", data
        ));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> completeTransfer(@PathVariable Long id) {
        InternalTransferResponse data = internalTransferService.completeTransfer(id);
        return ResponseEntity.ok(Map.of(
                "message", "Internal transfer completed successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTransferById(@PathVariable Long id) {
        InternalTransferResponse data = internalTransferService.getTransferById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Internal transfer fetched successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransfers() {
        List<InternalTransferResponse> data = internalTransferService.getAllTransfers();
        return ResponseEntity.ok(Map.of(
                "message", "All internal transfers fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTransfer(@PathVariable Long id) {
        internalTransferService.delete(id);
        return ResponseEntity.ok(Map.of(
                "message", "Internal transfer deleted successfully",
                "id", id
        ));
    }
}
