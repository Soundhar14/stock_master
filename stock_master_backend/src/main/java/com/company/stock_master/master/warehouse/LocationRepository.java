package com.company.stock_master.master.warehouse;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.stock_master.master.warehouse.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    
}
