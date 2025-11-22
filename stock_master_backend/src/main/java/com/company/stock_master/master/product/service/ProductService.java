package com.company.stock_master.master.product.service;

import java.util.List;

import com.company.stock_master.master.product.dto.ProductRequest;
import com.company.stock_master.master.product.dto.ProductResponse;

public interface ProductService {

    public ProductResponse createProduct(ProductRequest request);
    
    public ProductResponse patchProduct(Long id, ProductRequest request);

    public ProductResponse getById(Long id);

    public List<ProductResponse> getAll();

    public void deleteById(Long id);

}
