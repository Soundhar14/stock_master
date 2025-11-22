package com.company.stock_master.master.warehouse;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    boolean existsByShortCode(String shortCode);

    boolean existsByName(String name);

    Optional<Warehouse> findByShortCode(String shortCode);
    
}
