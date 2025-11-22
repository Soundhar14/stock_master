package com.company.stock_master.master.location.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class LocationRequest {
    
    private String name;
    private Long warehouseId;
    
}
