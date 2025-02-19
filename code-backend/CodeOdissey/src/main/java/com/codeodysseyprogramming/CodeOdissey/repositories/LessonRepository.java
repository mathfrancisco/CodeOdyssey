package com.codeodysseyprogramming.CodeOdissey.repositories;

import com.codeodysseyprogramming.CodeOdissey.models.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByExerciseId(String exerciseId);
    List<Lesson> findByCourseId(String courseId);
    List<Lesson> findByCourseIdAndExerciseId(String courseId, String exerciseId);

}
