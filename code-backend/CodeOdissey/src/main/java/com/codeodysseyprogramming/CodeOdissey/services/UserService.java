package com.codeodysseyprogramming.CodeOdissey.services;


import com.codeodysseyprogramming.CodeOdissey.dto.request.UserUpdateRequest;
import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.exceptions.UnauthorizedException;
import com.codeodysseyprogramming.CodeOdissey.models.User;
import com.codeodysseyprogramming.CodeOdissey.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User createUser(User signUpRequest) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setRole(User.Role.STUDENT);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    // Add these methods
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUser(String email, UserUpdateRequest updateRequest) {
        User user = getUserByEmail(email);
        
        user.setName(updateRequest.getName());
        if (user.getProfile() == null) {
            user.setProfile(new UserProfile());
        }
        user.getProfile().setBio(updateRequest.getBio());
        user.getProfile().setAvatar(updateRequest.getAvatar());
        
        return userRepository.save(user);
    }

    public User updatePassword(String email, String oldPassword, String newPassword) {
        User user = getUserByEmail(email);
        
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid old password");
        }
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    // Add proper exceptions instead of RuntimeException
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
