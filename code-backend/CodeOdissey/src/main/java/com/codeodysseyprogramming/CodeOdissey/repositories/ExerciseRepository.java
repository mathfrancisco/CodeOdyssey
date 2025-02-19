public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    List<Exercise> findByLanguage(String language);
    List<Exercise> findByDifficulty(Exercise.Difficulty difficulty);
    List<Exercise> findByCourseId(String courseId);
    
    @Query("{'language': ?0, 'difficulty': ?1}")
    List<Exercise> findByLanguageAndDifficulty(String language, Exercise.Difficulty difficulty);
    
    @Query("{'pointsValue': {$gte: ?0}}")
    List<Exercise> findByMinimumPoints(int points);
}
