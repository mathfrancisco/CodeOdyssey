package com.codeodysseyprogramming.CodeOdissey.repositories;


import com.codeodysseyprogramming.CodeOdissey.models.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.lang.ScopedValue;
import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserIdAndCourseId(String userId, String courseId);
     List<Progress> findByUserId(String userId);

     @Query("{'userId': ?0, 'courseId': ?1, 'status': 'COMPLETED'}")
     List<Progress> findCompletedProgress(String userId, String courseId);
}
