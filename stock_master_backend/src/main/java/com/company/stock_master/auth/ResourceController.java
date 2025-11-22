package com.company.stock_master.auth;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ResourceController {

    @GetMapping("/")
    public String home() {
        return "Backend is running sssss!";
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    public String userAccess() {
        return "Employee/Manager/Admin Content";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Content";
    }

    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public String managerAccess() {
        return "Manager Content";
    }

    @GetMapping("/report")
    @PreAuthorize("hasRole('REPORT_ADMIN')")
    public String reportAdminAccess() {
        return "Report Admin Content";
    }
}
