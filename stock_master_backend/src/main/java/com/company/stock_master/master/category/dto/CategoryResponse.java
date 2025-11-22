package com.company.stock_master.master.category.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CategoryResponse {
    
    private long id;
    private String name;
    
}
