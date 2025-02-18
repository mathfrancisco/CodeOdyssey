package com.codeodysseyprogramming.CodeOdissey.controllers;


import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeSubmissionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.services.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@Validated
public class ExerciseController {
    @Autowired
    private ExerciseService exerciseService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.createExercise(exercise));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Exercise> updateExercise(@PathVariable String id, @RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, exercise));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExercise(@PathVariable String id) {
        return ResponseEntity.ok(exerciseService.getExerciseById(id));
    }

   @PostMapping("/{id}/submit")
    public ResponseEntity<CodeExecutionResponse> submitSolution(
            @PathVariable String id,
            @Valid @RequestBody CodeSubmissionRequest submission,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            exerciseService.submitSolution(id, submission, userDetails.getUsername())
        );
    }
     @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Exercise>> getExercisesByCourse(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            exerciseService.getExercisesByCourse(courseId, userDetails.getUsername())
        );
    }
}
