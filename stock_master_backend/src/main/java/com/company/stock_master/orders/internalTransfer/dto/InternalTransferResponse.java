package com.company.stock_master.orders.internalTransfer.dto;

import java.time.LocalDateTime;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternalTransferResponse {

    private long id;
    private List<ProductDTO> product;
    private List<WareHouseDTO> sourceWarehouse;
    private List<LocationDTO> sourceLocation;
    private List<WareHouseDTO> destinationWarehouse;
    private List<LocationDTO> destinationLocation;
    private long quantity;
    private String status; // PENDING, COMPLETED
    private LocalDateTime transferDate;
    private String reference;
    private String notes;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WareHouseDTO {
        private long id;
        private String name;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ProductDTO {
        private long id;
        private String name;
        private String sku;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class LocationDTO {
        private long id;
        private String name;
    }
}
