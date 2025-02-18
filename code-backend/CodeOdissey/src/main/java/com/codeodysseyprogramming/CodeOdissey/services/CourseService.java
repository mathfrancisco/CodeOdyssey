package com.codeodisseyprogramming.services;

import com.codeodisseyprogramming.models.Course;
import com.codeodisseyprogramming.repositories.CourseRepository;
import com.codeodisseyprogramming.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        course.setEnrolledCount(0);
        course.setRating(0.0);
        return courseRepository.save(course);
    }
    
    public Course updateCourse(String id, Course courseUpdate) {
        Course course = getCourseById(id);
        
        // Update fields
        course.setTitle(courseUpdate.getTitle());
        course.setDescription(courseUpdate.getDescription());
        course.setLevel(courseUpdate.getLevel());
        course.setTechnologies(courseUpdate.getTechnologies());
        course.setModules(courseUpdate.getModules());
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }
    
    public Course getCourseById(String id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }
    
    public List<Course> getCoursesByInstructor(String instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }
    
    public List<Course> getCoursesByLevel(Course.Level level) {
        return courseRepository.findByLevel(level);
    }
    
    public List<Course> searchCourses(List<String> technologies, Course.Level level) {
        return courseRepository.findByTechnologiesAndLevel(technologies, level);
    }
    
    public void deleteCourse(String id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }
}
