package com.company.stock_master.master.product;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.master.product.dto.ProductRequest;
import com.company.stock_master.master.product.dto.ProductResponse;
import com.company.stock_master.master.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody ProductRequest request) {
        ProductResponse data = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Product created successfully",
                "data", data
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        ProductResponse data = productService.patchProduct(id, request);
        return ResponseEntity.ok(Map.of(
                "message", "Product updated successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<ProductResponse> data = productService.getAll();
        return ResponseEntity.ok(Map.of(
                "message", "Products fetched successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        ProductResponse data = productService.getById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Product fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Product deleted successfully",
                "id", id
        ));
    }
}
