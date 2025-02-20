package com.codeodysseyprogramming.CodeOdissey.repositories;

public interface ProgressOperations {
    void updateProgress(String userId, String courseId, String moduleId, String lessonId);
    boolean isLessonCompleted(String userId, String lessonId);
    void updateExerciseCompletion(String userId, String lessonId, String exerciseId);
}
