package com.company.stock_master.master.warehouse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.master.location.*;
import com.company.stock_master.master.warehouse.Warehouse;
import com.company.stock_master.master.warehouse.WarehouseRepository;
import com.company.stock_master.master.warehouse.dto.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final LocationRepository locationRepository;

    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        if (warehouseRepository.existsByShortCode(request.getShortCode())) {
            throw new DuplicateWarehouseException("Warehouse shortCode already exists.");
        }

        if (warehouseRepository.existsByName(request.getName())) {
            throw new DuplicateWarehouseException("Warehouse name already exists.");
        }

        List<Location> locations = null;
        if (request.getLocationIds() != null && !request.getLocationIds().isEmpty()) {
            locations = locationRepository.findAllById(request.getLocationIds());
            if (locations.size() != request.getLocationIds().size()) {
                throw new EntityNotFoundException("One or more locations not found");
            }
        }

        Warehouse warehouse = Warehouse.builder()
                .shortCode(request.getShortCode())
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .locations(locations)
                .isActive(true)
                .build();

        warehouse = warehouseRepository.save(warehouse);

        return MapToResponse(warehouse);
    }

    @Override
    public WarehouseResponse patchWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found"));

        if (request.getShortCode() != null) {
            if (!request.getShortCode().equalsIgnoreCase(warehouse.getShortCode())
                    && warehouseRepository.existsByShortCode(request.getShortCode())) {
                throw new DuplicateWarehouseException("Warehouse short code already exists.");
            }
            warehouse.setShortCode(request.getShortCode());
        }

        if (request.getName() != null) {
            if (!request.getName().equalsIgnoreCase(warehouse.getName())
                    && warehouseRepository.existsByName(request.getName())) {
                throw new DuplicateWarehouseException("Warehouse name already exists.");
            }
            warehouse.setName(request.getName());
        }

        if (request.getAddress() != null) {
            warehouse.setAddress(request.getAddress());
        }

        if (request.getCity() != null) {
            warehouse.setCity(request.getCity());
        }

        if (request.getLocationIds() != null && !request.getLocationIds().isEmpty()) {
            List<Location> locations = locationRepository.findAllById(request.getLocationIds());
            warehouse.setLocations(locations);
        }

        Warehouse updated = warehouseRepository.save(warehouse);
        return MapToResponse(updated);
    }

    @Override
    public WarehouseResponse getById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .filter(Warehouse::isActive)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found with id: " + id));
        return MapToResponse(warehouse);
    }

    @Override
    public List<WarehouseResponse> getAll() {
        return warehouseRepository.findAll().stream()
                .filter(Warehouse::isActive)
                .map(this::MapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found with id: " + id));

        warehouse.setActive(false);
        warehouseRepository.save(warehouse);
    }

    private WarehouseResponse MapToResponse(Warehouse warehouse) {
        WarehouseResponse response = new WarehouseResponse();
        response.setId(warehouse.getId());
        response.setShortCode(warehouse.getShortCode());
        response.setName(warehouse.getName());
        response.setAddress(warehouse.getAddress());
        response.setCity(warehouse.getCity());

        response.setLocations(warehouse.getLocations() != null
                ? warehouse.getLocations().stream()
                        .map(loc -> new WarehouseResponse.LocationResponseDTO(loc.getId(), loc.getName()))
                        .toList()
                : List.of());

        return response;
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public static class DuplicateWarehouseException extends RuntimeException {
        public DuplicateWarehouseException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String message) {
            super(message);
        }
    }

}
