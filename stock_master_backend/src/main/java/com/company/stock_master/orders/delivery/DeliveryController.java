package com.company.stock_master.orders.delivery;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.orders.delivery.dto.DeliveryRequest;
import com.company.stock_master.orders.delivery.dto.DeliveryResponse;
import com.company.stock_master.orders.delivery.service.DeliveryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager/deliveries")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody DeliveryRequest request) {
        DeliveryResponse data = deliveryService.createDelivery(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Delivery created successfully",
                "data", data
        ));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        DeliveryResponse data = deliveryService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of(
                "message", "Delivery status updated successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<DeliveryResponse> data = deliveryService.getAll();
        return ResponseEntity.ok(Map.of(
                "message", "Deliveries fetched successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        DeliveryResponse data = deliveryService.getById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Delivery fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        deliveryService.delete(id);
        return ResponseEntity.ok(Map.of(
                "message", "Delivery deleted successfully",
                "id", id
        ));
    }
}
