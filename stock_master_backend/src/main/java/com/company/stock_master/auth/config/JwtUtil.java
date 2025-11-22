package com.company.stock_master.auth.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.company.stock_master.user.entity.User;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // Default expiration 24 hours
    private static final long JWT_EXPIRATION = 24 * 60 * 60 * 1000;

    // Use application.properties secret
    @Value("${jwt.secret}")
    private String secretKey;

    // Generate secure signing key from secret
    private Key getSigningKey() {
        if (secretKey == null || secretKey.trim().isEmpty()) {
            throw new IllegalStateException("JWT secret key is missing in application.properties!");
        }

        byte[] keyBytes;

        try {
            keyBytes = Decoders.BASE64.decode(secretKey);
        } catch (Exception e) {
            keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        }

        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT secret key must be at least 32 bytes (256 bits).");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate token from User entity
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream()
                .map(ur -> "ROLE_" + ur.getRole().getName())
                .collect(Collectors.toList()));

        return createToken(claims, user.getEmail());
    }

    // Create JWT token
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate JWT token against UserDetails
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Extract username (email) from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract roles from token
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        Object rolesObj = claims.get("roles");

        if (rolesObj instanceof List<?>) {
            return ((List<?>) rolesObj).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    // Generic claim extractor
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    // Parse token and extract all claims
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(cleanToken(token))
                    .getBody();
        } catch (JwtException e) {
            throw new IllegalArgumentException("Invalid JWT token: " + e.getMessage());
        }
    }

    // Remove Bearer prefix if present
    private String cleanToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
