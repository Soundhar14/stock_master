package com.company.stock_master.master.location;

import jakarta.persistence.*;
import lombok.*;
import com.company.stock_master.master.warehouse.Warehouse;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Many locations belong to one warehouse
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;
}
