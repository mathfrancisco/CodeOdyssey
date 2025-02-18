package com.codeodisseyprogramming.repositories;

import com.codeodisseyprogramming.models.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByLanguage(String language);
    List<Exercise> findByDifficulty(Exercise.Difficulty difficulty);
    
    @Query("{'language': ?0, 'difficulty': ?1}")
    List<Exercise> findByLanguageAndDifficulty(String language, Exercise.Difficulty difficulty);
    
    @Query("{'pointsValue': {$gte: ?0}}")
    List<Exercise> findByMinimumPoints(int points);
}
