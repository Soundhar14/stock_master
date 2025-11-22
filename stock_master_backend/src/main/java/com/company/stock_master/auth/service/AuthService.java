package com.company.stock_master.auth.service;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.company.stock_master.auth.config.JwtUtil;
import com.company.stock_master.auth.dto.JwtResponse;
import com.company.stock_master.auth.dto.LoginRequest;
import com.company.stock_master.auth.dto.RegisterRequest;
import com.company.stock_master.user.entity.Role;
import com.company.stock_master.user.entity.User;
import com.company.stock_master.user.entity.UserRole;
import com.company.stock_master.user.repository.RoleRepository;
import com.company.stock_master.user.repository.UserRepository;
import com.company.stock_master.user.repository.UserRoleRepository;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ResponseEntity<?> registerUser(RegisterRequest request, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest().body("Phone number already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setActive(true);

        user = userRepository.save(user);

        Role role = roleRepository.findByName(request.getRoleName().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRoleName()));

        UserRole userRole = UserRole.builder()
                .user(user)
                .role(role)
                .build();

        userRoleRepository.save(userRole);

        return ResponseEntity.ok("User registered successfully with role: " + role.getName());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomUserDetails customUser = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(customUser.getUser()); 

            return ResponseEntity.ok(new JwtResponse(token));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @Transactional
    public ResponseEntity<?> registerAdmin(RegisterRequest request, BindingResult result) {

        request.setRoleName("ADMIN");
        return registerUser(request, result);
    }
}
