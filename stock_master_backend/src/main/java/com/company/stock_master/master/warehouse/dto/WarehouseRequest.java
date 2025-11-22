package com.company.stock_master.master.warehouse.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseRequest {

    private String shortCode;
    private String name;
    private String address;
    private String city;
    private List<LocationRequestDTO> locations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationRequestDTO {
        private Long id;    
        private String name;
    }
}
