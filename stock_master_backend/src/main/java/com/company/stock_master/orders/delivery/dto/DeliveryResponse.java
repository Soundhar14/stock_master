package com.company.stock_master.orders.delivery.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {

    private Long id;
    private String reference;
    private String status;

    private List<WarehouseDTO> warehouse;

    private List<LocationDTO> location;

    private Long locationId;
    private String locationName;

    private String deliveryAddress;
    private Long responsibleUserId;

    private LocalDate scheduledDate;

    private String customerName;
    private String customerContact;

    private List<DeliveryItemResponse> items;

    private String notes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryItemResponse {
        private Long productId;
        private String productName;
        private Long quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WarehouseDTO {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDTO {
        private Long id;
        private String name;
    }

}
