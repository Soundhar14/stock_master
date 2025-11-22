package com.company.stock_master.user.service;

import java.util.List;

import com.company.stock_master.user.dto.*;

public interface UserService {
    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(Long userId, UpdateUserRequest request);

    void deleteUser(Long id);

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();
}
