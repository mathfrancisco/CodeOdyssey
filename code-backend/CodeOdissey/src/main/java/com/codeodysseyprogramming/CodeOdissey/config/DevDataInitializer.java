package com.codeodysseyprogramming.CodeOdissey.config;

import com.codeodysseyprogramming.CodeOdissey.models.*;
import com.codeodysseyprogramming.CodeOdissey.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@Profile("dev")
public class DevDataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDevData() {
        return args -> {
            // Verificar se já existem dados
            if (userRepository.count() == 0) {
                System.out.println("Initializing development data...");

                // Criar usuário admin
                User adminUser = new User();
                adminUser.setEmail("admin@codeodyssey.com");
                adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
                adminUser.setName("Admin User");
                adminUser.setRole(Role.ADMIN);

                User.Profile adminProfile = new User.Profile();
                adminProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=admin");
                adminProfile.setBio("CodeOdyssey System Administrator");
                adminUser.setProfile(adminProfile);

                userRepository.save(adminUser);

                // Criar usuário instructor
                User instructorUser = new User();
                instructorUser.setEmail("instructor@codeodyssey.com");
                instructorUser.setPasswordHash(passwordEncoder.encode("instructor123"));
                instructorUser.setName("Demo Instructor");
                instructorUser.setRole(Role.MODERATOR);

                User.Profile instructorProfile = new User.Profile();
                instructorProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=instructor");
                instructorProfile.setBio("Experienced Java and Spring instructor");
                instructorUser.setProfile(instructorProfile);

                userRepository.save(instructorUser);

                // Criar usuário estudante
                User studentUser = new User();
                studentUser.setEmail("student@codeodyssey.com");
                studentUser.setPasswordHash(passwordEncoder.encode("student123"));
                studentUser.setName("Demo Student");
                studentUser.setRole(Role.STUDENT);

                User.Profile studentProfile = new User.Profile();
                studentProfile.setAvatar("https://api.dicebear.com/6.x/identicon/svg?seed=student");
                studentProfile.setBio("Learning to code with CodeOdyssey");
                studentUser.setProfile(studentProfile);

                userRepository.save(studentUser);

                System.out.println("Development data initialized successfully!");
            }
        };
    }
}