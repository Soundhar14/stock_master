package com.company.stock_master.orders.delivery.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.orders.delivery.*;
import com.company.stock_master.orders.delivery.dto.*;
import com.company.stock_master.orders.delivery.entity.Delivery;
import com.company.stock_master.orders.delivery.entity.DeliveryItem;
import com.company.stock_master.master.product.Product;
import com.company.stock_master.master.product.ProductRepository;
import com.company.stock_master.master.stock.service.StockService;
import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;
import com.company.stock_master.master.warehouse.LocationRepository;
import com.company.stock_master.master.warehouse.WarehouseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final WarehouseRepository warehouseRepository;
    private final LocationRepository locationRepository;
    private final ProductRepository productRepository;
    private final StockService stockService;

    @Override
    public DeliveryResponse createDelivery(DeliveryRequest request) {

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found: " + request.getWarehouseId()));

        Location location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new EntityNotFoundException("Location not found: " + request.getLocationId()));
        }

        Delivery delivery = Delivery.builder()
                .reference(request.getReference())
                .status(request.getStatus())
                .warehouse(warehouse)
                .location(location)
                .deliveryAddress(request.getDeliveryAddress())
                .responsibleUserId(request.getResponsibleUserId())
                .scheduledDate(request.getScheduledDate())
                .customerName(request.getCustomerName())
                .customerContact(request.getCustomerContact())
                .notes(request.getNotes())
                .items(mapToEntityItems(request.getItems()))
                .build();

        delivery.getItems().forEach(item -> item.setDelivery(delivery));

        Delivery saved = deliveryRepository.save(delivery);

        handleDeliveredStatus(saved);

        return mapToResponse(saved);
    }

    @Override
    public DeliveryResponse updateStatus(Long id, String status) {

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found: " + id));

        delivery.setStatus(status);

        Delivery saved = deliveryRepository.save(delivery);

        handleDeliveredStatus(saved);

        return mapToResponse(saved);
    }

    @Override
    public DeliveryResponse getById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found: " + id));

        return mapToResponse(delivery);
    }

    @Override
    public List<DeliveryResponse> getAll() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Delivery not found: " + id));

        deliveryRepository.delete(delivery);
    }

    // ---------------------------------------------------------
    // PRIVATE HELPERS
    // ---------------------------------------------------------

    private List<DeliveryItem> mapToEntityItems(List<DeliveryRequest.DeliveryItemRequest> items) {
        return items.stream().map(reqItem -> {

            Product product = productRepository.findById(reqItem.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + reqItem.getProductId()));

            return DeliveryItem.builder()
                    .product(product)
                    .quantity(reqItem.getQuantity())
                    .build();

        }).collect(Collectors.toList());
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .reference(delivery.getReference())
                .status(delivery.getStatus())
                .warehouse(warehouseToResponse(delivery.getWarehouse()))
                .location(locationToResponse(delivery.getLocation()))
                .locationId(delivery.getLocation() != null ? delivery.getLocation().getId() : null)
                .locationName(delivery.getLocation() != null ? delivery.getLocation().getName() : null)
                .deliveryAddress(delivery.getDeliveryAddress())
                .responsibleUserId(delivery.getResponsibleUserId())
                .scheduledDate(delivery.getScheduledDate())
                .customerName(delivery.getCustomerName())
                .customerContact(delivery.getCustomerContact())
                .notes(delivery.getNotes())
                .items(
                        delivery.getItems().stream()
                                .map(item -> new DeliveryResponse.DeliveryItemResponse(
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity()))
                                .collect(Collectors.toList()))
                .build();
    }

    private List<DeliveryResponse.WarehouseDTO> warehouseToResponse(Warehouse warehouse) {
        return List.of(new DeliveryResponse.WarehouseDTO(warehouse.getId(), warehouse.getName()));
    }

    private List<DeliveryResponse.LocationDTO> locationToResponse(Location location) {
        return location != null ? List.of(new DeliveryResponse.LocationDTO(location.getId(), location.getName()))
                : null;
    }

    private void handleDeliveredStatus(Delivery delivery) {

        if (!"DELIVERED".equalsIgnoreCase(delivery.getStatus())) {
            return;
        }

        Long warehouseId = delivery.getWarehouse().getId();
        Long locationId = delivery.getLocation() != null ? delivery.getLocation().getId() : null;

        delivery.getItems().forEach(item -> {

            Long productId = item.getProduct().getId();
            long qty = item.getQuantity(); // quantity is in the delivery item

            stockService.reduceStock(
                    warehouseId,
                    locationId,
                    productId,
                    qty);
        });
    }

    // ---------------------------------------------------------
    // EXCEPTION CLASS
    // ---------------------------------------------------------

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String msg) {
            super(msg);
        }
    }
}
