package com.codeodysseyprogramming.CodeOdissey.repositories;

import com.codeodysseyprogramming.CodeOdissey.models.CodeSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Map;

public interface CodeSubmissionRepository extends MongoRepository<CodeSubmission, String> {
    Page<CodeSubmission> findByUserId(String userId, Pageable pageable);
    List<CodeSubmission> findByExerciseId(String exerciseId);
    List<CodeSubmission> findByUserIdAndExerciseId(String userId, String exerciseId);
    
    @Query(value = "{ 'exerciseId': ?0 }", 
           fields = "{ 'successful': 1, 'executionTime': 1, 'submittedAt': 1 }")
    List<CodeSubmission> findStatisticsByExerciseId(String exerciseId);
    
    @Query(value = "{" +
           "  'exerciseId': ?0," +
           "  'successful': true" +
           "}", count = true)
    long countSuccessfulSubmissions(String exerciseId);
}
