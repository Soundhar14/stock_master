package com.company.stock_master.master.stock.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class StockRequest {
    
    private Long productId;
    private Long locationId;
    private Long warehouseId;
    private long onHand;
    private long reserved;
    private long freeToUse;
    
}
