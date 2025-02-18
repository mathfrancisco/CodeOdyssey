package com.codeodysseyprogramming.CodeOdissey.repositories;


import com.codeodysseyprogramming.CodeOdissey.models.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {


}
