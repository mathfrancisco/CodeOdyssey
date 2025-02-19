package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Document(collection = "lessons")
public class Lesson {
    @Id
    private String id;
    private String moduleId;
    private String title;
    private String description;
    private String content;
    private String videoUrl;
    private int duration; // in minutes
    private List<String> exerciseIds;
    private List<Resource> resources;
    private Prerequisites prerequisites;
    private LessonMetadata metadata;

    public Collection<Object> getExercises() {
        return null;
    }

    @Getter
    @Setter
    public static class Resource {
        private String title;
        private String type; // VIDEO, DOCUMENT, LINK
        private String url;
        private String description;
    }

    @Getter
    @Setter
    public static class Prerequisites {
        private List<String> requiredLessonIds;
        private List<String> recommendedLessonIds;
        private int minimumExperienceLevel;
    }

    @Getter
    @Setter
    public static class LessonMetadata {
        private int completionCount;
        private double averageCompletionTime;
        private double rating;
        private int viewCount;
    }
}