package com.codeodysseyprogramming.CodeOdissey.controllers;


import com.codeodysseyprogramming.CodeOdissey.dto.request.CodeSubmissionRequest;
import com.codeodysseyprogramming.CodeOdissey.dto.response.CodeExecutionResponse;
import com.codeodysseyprogramming.CodeOdissey.models.Exercise;
import com.codeodysseyprogramming.CodeOdissey.services.ExerciseService;
import com.codeodysseyprogramming.CodeOdissey.services.ProgressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private ProgressService progressService;

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
        CodeExecutionResponse response = exerciseService.submitSolution(
            id, 
            submission,
            userDetails.getUsername()
        );
        
        // Update progress if submission was successful
        if (response.isSuccess()) {
            Exercise exercise = exerciseService.getExerciseById(id);
            progressService.updateExerciseCompletion(
                userDetails.getUsername(),
                exercise.getLessonId(),
                id
            );
        }
        
        return ResponseEntity.ok(response);
    }
      @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Exercise>> getExercisesByCourse(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // First check if user has access to the course
        if (!progressService.hasAccessToCourse(userDetails.getUsername(), courseId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(exerciseService.getExercisesByCourse(courseId));
    }
}
