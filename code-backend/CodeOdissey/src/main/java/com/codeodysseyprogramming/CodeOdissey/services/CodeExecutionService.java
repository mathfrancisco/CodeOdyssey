package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.dto.response.TestResult;
import com.codeodysseyprogramming.CodeOdissey.models.CodeSubmission;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.repositories.CodeSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CodeExecutionService {

    @Autowired
    private CodeSubmissionRepository codeSubmissionRepository;

    @Autowired
    private ExerciseService exerciseService;

    public CodeExecutionResponse executeCode(String code, String language, String input) {
        try {
            // Integrate with JDoodle or similar service
            String output = executeCodeExternally(code, language, input);

            return new CodeExecutionResponse(
                    true,
                    output,
                    null,
                    new CodeSubmission.ExecutionMetrics(/* metrics from execution */)
            );
        } catch (Exception e) {
            return new CodeExecutionResponse(
                    false,
                    null,
                    e.getMessage(),
                    null
            );
        }
    }

    public CodeExecutionResponse submitSolution(String exerciseId, String code, String userId) {
        Exercise exercise = exerciseService.getExerciseById(exerciseId);
        List<TestResult> results = new ArrayList<>();
        boolean allTestsPassed = true;

        for (Exercise.TestCase testCase : exercise.getTestCases()) {
            TestResult result = executeTestCase(code, exercise.getLanguage(), testCase);
            results.add(result);

            if (!result.isPassed()) {
                allTestsPassed = false;
            }
        }

        // Save submission
        CodeSubmission submission = new CodeSubmission();
        submission.setUserId(userId);
        submission.setExerciseId(exerciseId);
        submission.setCode(code);
        submission.setLanguage(exercise.getLanguage());
        submission.setSuccessful(allTestsPassed);
        submission.setSubmittedAt(LocalDateTime.now());

        codeSubmissionRepository.save(submission);

        // Update exercise statistics
        updateExerciseStatistics(exerciseId, allTestsPassed);

        return new CodeExecutionResponse(allTestsPassed, results);
    }

    private void updateExerciseStatistics(String exerciseId, boolean allTestsPassed) {
        Exercise exercise = exerciseService.getExerciseById(exerciseId);
        Exercise.ExerciseMetadata metadata = exercise.getMetadata();
        metadata.setTotalAttempts(metadata.getTotalAttempts() + 1);

        if (allTestsPassed) {
            metadata.setTotalCompletions(metadata.getTotalCompletions() + 1);
        }

        exerciseService.updateExerciseMetadata(exercise, metadata);
    }

    private TestResult executeTestCase(String code, String language, Exercise.TestCase testCase) {
        String output = executeCodeExternally(code, language, testCase.getInput());
        boolean passed = output.trim().equals(testCase.getExpectedOutput().trim());

        return new TestResult(
                testCase.isVisible() ? testCase.getDescription() : "Hidden Test Case",
                passed,
                testCase.isVisible() ? output : null,
                testCase.isVisible() ? testCase.getExpectedOutput() : null
        );
    }

    private String executeCodeExternally(String code, String language, String input) {
        // Implement integration with code execution service (e.g., JDoodle)
        // This is a placeholder
        return "Simulated output";
    }

    public Page<CodeSubmission> getUserSubmissions(String userId, Pageable pageable) {
        return codeSubmissionRepository.findByUserId(userId, pageable);
    }

    public Map<String, Object> getExerciseStatistics(String exerciseId) {
        return codeSubmissionRepository.getExerciseStatistics(exerciseId);
    }
}