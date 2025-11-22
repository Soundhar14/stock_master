package com.company.stock_master.master.warehouse.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponse {

    private long id;
    private String shortCode;
    private String name;
    private String address;
    private String city;

    private List<LocationResponseDTO> locations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationResponseDTO {
        private Long id;
        private String name;
    }
}
