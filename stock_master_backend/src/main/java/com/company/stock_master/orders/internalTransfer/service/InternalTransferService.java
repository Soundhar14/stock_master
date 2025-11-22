package com.company.stock_master.orders.internalTransfer.service;

import java.util.List;

import com.company.stock_master.orders.internalTransfer.dto.InternalTransferRequest;
import com.company.stock_master.orders.internalTransfer.dto.InternalTransferResponse;

public interface InternalTransferService {

    public InternalTransferResponse createTransfer(InternalTransferRequest request);

     public InternalTransferResponse completeTransfer(Long id);

    public List<InternalTransferResponse> getAllTransfers();

    public InternalTransferResponse getTransferById(Long id);

    public void delete(Long id);

}
