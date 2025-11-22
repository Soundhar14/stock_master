    package com.company.stock_master.master.product.dto;

    import java.util.List;

    import lombok.*;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder

    public class ProductResponse {
        
        private long id;
        private String name;
        private String sku;
        private List<CategoryResponseDTO> category;
        private double cost;
        private String unit;

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        @Builder
        public static class CategoryResponseDTO {
            private long id;
            private String name;
        }

    }
