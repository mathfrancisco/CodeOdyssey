package com.codeodisseyprogramming.repositories;

import com.codeodisseyprogramming.models.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByInstructorId(String instructorId);
    List<Course> findByLevel(Course.Level level);
    List<Course> findByTechnologiesContaining(String technology);
    
    @Query("{'technologies': {$in: ?0}, 'level': ?1}")
    List<Course> findByTechnologiesAndLevel(List<String> technologies, Course.Level level);
    
    @Query("{'rating': {$gte: ?0}}")
    List<Course> findByMinimumRating(double rating);
}
