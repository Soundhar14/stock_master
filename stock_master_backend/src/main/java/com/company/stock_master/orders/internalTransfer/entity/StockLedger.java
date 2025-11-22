package com.company.stock_master.orders.internalTransfer.entity;

import java.time.LocalDateTime;

import com.company.stock_master.master.product.Product;
import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = true)
    private Location location;

    private long quantityChanged;

    private String transactionType; // IN, OUT, TRANSFER

    private LocalDateTime transactionDate;

    private String reference;

    private String notes;
}
