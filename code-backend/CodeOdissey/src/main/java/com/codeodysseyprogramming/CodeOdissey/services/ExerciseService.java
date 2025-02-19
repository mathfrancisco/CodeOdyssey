package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeSubmissionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.repositories.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {
    
   @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @Autowired
    private ProgressService progressService;

    public Exercise createExercise(Exercise exercise) {
        // Initialize metadata
        exercise.setMetadata(new Exercise.ExerciseMetadata());
        return exerciseRepository.save(exercise);
    }

    public Exercise updateExercise(String id, Exercise exerciseUpdate) {
        Exercise exercise = getExerciseById(id);
        
        exercise.setTitle(exerciseUpdate.getTitle());
        exercise.setDescription(exerciseUpdate.getDescription());
        exercise.setDifficulty(exerciseUpdate.getDifficulty());
        exercise.setLanguage(exerciseUpdate.getLanguage());
        exercise.setStarterCode(exerciseUpdate.getStarterCode());
        exercise.setTestCases(exerciseUpdate.getTestCases());
        exercise.setSolution(exerciseUpdate.getSolution());
        exercise.setHints(exerciseUpdate.getHints());
        exercise.setPointsValue(exerciseUpdate.getPointsValue());
        
        return exerciseRepository.save(exercise);
    }

    public Exercise getExerciseById(String id) {
        return exerciseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Exercise not found with id: " + id));
    }

    public CodeExecutionResponse submitSolution(String exerciseId, CodeSubmissionRequest submission, String userId) {
        Exercise exercise = getExerciseById(exerciseId);
        
        // Execute code and update progress
        CodeExecutionResponse response = codeExecutionService.submitSolution(
            exerciseId,
            submission.getCode(),
            userId
        );
        
        if (response.isSuccess()) {
            // Update course progress if exercise is part of a lesson
            if (exercise.getLessonId() != null) {
                progressService.updateExerciseCompletion(userId, exercise.getLessonId(), exerciseId);
            }
        }
        
        return response;
    }

     // Helper method for CodeExecutionService
    public void updateExerciseMetadata(Exercise exercise, Exercise.ExerciseMetadata metadata) {
        exercise.setMetadata(metadata);
        exerciseRepository.save(exercise);
    }

    public List<Exercise> getExercisesByCourse(String courseId) {
        return exerciseRepository.findByCourseId(courseId);
    }
}
