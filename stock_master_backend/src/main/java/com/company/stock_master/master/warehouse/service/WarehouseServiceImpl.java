package com.company.stock_master.master.warehouse.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.company.stock_master.master.warehouse.WarehouseRepository;
import com.company.stock_master.master.warehouse.entity.Location;
import com.company.stock_master.master.warehouse.entity.Warehouse;
import com.company.stock_master.master.warehouse.dto.WarehouseRequest;
import com.company.stock_master.master.warehouse.dto.WarehouseResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        // Validate unique shortCode and name for create
        validateUniqueFields(request.getShortCode(), request.getName());

        List<Location> locations = mapRequestLocations(request);

        Warehouse warehouse = Warehouse.builder()
                .shortCode(request.getShortCode())
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .locations(locations)
                .isActive(true)
                .build();

        warehouse = warehouseRepository.save(warehouse);
        return mapToResponse(warehouse);
    }

    @Override
    public WarehouseResponse patchWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found"));

        // Validate unique fields for patch
        validateUniqueFields(request, warehouse);

        if (request.getShortCode() != null)
            warehouse.setShortCode(request.getShortCode());
        if (request.getName() != null)
            warehouse.setName(request.getName());
        if (request.getAddress() != null)
            warehouse.setAddress(request.getAddress());
        if (request.getCity() != null)
            warehouse.setCity(request.getCity());

        if (request.getLocations() != null) {
            List<Location> updatedLocations = request.getLocations().stream()
                    .map(locReq -> {
                        // Try to find existing location in warehouse
                        Location existing = warehouse.getLocations().stream()
                                .filter(l -> l.getId() != null && l.getId().equals(locReq.getId()))
                                .findFirst()
                                .orElse(new Location()); // create new if not exists

                        existing.setName(locReq.getName());
                        return existing;
                    })
                    .toList();

            warehouse.getLocations().clear();
            warehouse.getLocations().addAll(updatedLocations);
        }

        Warehouse updated = warehouseRepository.save(warehouse);
        return mapToResponse(updated);
    }

    @Override
    public WarehouseResponse getById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .filter(Warehouse::isActive)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found with id: " + id));

        return mapToResponse(warehouse);
    }

    @Override
    public List<WarehouseResponse> getAll() {
        return warehouseRepository.findAll().stream()
                .filter(Warehouse::isActive)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Warehouse not found with id: " + id));

        warehouse.setActive(false);
        warehouseRepository.save(warehouse);
    }

    // ----------------- PRIVATE METHODS -----------------

    // Validate unique fields for CREATE
    private void validateUniqueFields(String shortCode, String name) {
        if (shortCode != null && warehouseRepository.existsByShortCode(shortCode)) {
            throw new DuplicateWarehouseException("Warehouse shortCode already exists.");
        }
        if (name != null && warehouseRepository.existsByName(name)) {
            throw new DuplicateWarehouseException("Warehouse name already exists.");
        }
    }

    // Validate unique fields for PATCH
    private void validateUniqueFields(WarehouseRequest request, Warehouse existing) {
        if (request.getShortCode() != null &&
                !request.getShortCode().equalsIgnoreCase(existing.getShortCode()) &&
                warehouseRepository.existsByShortCodeAndIdNot(request.getShortCode(), existing.getId())) {
            throw new DuplicateWarehouseException("Warehouse shortCode already exists.");
        }

        if (request.getName() != null &&
                !request.getName().equalsIgnoreCase(existing.getName()) &&
                warehouseRepository.existsByNameAndIdNot(request.getName(), existing.getId())) {
            throw new DuplicateWarehouseException("Warehouse name already exists.");
        }
    }

    private List<Location> mapRequestLocations(WarehouseRequest request) {
        if (request.getLocations() == null || request.getLocations().isEmpty()) {
            return List.of();
        }

        return request.getLocations().stream()
                .map(loc -> Location.builder()
                        .id(loc.getId())
                        .name(loc.getName())
                        .build())
                .collect(Collectors.toList());
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        List<WarehouseResponse.LocationResponseDTO> locationDTOs = warehouse.getLocations() != null
                ? warehouse.getLocations().stream()
                        .map(loc -> new WarehouseResponse.LocationResponseDTO(
                                loc.getId(),
                                loc.getName()))
                        .collect(Collectors.toList())
                : List.of();

        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .shortCode(warehouse.getShortCode())
                .name(warehouse.getName())
                .address(warehouse.getAddress())
                .city(warehouse.getCity())
                .locations(locationDTOs)
                .build();
    }

    // ----------------- EXCEPTIONS -----------------
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public static class DuplicateWarehouseException extends RuntimeException {
        public DuplicateWarehouseException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class EntityNotFoundException extends RuntimeException {
        public EntityNotFoundException(String message) {
            super(message);
        }
    }
}
