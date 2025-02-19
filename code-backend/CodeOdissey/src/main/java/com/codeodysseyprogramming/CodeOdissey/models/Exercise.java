package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Getter
@Setter
@Document(collection = "exercises")
public class Exercise {
    @Id
    private String id;
    private String title;
    private String description;
    private Difficulty difficulty;
    private String language;
    private String starterCode;
    private List<TestCase> testCases;
    private String solution;
    private List<String> hints;
    private int pointsValue;
    private ExerciseMetadata metadata;

    public String getLessonId() {
        return id;
    }
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
    @Getter
    @Setter
    public static class TestCase {
        private String input;
        private String expectedOutput;
        private boolean isVisible;
        private String description;
        
        // Getters and Setters
    }
    @Getter
    @Setter
    public static class ExerciseMetadata {
        private int averageCompletionTime;
        private int successRate;
        private int totalAttempts;
        private int totalCompletions;
        
        // Getters and Setters
    }

    // Getters and Setters
}
