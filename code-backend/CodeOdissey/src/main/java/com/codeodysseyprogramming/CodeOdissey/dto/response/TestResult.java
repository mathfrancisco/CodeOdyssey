// TestResult.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

public class TestResult {
    private String description;
    private boolean passed;
    private String actualOutput;
    private String expectedOutput;
    private String errorMessage;

    public TestResult(String description, boolean passed, String actualOutput, String expectedOutput) {
        this.description = description;
        this.passed = passed;
        this.actualOutput = actualOutput;
        this.expectedOutput = expectedOutput;
    }

    // Getters and Setters
}