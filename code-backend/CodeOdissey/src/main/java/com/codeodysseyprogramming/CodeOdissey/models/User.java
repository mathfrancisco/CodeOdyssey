package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    private String passwordHash;
    private String name;
    private Role role;
    private Profile profile;
    private UserPreferences preferences;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    @Getter
    @Setter
    public static class Profile {
        private String avatar;
        private String bio;
        private List<String> socialLinks;
    }

    public User() {
        this.createdAt = LocalDateTime.now();
        this.profile = new Profile();
        this.preferences = UserPreferences.getDefault();
    }
}