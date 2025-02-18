package com.codeodisseyprogramming.controllers;

import com.codeodisseyprogramming.models.Exercise;
import com.codeodisseyprogramming.services.ExerciseService;
import com.codeodisseyprogramming.dtos.requests.CodeSubmissionRequest;
import com.codeodisseyprogramming.dtos.responses.CodeExecutionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exercises")
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
            @RequestBody CodeSubmissionRequest submission) {
        return ResponseEntity.ok(exerciseService.submitSolution(id, submission));
    }
}
