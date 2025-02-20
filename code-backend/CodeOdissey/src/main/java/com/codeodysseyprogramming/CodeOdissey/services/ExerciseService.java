package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeSubmissionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.repositories.ExerciseRepository;
import com.codeodysseyprogramming.CodeOdissey.repositories.ProgressOperations;
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
    private ProgressOperations progressOperations;  // Use interface instead of concrete class

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

        CodeExecutionResponse response = codeExecutionService.submitSolution(
                exercise,
                submission.getCode(),
                userId
        );

        if (response.isSuccess()) {
            Exercise.ExerciseMetadata metadata = new Exercise.ExerciseMetadata();
            metadata.setTotalAttempts(exercise.getMetadata().getTotalAttempts() + 1);
            metadata.setTotalCompletions(exercise.getMetadata().getTotalCompletions() + 1);
            updateExerciseMetadata(exercise, metadata);

            if (exercise.getLessonId() != null) {
                progressOperations.updateExerciseCompletion(userId, exercise.getLessonId(), exerciseId);
            }
        } else {
            Exercise.ExerciseMetadata metadata = new Exercise.ExerciseMetadata();
            metadata.setTotalAttempts(exercise.getMetadata().getTotalAttempts() + 1);
            metadata.setTotalCompletions(exercise.getMetadata().getTotalCompletions());
            updateExerciseMetadata(exercise, metadata);
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
