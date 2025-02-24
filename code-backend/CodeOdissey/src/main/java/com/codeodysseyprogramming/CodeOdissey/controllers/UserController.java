package com.codeodysseyprogramming.CodeOdissey.controllers;


import com.codeodysseyprogramming.CodeOdissey.dto.request.UserUpdateRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.UserProfileResponse;
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

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(mapToUserProfileResponse(user));
    }
  @GetMapping("/profile")
  public ResponseEntity<UserProfileResponse> getUserProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
    User user = userService.getUserByEmail(userDetails.getUsername());
    return ResponseEntity.ok(mapToUserProfileResponse(user));
   }
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

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(mapToUserProfileResponse(user));
    }

    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().name());
        response.setAvatar(user.getProfile().getAvatar());
        response.setBio(user.getProfile().getBio());
        return response;
    }
}
