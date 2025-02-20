package com.codeodysseyprogramming.CodeOdissey.services;

import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.dto.response.TestResult;
import com.codeodysseyprogramming.CodeOdissey.models.CodeSubmission;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.repositories.CodeSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CodeExecutionService {

    @Autowired
    private CodeSubmissionRepository codeSubmissionRepository;

    public CodeExecutionResponse executeCode(String code, String language, List<Exercise.TestCase> testCases){
        List<TestResult> results = new ArrayList<>();
        boolean allTestsPassed = true;

        for (Exercise.TestCase testCase : testCases) {
            TestResult result = executeTestCase(code, language, testCase);
            results.add(result);
            if (!result.isPassed()) {
                allTestsPassed = false;
            }
        }

        return new CodeExecutionResponse(allTestsPassed, results);
    }

    public CodeExecutionResponse submitSolution(Exercise exercise, String code, String userId) {
        CodeExecutionResponse executionResponse = executeCode(code, exercise.getLanguage(), exercise.getTestCases());

        // Save submission
        CodeSubmission submission = new CodeSubmission();
        submission.setUserId(userId);
        submission.setExerciseId(exercise.getId());  // Assuming getId() method exists
        submission.setCode(code);
        submission.setLanguage(exercise.getLanguage());
        submission.setSuccessful(executionResponse.isSuccess());
        submission.setSubmittedAt(LocalDateTime.now());
        codeSubmissionRepository.save(submission);

        return executionResponse;
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
        // TODO: Implement actual code execution service integration
        return "Simulated output";
    }

    public List<CodeSubmission> getExerciseSubmissions(String exerciseId) {
        return codeSubmissionRepository.findByExerciseId(exerciseId);
    }
}
