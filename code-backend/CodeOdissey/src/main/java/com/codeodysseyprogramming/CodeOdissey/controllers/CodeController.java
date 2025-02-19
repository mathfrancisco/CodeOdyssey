package com.codeodysseyprogramming.CodeOdissey.controllers;

import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeExecutionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeSubmissionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.models.CodeSubmission;
import com.codeodysseyprogramming.CodeOdissey.services.CodeExecutionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/code")
public class CodeController {

    @Autowired
    private CodeExecutionService codeExecutionService;

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(
            @Valid @RequestBody CodeExecutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                codeExecutionService.executeCode(
                        request.getCode(),
                        request.getLanguage(),
                        request.getInput()
                )
        );
    }

    @PostMapping("/submit/{exerciseId}")
    public ResponseEntity<CodeExecutionResponse> submitSolution(
            @PathVariable String exerciseId,
            @Valid @RequestBody CodeSubmissionRequest submission,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                codeExecutionService.submitSolution(
                        exerciseId,
                        submission.getCode(),
                        userDetails.getUsername()
                )
        );
    }

    @GetMapping("/history")
    public ResponseEntity<Page<CodeSubmission>> getSubmissionHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                codeExecutionService.getUserSubmissions(
                        userDetails.getUsername(),
                        PageRequest.of(page, size, Sort.by("submittedAt").descending())
                )
        );
    }

    @GetMapping("/statistics/{exerciseId}")
    public ResponseEntity<Map<String, Object>> getExerciseStatistics(
            @PathVariable String exerciseId) {
        return ResponseEntity.ok(
                codeExecutionService.getExerciseStatistics(exerciseId)
        );
    }
}