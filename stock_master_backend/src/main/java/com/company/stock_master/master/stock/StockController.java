package com.company.stock_master.master.stock;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.master.stock.dto.StockRequest;
import com.company.stock_master.master.stock.dto.StockResponse;
import com.company.stock_master.master.stock.service.StockService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager/stocks")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody StockRequest request) {
        StockResponse data = stockService.createStock(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Stock created successfully",
                "data", data
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestBody StockRequest request) {

        StockResponse data = stockService.updateStock(id, request);
        return ResponseEntity.ok(Map.of(
                "message", "Stock updated successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<StockResponse> data = stockService.getAll();
        return ResponseEntity.ok(Map.of(
                "message", "Stock entries fetched successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        StockResponse data = stockService.getById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Stock entry fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        stockService.deleteById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Stock entry deleted successfully",
                "id", id
        ));
    }
}
