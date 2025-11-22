package com.company.stock_master.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.company.stock_master.user.entity.User;
import com.company.stock_master.user.repository.UserRepository;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "User not found with email: " + email));

                var authorities = user.getRoles().stream()
                                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getName()))
                                .collect(Collectors.toSet());

                return new CustomUserDetails(user, authorities);
        }

}