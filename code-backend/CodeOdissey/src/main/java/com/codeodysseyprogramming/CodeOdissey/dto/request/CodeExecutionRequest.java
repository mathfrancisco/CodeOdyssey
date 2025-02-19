package com.codeodysseyprogramming.CodeOdissey.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeExecutionRequest {
    @NotBlank(message = "Code cannot be empty")
    private String code;

    @NotBlank(message = "Language must be specified")
    private String language;

    private String input;
    // Getters and Setters
}
