package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.models.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    
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
        List<ModuleProgress> moduleProgress = course.getModules().stream()
            .map(module -> {
                ModuleProgress mp = new ModuleProgress();
                mp.setModuleId(module.getId());
                mp.setCompleted(false);
                return mp;
            })
            .collect(Collectors.toList());
        
        progress.setModulesProgress(moduleProgress);
        
        return progressRepository.save(progress);
    }

    public Progress updateProgress(String userId, String courseId, String moduleId, String lessonId) {
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
            .allMatch(ModuleProgress::isCompleted);
        
        if (allModulesCompleted) {
            progress.setStatus(Progress.Status.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        }
        
        return progressRepository.save(progress);
    }

    public Progress getProgress(String userId, String courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));
    }

    public List<Progress> getUserProgress(String userId) {
        return progressRepository.findByUserId(userId);
    }
}
