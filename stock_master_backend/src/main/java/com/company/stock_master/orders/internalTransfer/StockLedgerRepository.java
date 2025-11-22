package com.company.stock_master.orders.internalTransfer;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.stock_master.orders.internalTransfer.entity.StockLedger;

public interface StockLedgerRepository extends JpaRepository<StockLedger , Long> {
    
}
