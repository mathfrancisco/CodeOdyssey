package com.codeodysseyprogramming.CodeOdissey.controllers;

import com.codeodysseyprogramming.CodeOdissey.dto.request.PasswordUpdateRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.request.UserUpdateRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.UserProfileResponse;
import com.codeodysseyprogramming.CodeOdissey.models.Role;
import com.codeodysseyprogramming.CodeOdissey.models.User;
import com.codeodysseyprogramming.CodeOdissey.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * Obtém informações do usuário atual (autenticado)
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(mapToUserProfileResponse(user));
    }

    /**
     * Endpoint alternativo para obter perfil do usuário atual (mesma funcionalidade que /me)
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(mapToUserProfileResponse(user));
    }

    /**
     * Atualiza informações do usuário atual
     */
    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateUser(
            @Valid @RequestBody UserUpdateRequest updateRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        User updatedUser = userService.updateUser(
                userDetails.getUsername(),
                updateRequest
        );
        return ResponseEntity.ok(mapToUserProfileResponse(updatedUser));
    }

    /**
     * Atualiza a senha do usuário atual
     */
    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @Valid @RequestBody PasswordUpdateRequest passwordRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        userService.updatePassword(
                userDetails.getUsername(),
                passwordRequest.getOldPassword(),
                passwordRequest.getNewPassword()
        );
        return ResponseEntity.ok().build();
    }

    /**
     * Obtém informações de um usuário específico (apenas para administradores)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(mapToUserProfileResponse(user));
    }

    /**
     * Lista todos os usuários (apenas para administradores)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserProfileResponse> responses = users.stream()
                .map(this::mapToUserProfileResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Atualiza a função (role) de um usuário (apenas para administradores)
     */
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> updateUserRole(
            @PathVariable String id,
            @RequestParam Role role) {
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(mapToUserProfileResponse(updatedUser));
    }

    /**
     * Converte um objeto User para UserProfileResponse
     */
    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().name());

        // Verifica se o perfil existe antes de acessá-lo
        if (user.getProfile() != null) {
            response.setAvatar(user.getProfile().getAvatar());
            response.setBio(user.getProfile().getBio());
        }

        return response;
    }
}