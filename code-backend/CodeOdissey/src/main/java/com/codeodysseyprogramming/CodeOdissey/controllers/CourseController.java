package com.codeodisseyprogramming.controllers;

import com.codeodisseyprogramming.models.Course;
import com.codeodisseyprogramming.services.CourseService;
import com.codeodisseyprogramming.dtos.requests.CourseRequest;
import com.codeodisseyprogramming.dtos.responses.CourseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Validated
public class CourseController {
    @Autowired
    private CourseService courseService;


    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CourseRequest courseRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        Course course = courseService.createCourse(courseRequest, userDetails.getUsername());
        return ResponseEntity.ok(mapToCourseResponse(course));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
        return ResponseEntity.ok(courseService.updateCourse(id, course));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }
     @GetMapping
    public ResponseEntity<Page<CourseResponse>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Course> courses = courseService.getAllCourses(pageable);
        return ResponseEntity.ok(courses.map(this::mapToCourseResponse));
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructorId) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(instructorId));
    }

     @GetMapping("/search")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam(required = false) List<String> technologies,
            @RequestParam(required = false) Course.Level level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.searchCourses(technologies, level, pageable);
        return ResponseEntity.ok(courses.map(this::mapToCourseResponse));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}
