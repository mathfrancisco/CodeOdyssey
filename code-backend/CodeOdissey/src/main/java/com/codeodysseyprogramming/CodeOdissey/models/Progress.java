package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private Status status;
    private LocalDateTime startDate;
    private LocalDateTime completedAt;
    private List<ModuleProgress> modulesProgress;
    private double overallProgress;

    public enum Status {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED
    }

    @Getter
    @Setter
    public static class ModuleProgress {
        private String moduleId;
        private boolean completed;
        private List<LessonProgress> lessonsProgress;
        private double moduleProgress;
    }

    @Getter
    @Setter
    public static class LessonProgress {
        private String lessonId;
        private Status status;
        private LocalDateTime completedAt;
        private List<String> completedExercises;
        private double lessonProgress;
    }
}