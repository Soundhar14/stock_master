package com.company.stock_master.master.warehouse;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.master.warehouse.dto.WarehouseRequest;
import com.company.stock_master.master.warehouse.dto.WarehouseResponse;
import com.company.stock_master.master.warehouse.service.WarehouseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/warehouses")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody WarehouseRequest request) {
        WarehouseResponse data = warehouseService.createWarehouse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Warehouse created successfully",
                "data", data
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchWarehouse(
            @PathVariable Long id,
            @RequestBody WarehouseRequest request) {

        WarehouseResponse data = warehouseService.patchWarehouse(id, request);
        return ResponseEntity.ok(Map.of(
                "message", "Warehouse updated successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<WarehouseResponse> data = warehouseService.getAll();
        return ResponseEntity.ok(Map.of(
                "message", "Warehouses fetched successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        WarehouseResponse data = warehouseService.getById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Warehouse fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        warehouseService.deleteById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Warehouse deleted successfully",
                "id", id
        ));
    }
}
