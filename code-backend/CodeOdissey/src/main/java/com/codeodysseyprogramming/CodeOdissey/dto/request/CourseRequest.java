// CourseRequest.java
package com.codeodysseyprogramming.CodeOdissey.dto.request;


import com.codeodysseyprogramming.CodeOdissey.models.Course;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class CourseRequest {
    private String title;
    private String description;
    private Course.Level level;
    private List<String> technologies;
    private List<ModuleRequest> modules;

    public static class ModuleRequest {
        private String title;
        private List<LessonRequest> lessons;

        // Getters and Setters
    }public static class LessonRequest {
        private String title;
        private String content;
        private String videoUrl;
        private int duration;
        private List<String> exerciseIds;

        // Getters and Setters
    }

    // Getters and Setters
}