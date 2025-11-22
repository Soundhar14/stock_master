package com.company.stock_master.orders.delivery.service;

import java.util.List;

import com.company.stock_master.orders.delivery.dto.DeliveryRequest;
import com.company.stock_master.orders.delivery.dto.DeliveryResponse;

public interface DeliveryService {
    
    public DeliveryResponse createDelivery(DeliveryRequest request);

    public DeliveryResponse updateStatus(Long id, String status);

    public DeliveryResponse getById(Long id);

    public List<DeliveryResponse> getAll();

    public void delete(Long id);

}
