package com.codeodysseyprogramming.CodeOdissey.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String passwordHash;
    private Role role;
    private Profile profile;
    private UserPreferences preferences;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // Getters, Setters, and nested classes
    public static class Profile {
        private String name;
        private String avatar;
        private String bio;
        private List<String> socialLinks;
        
        // Getters and Setters
    }

    public static class UserPreferences {
        private boolean emailNotifications;
        private boolean pushNotifications;
        private String theme;
        
        // Getters and Setters
    }

    public enum Role {
        STUDENT, INSTRUCTOR, ADMIN
    }
}
