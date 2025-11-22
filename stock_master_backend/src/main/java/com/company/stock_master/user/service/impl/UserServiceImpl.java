package com.company.stock_master.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.stock_master.user.dto.CreateUserRequest;
import com.company.stock_master.user.dto.UpdateUserRequest;
import com.company.stock_master.user.dto.UserResponse;
import com.company.stock_master.user.entity.Role;
import com.company.stock_master.user.entity.User;
import com.company.stock_master.user.entity.UserRole;
import com.company.stock_master.user.repository.RoleRepository;
import com.company.stock_master.user.repository.UserRepository;
import com.company.stock_master.user.repository.UserRoleRepository;
import com.company.stock_master.user.service.UserService;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final UserRoleRepository userRoleRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepo.existsByUsername(request.getUsername()) || userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Username or Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        User savedUser = userRepo.save(user);

        Set<UserRole> userRoles = request.getRoles().stream()
                .map(roleName -> {
                    Role role = roleRepo.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                    return UserRole.builder().user(savedUser).role(role).build();
                }).collect(Collectors.toSet());

        userRoleRepo.saveAll(new ArrayList<>(userRoles));

        savedUser.setRoles(userRoles);

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if(request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getIsActive() != null)
            user.setActive(request.getIsActive());

        user = userRepo.save(user);

        return mapToResponse(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    @Override
    public UserResponse getUserById(Long id) {
        return mapToResponse(userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepo.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .isActive(user.isActive())
                .roles(user.getRoles() != null ? user.getRoles().stream()
                        .map(userRole -> userRole.getRole().getName())
                        .collect(Collectors.toSet()) : Collections.emptySet())
                .build();
    }
}
