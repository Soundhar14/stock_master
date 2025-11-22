package com.company.stock_master.master.stock.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class StockResponse {

    private long id;
    private List<WareHouseDTO> warehouse;
    private List<ProductDTO> product;
    private List<LocationDTO> location;
    private long onHand;
    private long reserved;
    private long freeToUse;

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
