package com.company.stock_master.master.product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
     boolean existsByName(String name);
      boolean existsBySku(String sku);
}
