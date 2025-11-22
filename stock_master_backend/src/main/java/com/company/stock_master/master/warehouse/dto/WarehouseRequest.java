package com.company.stock_master.master.warehouse.dto;

import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class WarehouseRequest {
    
    private String shortCode;
    private String name;
    private String address;
    private String city;
    
    private List<Long> locationIds;
}
