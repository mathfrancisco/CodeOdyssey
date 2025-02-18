package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Document(collection = "users")
public class User {
    // Getters e Setters
    @Id
    private String id;
    private String email;
    private String passwordHash;
    private String name; // Adicionado
    private Role role;
    private Profile profile;
    private UserPreferences preferences;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // 2. Classe Profile corrigida
    @Setter
    @Getter
    public static class Profile {
        private String name;
        private String avatar;
        private String bio;
        private List<String> socialLinks;

    }
}
