package com.company.stock_master.master.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "warehouse")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String shortCode;

    @Column(nullable = false, unique = true)
    private String name;

    private String address;

    private String city;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "warehouse_id") // FK in location table
    private List<Location> locations;

    @Builder.Default
    private boolean isActive = true;
}
