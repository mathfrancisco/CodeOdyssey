package com.codeodysseyprogramming.CodeOdissey.repositories;

import com.codeodysseyprogramming.CodeOdissey.models.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    // Change from findByExerciseId to findByExerciseIdsContaining
    List<Lesson> findByExerciseIdsContaining(String exerciseId);
    List<Lesson> findByCourseId(String courseId);
    List<Lesson> findByCourseIdAndExerciseIdsContaining(String courseId, String exerciseId);
}
