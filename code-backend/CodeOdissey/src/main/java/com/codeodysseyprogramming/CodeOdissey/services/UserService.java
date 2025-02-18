package com.codeodisseyprogramming.services;

import com.codeodisseyprogramming.models.User;
import com.codeodisseyprogramming.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

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
