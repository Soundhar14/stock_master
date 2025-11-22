package com.company.stock_master.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.stock_master.user.entity.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
