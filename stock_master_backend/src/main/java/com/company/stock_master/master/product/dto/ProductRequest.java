package com.company.stock_master.master.product.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductRequest {
    
    private String name;
    private String sku;
    private long categoryId;
    private double cost;
    private String unit;
}
