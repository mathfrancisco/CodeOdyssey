package com.codeodysseyprogramming.CodeOdissey.services;


import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.dto.response.TestResult;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class CodeExecutionService {
    
    public CodeExecutionResponse executeCode(String code, String language, List<Exercise.TestCase> testCases) {
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
    
    private TestResult executeTestCase(String code, String language, Exercise.TestCase testCase) {
        try {
            // Integração com JDoodle ou outro serviço de execução de código
            String output = executeCodeWithInput(code, language, testCase.getInput());
            boolean passed = output.trim().equals(testCase.getExpectedOutput().trim());
            
            return new TestResult(
                testCase.isVisible() ? testCase.getDescription() : "Hidden Test Case",
                passed,
                testCase.isVisible() ? output : null,
                testCase.isVisible() ? testCase.getExpectedOutput() : null
            );
        } catch (Exception e) {
            return new TestResult(
                testCase.isVisible() ? testCase.getDescription() : "Hidden Test Case",
                false,
                "Error: " + e.getMessage(),
                null
            );
        }
    }
    
    private String executeCodeWithInput(String code, String language, String input) {
        // Implementar integração com serviço de execução de código
        // Este é um placeholder para a implementação real
        return "Placeholder output";
    }
}
