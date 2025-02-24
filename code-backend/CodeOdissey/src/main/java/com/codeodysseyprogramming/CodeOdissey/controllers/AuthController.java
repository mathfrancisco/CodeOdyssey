package com.codeodysseyprogramming.CodeOdissey.controllers;

import com.codeodysseyprogramming.CodeOdissey.dto.request.LoginRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.request.SignUpRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.JwtAuthResponse;
import com.codeodysseyprogramming.CodeOdissey.services.AuthService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para autenticação de usuários
     */
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Delega a lógica de login para o serviço
        JwtAuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Endpoint para cadastro de novos usuários
     */
    @PostMapping("/signup")
    public ResponseEntity<JwtAuthResponse> signup(@Valid @RequestBody SignUpRequest signUpRequest) throws BadRequestException {
        // Delega a lógica de cadastro para o serviço
        JwtAuthResponse authResponse = authService.signup(signUpRequest);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Endpoint para logout de usuários
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para validar um token JWT
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}