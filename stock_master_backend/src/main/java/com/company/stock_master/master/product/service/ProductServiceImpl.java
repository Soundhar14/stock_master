package com.company.stock_master.master.product.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.master.product.*;
import com.company.stock_master.master.product.dto.*;
import com.company.stock_master.master.category.Category;
import com.company.stock_master.master.category.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateProductException("Product name already exists.");
        }
        if (productRepository.existsBySku(request.getSku())) {
            throw new DuplicateProductException("Product SKU already exists.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .category(category)
                .cost(request.getCost())
                .unit(request.getUnit())
                .build();

        product = productRepository.save(product);

        return mapToResponse(product);
    }

    @Override
    public ProductResponse patchProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        if (request.getName() != null && !request.getName().equalsIgnoreCase(product.getName())) {
            if (productRepository.existsByName(request.getName())) {
                throw new DuplicateProductException("Product name already exists.");
            }
            product.setName(request.getName());
        }

        if (request.getSku() != null && !request.getSku().equalsIgnoreCase(product.getSku())) {
            if (productRepository.existsBySku(request.getSku())) {
                throw new DuplicateProductException("Product SKU already exists.");
            }
            product.setSku(request.getSku());
        }

        if (request.getCategoryId() != 0) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        if (request.getCost() != 0) {
            product.setCost(request.getCost());
        }

        if (request.getUnit() != null) {
            product.setUnit(request.getUnit());
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSku(product.getSku());
        response.setCost(product.getCost());
        response.setUnit(product.getUnit());
        response.setCategory(List.of(
                new ProductResponse.CategoryResponseDTO(
                        product.getCategory().getId(),
                        product.getCategory().getName())));
        return response;
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public static class DuplicateProductException extends RuntimeException {
        public DuplicateProductException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String message) {
            super(message);
        }
    }
}
