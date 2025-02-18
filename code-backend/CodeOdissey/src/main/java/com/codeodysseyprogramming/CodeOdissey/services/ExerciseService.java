package com.codeodisseyprogramming.services;

import com.codeodisseyprogramming.models.Exercise;
import com.codeodisseyprogramming.repositories.ExerciseRepository;
import com.codeodisseyprogramming.dtos.requests.CodeSubmissionRequest;
import com.codeodisseyprogramming.dtos.responses.CodeExecutionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExerciseService {
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private CodeExecutionService codeExecutionService;

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

    public CodeExecutionResponse submitSolution(String exerciseId, CodeSubmissionRequest submission) {
        Exercise exercise = getExerciseById(exerciseId);
        
        // Execute code against test cases
        CodeExecutionResponse response = codeExecutionService.executeCode(
            submission.getCode(),
            exercise.getLanguage(),
            exercise.getTestCases()
        );
        
        // Update exercise metadata
        updateExerciseMetadata(exercise, response.isSuccess());
        
        return response;
    }

    private void updateExerciseMetadata(Exercise exercise, boolean isSuccess) {
        ExerciseMetadata metadata = exercise.getMetadata();
        metadata.setTotalAttempts(metadata.getTotalAttempts() + 1);
        
        if (isSuccess) {
            metadata.setTotalCompletions(metadata.getTotalCompletions() + 1);
        }
        
        metadata.setSuccessRate(
            (metadata.getTotalCompletions() * 100) / metadata.getTotalAttempts()
        );
        
        exerciseRepository.save(exercise);
    }
}
