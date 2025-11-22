package com.company.stock_master.master.stock.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.master.stock.*;
import com.company.stock_master.master.stock.dto.*;
import com.company.stock_master.master.product.Product;
import com.company.stock_master.master.product.ProductRepository;
import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;
import com.company.stock_master.master.warehouse.LocationRepository;
import com.company.stock_master.master.warehouse.WarehouseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {

        private final StockRepository stockRepository;
        private final ProductRepository productRepository;
        private final LocationRepository locationRepository;
        private final WarehouseRepository warehouseRepository;

        @Override
        public StockResponse createStock(StockRequest request) {

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Product not found with id: " + request.getProductId()));

                Location location = locationRepository.findById(request.getLocationId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Location not found with id: " + request.getLocationId()));

                Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Warehouse not found with id: " + request.getWarehouseId()));

                Stock stock = Stock.builder()
                                .product(product)
                                .location(location)
                                .warehouse(warehouse)
                                .onHand(request.getOnHand())
                                .reserved(request.getReserved())
                                .freeToUse(request.getFreeToUse())
                                .build();

                stock = stockRepository.save(stock);

                return mapToResponse(stock);
        }

        @Override
        public StockResponse updateStock(Long id, StockRequest request) {

                Stock stock = stockRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));

                Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Product not found with id: " + request.getProductId()));

                Location location = locationRepository.findById(request.getLocationId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Location not found with id: " + request.getLocationId()));

                Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Warehouse not found with id: " + request.getWarehouseId()));

                stock.setProduct(product);
                stock.setLocation(location);
                stock.setWarehouse(warehouse);
                stock.setOnHand(request.getOnHand());
                stock.setReserved(request.getReserved());
                stock.setFreeToUse(request.getFreeToUse());

                Stock updated = stockRepository.save(stock);

                return mapToResponse(updated);
        }

        @Override
        public StockResponse getById(Long id) {
                Stock stock = stockRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));
                return mapToResponse(stock);
        }

        @Override
        public List<StockResponse> getAll() {
                return stockRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public void deleteById(Long id) {
                Stock stock = stockRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));
                stockRepository.delete(stock);
        }

        private StockResponse mapToResponse(Stock stock) {
                return StockResponse.builder()
                                .id(stock.getId())
                                .product(List.of(new StockResponse.ProductDTO(
                                                stock.getProduct().getId(),
                                                stock.getProduct().getName(),
                                                stock.getProduct().getSku())))
                                .warehouse(List.of(new StockResponse.WareHouseDTO(
                                                stock.getWarehouse().getId(),
                                                stock.getWarehouse().getName())))
                                .location(List.of(new StockResponse.LocationDTO(
                                                stock.getLocation().getId(),
                                                stock.getLocation().getName())))
                                .onHand(stock.getOnHand())
                                .reserved(stock.getReserved())
                                .freeToUse(stock.getFreeToUse())
                                .build();
        }

        @Override
        public void addStock(Long warehouseId, Long locationId, Long productId, long quantity) {
                Stock stock = stockRepository
                                .findByProductIdAndWarehouseIdAndLocationId(productId, warehouseId, locationId)
                                .orElseThrow(() -> new EntityNotFoundException("Stock not found"));

                stock.setOnHand(stock.getOnHand() + quantity);
                stock.setFreeToUse(stock.getFreeToUse() + quantity);

                stockRepository.save(stock);
        }

        @Override
        public void reduceStock(Long warehouseId, Long locationId, Long productId, long quantity) {
                Stock stock = stockRepository
                                .findByProductIdAndWarehouseIdAndLocationId(productId, warehouseId, locationId)
                                .orElseThrow(() -> new EntityNotFoundException("Stock not found"));

                if (stock.getFreeToUse() < quantity) {
                        throw new RuntimeException("Insufficient stock to reduce");
                }

                stock.setOnHand(stock.getOnHand() - quantity);
                stock.setFreeToUse(stock.getFreeToUse() - quantity);

                stockRepository.save(stock);
        }

        @ResponseStatus(HttpStatus.NOT_FOUND)
        public class EntityNotFoundException extends RuntimeException {
                public EntityNotFoundException(String message) {
                        super(message);
                }
        }
}
