package com.company.stock_master.master.stock.service;

import java.util.List;

import com.company.stock_master.master.stock.dto.StockRequest;
import com.company.stock_master.master.stock.dto.StockResponse;

public interface StockService {

    public StockResponse createStock(StockRequest request);

    public StockResponse updateStock(Long id, StockRequest request);

    public StockResponse getById(Long id);

    public List<StockResponse> getAll();

    public void deleteById(Long id);

    public void reduceStock(Long warehouseId, Long locationId, Long productId, long qty);
    
}
