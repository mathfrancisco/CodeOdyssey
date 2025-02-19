package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.models.Lesson;
import com.codeodysseyprogramming.CodeOdissey.repositories.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ProgressService progressService;

    @Autowired
    private ExerciseService exerciseService;

    public Lesson createLesson(Lesson lesson) {
        lesson.setMetadata(new Lesson.LessonMetadata());
        return lessonRepository.save(lesson);
    }

    public Lesson getLessonById(String id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
    }

    public void completeLesson(String userId, String courseId, String moduleId, String lessonId) {
        Lesson lesson = getLessonById(lessonId);

        // Update lesson metadata
        Lesson.LessonMetadata metadata = lesson.getMetadata();
        metadata.setCompletionCount(metadata.getCompletionCount() + 1);
        lessonRepository.save(lesson);

        // Update user progress
        progressService.updateProgress(userId, courseId, moduleId, lessonId);
    }

    public boolean checkPrerequisites(String userId, String lessonId) {
        Lesson lesson = getLessonById(lessonId);
        List<String> requiredLessons = lesson.getPrerequisites().getRequiredLessonIds();

        return requiredLessons.stream()
                .allMatch(reqLessonId -> progressService.isLessonCompleted(userId, reqLessonId));
    }
}
