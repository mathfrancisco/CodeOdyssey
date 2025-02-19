// CodeExecutionResponse.java
package com.codeodysseyprogramming.CodeOdissey.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class CodeExecutionResponse {
    private boolean success;
    private List<TestResult> testResults;
    private int score;
    private String message;

    public CodeExecutionResponse(boolean success, List<TestResult> testResults) {
        this.success = success;
        this.testResults = testResults;
    }


}