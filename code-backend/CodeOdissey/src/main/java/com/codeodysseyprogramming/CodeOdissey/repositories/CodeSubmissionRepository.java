package com.codeodysseyprogramming.CodeOdissey.repositories;

import com.codeodysseyprogramming.CodeOdissey.models.CodeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Map;

public interface CodeSubmissionRepository extends MongoRepository<CodeSubmission, String> {
     List<CodeSubmission> findByUserId(String userId);
     List<CodeSubmission> findByExerciseId(String exerciseId);
     List<CodeSubmission> findByUserIdAndExerciseId(String userId, String exerciseId);

    Map<String, Object> getExerciseStatistics(String exerciseId);
}
