package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String description;
    private Level level;
    private List<String> technologies;
    private String instructorId;
    private List<Module> modules;
    private int enrolledCount;
    private double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Level {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
    @Getter
    @Setter
    public static class Module {
        private String title;
        private List<Lesson> lessons;

        // Getters and Setters
    }
    @Getter
    @Setter
    public static class Lesson {
        private String title;
        private String content;
        private String videoUrl;
        private int duration;
        private List<String> exerciseIds;

        // Getters and Setters
    }

    // Getters and Setters
}
