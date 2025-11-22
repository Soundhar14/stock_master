package com.company.stock_master.orders.delivery.entity;

import com.company.stock_master.master.product.Product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "delivery_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id", nullable = false)
    private Delivery delivery;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private long quantity;
}
