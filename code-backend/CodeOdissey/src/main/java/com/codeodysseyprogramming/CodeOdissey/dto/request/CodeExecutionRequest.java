package com.codeodysseyprogramming.CodeOdissey.dto.request;

import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CodeExecutionRequest {
    @NotBlank(message = "Code cannot be empty")
    private String code;

    @NotBlank(message = "Language must be specified")
    private String language;

    private String input;

    private List<Exercise.TestCase> testCases;


    // Getters and Setters
}
