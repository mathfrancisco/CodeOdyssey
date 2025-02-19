package com.codeodysseyprogramming.CodeOdissey.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "code_submissions")
public class CodeSubmission {
    @Id
    private String id;
    private String userId;
    private String exerciseId;
    private String code;
    private String language;
    private boolean successful;
    private String output;
    private LocalDateTime submittedAt;
    private ExecutionMetrics metrics;

    @Getter
    @Setter
    public static class ExecutionMetrics {
        private long executionTime; // in milliseconds
        private long memoryUsed; // in bytes
        private int testsPassed;
        private int totalTests;
    }
}