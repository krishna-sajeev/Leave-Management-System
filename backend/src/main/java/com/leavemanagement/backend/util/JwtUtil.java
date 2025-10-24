package com.leavemanagement.backend.util;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import com.leavemanagement.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "your-secret-key-1234567890";
    private static final long EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    // ✅ include role in token
    public String generateToken(String email, User.Role role) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role.name())  // 👈 add role as claim
                .withIssuer("lms-app")
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(algorithm);
    }

    // ✅ validate and extract email
    public String validateAndExtractEmail(String token) throws JWTVerificationException {
        DecodedJWT jwt = JWT.require(algorithm)
                .withIssuer("lms-app")
                .build()
                .verify(token);
        return jwt.getSubject();
    }

    // ✅ extract role from token
    public String extractRole(String token) throws JWTVerificationException {
        DecodedJWT jwt = JWT.require(algorithm)
                .withIssuer("lms-app")
                .build()
                .verify(token);
        return jwt.getClaim("role").asString();
    }
}
