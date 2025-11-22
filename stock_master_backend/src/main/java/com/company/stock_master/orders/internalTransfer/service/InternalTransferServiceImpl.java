package com.company.stock_master.orders.internalTransfer.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.master.product.ProductRepository;
import com.company.stock_master.master.stock.service.StockService;
import com.company.stock_master.master.warehouse.LocationRepository;
import com.company.stock_master.master.warehouse.WarehouseRepository;
import com.company.stock_master.orders.internalTransfer.dto.InternalTransferRequest;
import com.company.stock_master.orders.internalTransfer.dto.InternalTransferResponse;
import com.company.stock_master.orders.internalTransfer.entity.InternalTransfer;
import com.company.stock_master.orders.internalTransfer.entity.StockLedger;
import com.company.stock_master.orders.internalTransfer.InternalTransferRepository;
import com.company.stock_master.orders.internalTransfer.StockLedgerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InternalTransferServiceImpl implements InternalTransferService {

    private final InternalTransferRepository transferRepository;
    private final StockLedgerRepository ledgerRepository;
    private final StockService stockService;
    private final WarehouseRepository warehouseRepository;
    private final LocationRepository locationRepository;
    private final ProductRepository productRepository;

    @Override
    public InternalTransferResponse createTransfer(InternalTransferRequest request) {

        InternalTransfer transfer = InternalTransfer.builder()
                .product(productRepository.findById(request.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found: " + request.getProductId())))
                .sourceWarehouse(warehouseRepository.findById(request.getSourceWarehouseId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Source warehouse not found: " + request.getSourceWarehouseId())))
                .sourceLocation(request.getSourceLocationId() != null
                        ? locationRepository.findById(request.getSourceLocationId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                        "Source location not found: " + request.getSourceLocationId()))
                        : null)
                .destinationWarehouse(warehouseRepository.findById(request.getDestinationWarehouseId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "Destination warehouse not found: " + request.getDestinationWarehouseId())))
                .destinationLocation(request.getDestinationLocationId() != null
                        ? locationRepository.findById(request.getDestinationLocationId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                        "Destination location not found: " + request.getDestinationLocationId()))
                        : null)
                .quantity(request.getQuantity())
                .status("PENDING")
                .transferDate(LocalDateTime.now())
                .reference(request.getReference())
                .notes(request.getNotes())
                .build();

        InternalTransfer saved = transferRepository.save(transfer);
        return mapToResponse(saved);
    }

    @Override
    public InternalTransferResponse completeTransfer(Long id) {

        InternalTransfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transfer not found: " + id));

        if ("COMPLETED".equalsIgnoreCase(transfer.getStatus())) {
            return mapToResponse(transfer); // Already completed
        }

        // Reduce stock from source
        stockService.reduceStock(
                transfer.getSourceWarehouse().getId(),
                transfer.getSourceLocation() != null ? transfer.getSourceLocation().getId() : null,
                transfer.getProduct().getId(),
                transfer.getQuantity());

        // Add stock to destination
        stockService.addStock(
                transfer.getDestinationWarehouse().getId(),
                transfer.getDestinationLocation() != null ? transfer.getDestinationLocation().getId() : null,
                transfer.getProduct().getId(),
                transfer.getQuantity());

        // Log ledger entries
        StockLedger outLedger = StockLedger.builder()
                .product(transfer.getProduct())
                .warehouse(transfer.getSourceWarehouse())
                .location(transfer.getSourceLocation())
                .quantityChanged(-transfer.getQuantity())
                .transactionType("TRANSFER_OUT")
                .transactionDate(LocalDateTime.now())
                .reference(transfer.getReference())
                .notes(transfer.getNotes())
                .build();

        StockLedger inLedger = StockLedger.builder()
                .product(transfer.getProduct())
                .warehouse(transfer.getDestinationWarehouse())
                .location(transfer.getDestinationLocation())
                .quantityChanged(transfer.getQuantity())
                .transactionType("TRANSFER_IN")
                .transactionDate(LocalDateTime.now())
                .reference(transfer.getReference())
                .notes(transfer.getNotes())
                .build();

        ledgerRepository.save(outLedger);
        ledgerRepository.save(inLedger);

        // Mark transfer as completed
        transfer.setStatus("COMPLETED");
        transferRepository.save(transfer);

        return mapToResponse(transfer);
    }

    @Override
    public InternalTransferResponse getTransferById(Long id) {
        InternalTransfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transfer not found: " + id));
        return mapToResponse(transfer);
    }

    @Override
    public List<InternalTransferResponse> getAllTransfers() {
        return transferRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        InternalTransfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transfer not found: " + id));
        transferRepository.delete(transfer);
    }

    private InternalTransferResponse mapToResponse(InternalTransfer transfer) {
        return InternalTransferResponse.builder()
                .id(transfer.getId())
                .product(List.of(new InternalTransferResponse.ProductDTO(
                        transfer.getProduct().getId(),
                        transfer.getProduct().getName(),
                        transfer.getProduct().getSku())))
                .sourceWarehouse(List.of(new InternalTransferResponse.WareHouseDTO(
                        transfer.getSourceWarehouse().getId(),
                        transfer.getSourceWarehouse().getName())))
                .sourceLocation(transfer.getSourceLocation() != null
                        ? List.of(new InternalTransferResponse.LocationDTO(
                                transfer.getSourceLocation().getId(),
                                transfer.getSourceLocation().getName()))
                        : null)
                .destinationWarehouse(List.of(new InternalTransferResponse.WareHouseDTO(
                        transfer.getDestinationWarehouse().getId(),
                        transfer.getDestinationWarehouse().getName())))
                .destinationLocation(transfer.getDestinationLocation() != null
                        ? List.of(new InternalTransferResponse.LocationDTO(
                                transfer.getDestinationLocation().getId(),
                                transfer.getDestinationLocation().getName()))
                        : null)
                .quantity(transfer.getQuantity())
                .status(transfer.getStatus())
                .transferDate(transfer.getTransferDate())
                .reference(transfer.getReference())
                .notes(transfer.getNotes())
                .build();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String msg) {
            super(msg);
        }
    }
}
