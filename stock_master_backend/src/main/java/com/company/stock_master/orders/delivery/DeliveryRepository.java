package com.company.stock_master.orders.delivery;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.stock_master.orders.delivery.entity.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
}
