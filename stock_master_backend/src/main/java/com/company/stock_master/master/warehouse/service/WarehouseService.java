package com.company.stock_master.master.warehouse.service;

import java.util.List;

import com.company.stock_master.master.warehouse.dto.WarehouseRequest;
import com.company.stock_master.master.warehouse.dto.WarehouseResponse;

public interface WarehouseService {

    public WarehouseResponse createWarehouse(WarehouseRequest request);

    public WarehouseResponse patchWarehouse(Long id, WarehouseRequest request);

     public List<WarehouseResponse> getAll();

     public WarehouseResponse getById(Long id);

     public void deleteById(Long id);
     
}
