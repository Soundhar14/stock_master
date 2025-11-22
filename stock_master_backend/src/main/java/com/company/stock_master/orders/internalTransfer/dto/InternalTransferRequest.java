package com.company.stock_master.orders.internalTransfer.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalTransferRequest {

    private Long productId;

    private Long sourceWarehouseId;
    private Long sourceLocationId; 

    private Long destinationWarehouseId;
    private Long destinationLocationId; 

    private long quantity;

    private String reference;

    private String notes; 
}
