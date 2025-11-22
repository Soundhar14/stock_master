package com.company.stock_master.master.category.service;

import java.util.List;

import com.company.stock_master.master.category.dto.*;

public interface CategoryService {
 
    public CategoryResponse createCategory(CategoryRequest request);

    public CategoryResponse patchCategory(Long id, CategoryRequest request);

    public CategoryResponse getById(Long id);

    public List<CategoryResponse> getAll();

     public void deleteById(Long id);
     
}
