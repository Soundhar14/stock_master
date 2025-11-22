package com.company.stock_master.master.stock;

import com.company.stock_master.master.product.Product;
import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    private long onHand;
    private long reserved;
    private long freeToUse;
}
