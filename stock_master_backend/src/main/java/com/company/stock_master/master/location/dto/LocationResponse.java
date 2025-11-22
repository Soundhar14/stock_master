package com.company.stock_master.master.location.dto;

import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class LocationResponse {
    
    private long id;
    private String name;
    private List<WarehouseResponseDTO> warehouse;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WarehouseResponseDTO {
        private Long id;
        private String name;
    }

}
