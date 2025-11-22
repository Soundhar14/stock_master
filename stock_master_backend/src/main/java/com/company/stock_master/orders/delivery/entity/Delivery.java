package com.company.stock_master.orders.delivery.entity;

import java.time.LocalDate;
import java.util.List;

import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deliveries")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    private String deliveryAddress;

    private long responsibleUserId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate scheduledDate;

    private String customerName;

    private String customerContact;

    // ---------------------------
    // Items delivered (product + quantity)
    // ---------------------------
    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryItem> items;

    private String notes;
}
