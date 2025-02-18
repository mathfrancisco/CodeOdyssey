// CourseResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;


import com.codeodysseyprogramming.CodeOdissey.models.Course;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
public class CourseResponse {
    private String id;
    private String title;
    private String description;
    private Course.Level level;
    private List<String> technologies;
    private String instructorId;
    private List<ModuleResponse> modules;
    private int enrolledCount;
    private double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class ModuleResponse {
        private String title;
        private List<LessonResponse> lessons;

        // Getters and Setters
    }

    public static class LessonResponse {
        private String title;
        private String content;
        private String videoUrl;
        private int duration;
        private List<String> exerciseIds;

        // Getters and Setters
    }

    // Getters and Setters
}