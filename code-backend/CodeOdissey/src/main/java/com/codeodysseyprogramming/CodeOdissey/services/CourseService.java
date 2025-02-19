package com.codeodysseyprogramming.CodeOdissey.services;


import com.codeodysseyprogramming.CodeOdissey.dto.request.CourseRequest;
import com.codeodysseyprogramming.CodeOdissey.exceptions.ResourceNotFoundException;
import com.codeodysseyprogramming.CodeOdissey.models.Course;
import com.codeodysseyprogramming.CodeOdissey.repositories.CourseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public Course createCourse(@Valid CourseRequest courseRequest, String username) {
        Course course = new Course();
        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        course.setLevel(courseRequest.getLevel());
        course.setTechnologies(courseRequest.getTechnologies());
        course.setInstructorId(username);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());

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
    
    public List<Course> searchCourses(List<String> technologies, Course.Level level, Pageable pageable) {
        return courseRepository.findByTechnologiesAndLevel(technologies, level);
    }
    
    public void deleteCourse(String id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }


    public Page<Course> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }
}
