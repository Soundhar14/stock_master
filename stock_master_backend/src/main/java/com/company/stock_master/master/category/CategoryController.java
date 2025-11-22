package com.company.stock_master.master.category;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.company.stock_master.master.category.dto.CategoryRequest;
import com.company.stock_master.master.category.dto.CategoryResponse;
import com.company.stock_master.master.category.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categories")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CategoryRequest request) {
        CategoryResponse data = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Category created successfully",
                "data", data
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {

        CategoryResponse data = categoryService.patchCategory(id, request);
        return ResponseEntity.ok(Map.of(
                "message", "Category updated successfully",
                "data", data
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<CategoryResponse> data = categoryService.getAll();
        return ResponseEntity.ok(Map.of(
                "message", "Categories fetched successfully",
                "data", data
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        CategoryResponse data = categoryService.getById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Category fetched successfully",
                "data", data
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Category deleted successfully",
                "id", id
        ));
    }
}
