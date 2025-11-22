package com.company.stock_master.orders.delivery.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {

    private String reference;
    private String status;

    private Long warehouseId;
    private Long locationId;

    private String deliveryAddress;

    private Long responsibleUserId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate scheduledDate;

    private String customerName;
    private String customerContact;

    private List<DeliveryItemRequest> items;

    private String notes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
