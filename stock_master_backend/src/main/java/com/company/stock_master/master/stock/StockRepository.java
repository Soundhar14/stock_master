package com.company.stock_master.master.stock;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByWarehouseIdAndLocationIdAndProductId(
            Long warehouseId,
            Long locationId,
            Long productId);

}
