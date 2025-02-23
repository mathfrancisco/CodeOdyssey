package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.models.Course;
import com.codeodysseyprogramming.CodeOdissey.models.Progress;
import com.codeodysseyprogramming.CodeOdissey.repositories.ProgressOperations;
import com.codeodysseyprogramming.CodeOdissey.repositories.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgressService implements ProgressOperations {
    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private CourseService courseService;

    public Progress startCourse(String userId, String courseId) {
        Course course = courseService.getCourseById(courseId);
        
        Progress progress = new Progress();
        progress.setUserId(userId);
        progress.setCourseId(courseId);
        progress.setStartDate(LocalDateTime.now());
        progress.setStatus(Progress.Status.IN_PROGRESS);
        
        // Initialize module progress
        List<Progress.ModuleProgress> moduleProgress = course.getModules().stream()
            .map(module -> {
                Progress.ModuleProgress mp = new Progress.ModuleProgress();
                mp.setModuleId(module.getId());
                mp.setCompleted(false);
                return mp;
            })
            .collect(Collectors.toList());
        
        progress.setModulesProgress(moduleProgress);
        
        return progressRepository.save(progress);
    }

    @Override
    public void updateProgress(String userId, String courseId, String moduleId, String lessonId) {
        Progress progress = getProgress(userId, courseId);
        
        // Update lesson completion
        progress.getModulesProgress().stream()
            .filter(mp -> mp.getModuleId().equals(moduleId))
            .findFirst()
            .ifPresent(mp -> {
                mp.getLessonsProgress().stream()
                    .filter(lp -> lp.getLessonId().equals(lessonId))
                    .findFirst()
                    .ifPresent(lp -> {
                        lp.setStatus(Progress.Status.COMPLETED);
                        lp.setCompletedAt(LocalDateTime.now());
                    });
                
                // Check if all lessons are completed
                boolean allLessonsCompleted = mp.getLessonsProgress().stream()
                    .allMatch(lp -> lp.getStatus() == Progress.Status.COMPLETED);
                mp.setCompleted(allLessonsCompleted);
            });
        
        // Check if course is completed
        boolean allModulesCompleted = progress.getModulesProgress().stream()
            .allMatch(Progress.ModuleProgress::isCompleted);
        
        if (allModulesCompleted) {
            progress.setStatus(Progress.Status.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        }

        progressRepository.save(progress);
    }

    public Progress getProgress(String userId, String courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
            .stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));

    }

    public List<Progress> getUserProgress(String userId) {
        return progressRepository.findByUserId(userId);
    }

    @Override
    public void updateExerciseCompletion(String userId, String lessonId, String exerciseId) {
        List<Progress> userProgress = progressRepository.findByUserId(userId);

        for (Progress progress : userProgress) {
            for (Progress.ModuleProgress moduleProgress : progress.getModulesProgress()) {
                moduleProgress.getLessonsProgress().stream()
                        .filter(lp -> lp.getLessonId().equals(lessonId))
                        .findFirst()
                        .ifPresent(lessonProgress -> {
                            lessonProgress.getCompletedExercises().add(exerciseId);
                            // Note: Removed direct LessonService dependency
                            updateProgress(userId, progress.getCourseId(), moduleProgress.getModuleId(), lessonId);
                        });
            }
        }
    }

    @Override
    public boolean isLessonCompleted(String userId, String lessonId) {
        List<Progress> userProgress = progressRepository.findByUserId(userId);

        for (Progress progress : userProgress) {
            for (Progress.ModuleProgress moduleProgress : progress.getModulesProgress()) {
                for (Progress.LessonProgress lessonProgress : moduleProgress.getLessonsProgress()) {
                    if (lessonProgress.getLessonId().equals(lessonId)) {
                        return lessonProgress.getStatus() == Progress.Status.COMPLETED;
                    }
                }
            }
        }

        return false;

    }

    public boolean hasAccessToCourse(String username, String courseId) {
        return !progressRepository.findByUserIdAndCourseId(username, courseId).isEmpty();
    }
}
